import type { GraphLead } from "./types";

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v25.0";

/** Fields on the lead node. Requested as a batch, with a bare fallback if any are unavailable. */
const LEAD_FIELDS = [
  "id",
  "created_time",
  "field_data",
  "ad_id",
  "ad_name",
  "adset_id",
  "adset_name",
  "campaign_id",
  "campaign_name",
  "form_id",
  "is_organic",
  "platform",
].join(",");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const requestLead = async (leadgenId: string, accessToken: string, fields?: string) => {
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${leadgenId}`);
  if (fields) url.searchParams.set("fields", fields);
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url, { cache: "no-store" });
  const body = (await response.json().catch(() => null)) as
    | (GraphLead & { error?: { message?: string; code?: number } })
    | null;

  return { response, body };
};

/**
 * Resolves a `leadgen_id` into the actual answers the person typed.
 *
 * Requires a Page access token with `leads_retrieval`. Returns `null` (never throws)
 * when the token is absent or the call fails, so the webhook can still fire off a
 * minimal Discord alert instead of dropping the lead entirely.
 */
export const fetchLead = async (leadgenId: string): Promise<GraphLead | null> => {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  if (!accessToken) return null;

  // Meta occasionally delivers the webhook a beat before the lead is readable.
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await sleep(attempt * 1200);

    try {
      let { response, body } = await requestLead(leadgenId, accessToken, LEAD_FIELDS);

      // The ad/campaign fields need `ads_management`, which is granted separately from
      // `leads_retrieval` — and one unavailable field rejects the whole request. Fall back to
      // the node's defaults so we still get the answers the person actually typed.
      if (!response.ok) {
        ({ response, body } = await requestLead(leadgenId, accessToken));
      }

      if (response.ok && body?.id) return body;

      console.error(
        `[meta-leads] Graph API ${response.status} for lead ${leadgenId}:`,
        body?.error?.message ?? "unknown error"
      );

      // 4xx other than "not found yet" will not fix themselves on retry.
      if (response.status >= 400 && response.status < 500 && response.status !== 404) return null;
    } catch (error) {
      console.error(`[meta-leads] Graph API request failed for lead ${leadgenId}:`, error);
    }
  }

  return null;
};
