import { NextRequest } from "next/server";

import { postLeadToDiscord } from "@/lib/meta-leads/discord";
import { fetchLead } from "@/lib/meta-leads/graph";
import { safeEqual, verifyMetaSignature } from "@/lib/meta-leads/signature";
import type { LeadgenValue, MetaWebhookPayload } from "@/lib/meta-leads/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Meta retries undelivered notifications for up to 36 hours and can legitimately send
 * the same event twice. This keeps the warm instance from double-posting; it is a best
 * effort filter, not a guarantee across cold starts.
 */
const seenLeads = new Set<string>();

const alreadyHandled = (leadgenId: string) => {
  if (seenLeads.has(leadgenId)) return true;
  seenLeads.add(leadgenId);
  if (seenLeads.size > 500) seenLeads.delete(seenLeads.values().next().value as string);
  return false;
};

/**
 * Webhook verification handshake. Meta calls this once when you save the callback URL
 * and expects the raw `hub.challenge` value echoed back as plain text.
 */
export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  // Plain GET with no hub params: "is this deployed and configured?" probe.
  // Reports only whether each variable is present — never its value.
  if (!mode && !token && !challenge) {
    return Response.json({
      ok: true,
      service: "meta-lead-webhook",
      configured: {
        appSecret: Boolean(process.env.META_APP_SECRET),
        verifyToken: Boolean(process.env.META_VERIFY_TOKEN),
        pageToken: Boolean(process.env.META_PAGE_ACCESS_TOKEN),
        discord: Boolean(process.env.DISCORD_LEADS_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL),
      },
    });
  }

  const verifyToken = process.env.META_VERIFY_TOKEN;
  if (!verifyToken) {
    console.error("[meta-leads] META_VERIFY_TOKEN is not configured");
    return new Response("Not configured", { status: 500 });
  }

  if (mode === "subscribe" && challenge && token && safeEqual(token, verifyToken)) {
    return new Response(challenge, {
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new Response("Forbidden", { status: 403 });
};

/** Lead notifications. Authenticated purely by the X-Hub-Signature-256 HMAC. */
export const POST = async (request: NextRequest) => {
  const rawBody = await request.text();

  const signature = verifyMetaSignature(rawBody, request.headers.get("x-hub-signature-256"));
  if (!signature.ok) {
    console.warn(`[meta-leads] Rejected request: ${signature.reason}`);
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: MetaWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as MetaWebhookPayload;
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const notifications: LeadgenValue[] = (payload.entry ?? [])
    .flatMap((entry) => entry.changes ?? [])
    .filter((change) => change.field === "leadgen" && change.value?.leadgen_id)
    .map((change) => change.value as LeadgenValue);

  // Ack anything that is not a lead (other subscribed fields, test pings) so Meta stops retrying.
  if (payload.object !== "page" || notifications.length === 0) {
    return new Response("EVENT_RECEIVED", { status: 200 });
  }

  const results = await Promise.all(
    notifications.map(async (notification) => {
      if (alreadyHandled(notification.leadgen_id)) return true;

      const lead = await fetchLead(notification.leadgen_id);
      const delivered = await postLeadToDiscord(notification, lead);

      // Let Meta redeliver instead of silently losing the lead.
      if (!delivered) seenLeads.delete(notification.leadgen_id);
      return delivered;
    })
  );

  if (results.some((delivered) => !delivered)) {
    return new Response("Delivery failed", { status: 500 });
  }

  return new Response("EVENT_RECEIVED", { status: 200 });
};
