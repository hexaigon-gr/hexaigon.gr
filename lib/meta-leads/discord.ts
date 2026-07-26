import type { GraphLead, LeadgenValue } from "./types";

const DISCORD_EMBED_FIELD_LIMIT = 25;
const DISCORD_FIELD_VALUE_LIMIT = 1024;

/** Answers people actually care about first; everything else keeps its form order. */
const FIELD_PRIORITY = ["full_name", "first_name", "last_name", "email", "phone_number", "phone"];

const FIELD_ICONS: Record<string, string> = {
  full_name: "👤",
  first_name: "👤",
  last_name: "👤",
  email: "📧",
  phone_number: "📞",
  phone: "📞",
  company_name: "🏢",
  job_title: "💼",
  city: "📍",
  street_address: "📍",
  post_code: "📮",
  inbox_url: "💬",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const truncate = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

/** `what_is_your_budget?` → `What Is Your Budget` */
const prettyLabel = (name: string) =>
  name
    .replace(/[?_]+$/g, "")
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || name;

const sortFields = (fields: NonNullable<GraphLead["field_data"]>) =>
  [...fields].sort((a, b) => {
    const rankA = FIELD_PRIORITY.indexOf(a.name);
    const rankB = FIELD_PRIORITY.indexOf(b.name);
    return (rankA === -1 ? FIELD_PRIORITY.length : rankA) - (rankB === -1 ? FIELD_PRIORITY.length : rankB);
  });

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

/** Graph gives an ISO string, the raw notification a unix timestamp; fall back to now. */
const resolveCreatedTime = (notification: LeadgenValue, lead: GraphLead | null) => {
  if (lead?.created_time) return new Date(lead.created_time);
  if (notification.created_time) return new Date(notification.created_time * 1000);
  return new Date();
};

export const buildLeadEmbed = (notification: LeadgenValue, lead: GraphLead | null) => {
  const fields: DiscordEmbedField[] = [];

  if (lead?.field_data?.length) {
    for (const field of sortFields(lead.field_data).slice(0, DISCORD_EMBED_FIELD_LIMIT - 1)) {
      const value = field.values.filter(Boolean).join(", ").trim();
      const icon = FIELD_ICONS[field.name] ?? "•";
      fields.push({
        name: truncate(`${icon} ${prettyLabel(field.name)}`, 256),
        value: truncate(value || "—", DISCORD_FIELD_VALUE_LIMIT),
        inline: value.length <= 40,
      });
    }
  } else {
    fields.push({
      name: "⚠️ Lead details unavailable",
      value:
        "The webhook fired but the answers could not be fetched. Set `META_PAGE_ACCESS_TOKEN` " +
        "(with `leads_retrieval`) or open the lead in Meta Leads Center.",
    });
  }

  const source = [
    lead?.campaign_name && `**Campaign:** ${lead.campaign_name}`,
    lead?.ad_name && `**Ad:** ${lead.ad_name}`,
    lead?.platform && `**Platform:** ${lead.platform}`,
    `**Form ID:** \`${notification.form_id}\``,
  ]
    .filter(Boolean)
    .join("\n");

  fields.push({ name: "📊 Source", value: truncate(source, DISCORD_FIELD_VALUE_LIMIT) });

  const links = [
    `[Leads Center](https://business.facebook.com/latest/instant_forms/forms?asset_id=${notification.page_id})`,
    notification.ad_id &&
      `[Open Ad](https://adsmanager.facebook.com/adsmanager/manage/ads?selected_ad_ids=${notification.ad_id})`,
  ]
    .filter(Boolean)
    .join(" • ");

  const createdTime = resolveCreatedTime(notification, lead);

  return {
    title: "🎯 New Meta Lead",
    description: links,
    color: lead?.field_data?.length ? 0x22c55e : 0xf59e0b,
    fields,
    timestamp: createdTime.toISOString(),
    footer: { text: `Lead ID ${notification.leadgen_id} • hexaigon.gr` },
  };
};

/** Posts the embed and reports success so the caller can decide whether to let Meta retry. */
export const postLeadToDiscord = async (notification: LeadgenValue, lead: GraphLead | null) => {
  const webhookUrl = process.env.DISCORD_LEADS_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[meta-leads] No Discord webhook configured");
    return false;
  }

  const mention = process.env.DISCORD_LEADS_MENTION?.trim();

  const payload = {
    content: mention || undefined,
    allowed_mentions: { parse: mention ? ["everyone", "roles", "users"] : [] },
    embeds: [buildLeadEmbed(notification, lead)],
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await sleep(attempt * 800);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) return true;

      if (response.status === 429) {
        const retry = (await response.json().catch(() => null)) as { retry_after?: number } | null;
        await sleep(Math.min((retry?.retry_after ?? 1) * 1000, 5000));
        continue;
      }

      console.error(
        `[meta-leads] Discord responded ${response.status}:`,
        await response.text().catch(() => "")
      );

      // 4xx means the payload or the webhook URL is wrong — retrying will not help.
      if (response.status < 500) return false;
    } catch (error) {
      console.error("[meta-leads] Discord request failed:", error);
    }
  }

  return false;
};
