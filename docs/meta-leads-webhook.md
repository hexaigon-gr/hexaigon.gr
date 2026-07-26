# Meta Lead Ads → Discord webhook

Instant Discord notification the moment someone submits a Meta (Facebook/Instagram) lead form.
No Zapier, no polling, no 12-hour notification delay — Meta pushes to us in real time.

**Endpoint:** `POST|GET https://hexaigon.gr/api/webhooks/meta-leads`
**Code:** [`app/api/webhooks/meta-leads/route.ts`](../app/api/webhooks/meta-leads/route.ts), helpers in [`lib/meta-leads/`](../lib/meta-leads/)

---

## How it works

1. Someone submits your Instant Form on Facebook or Instagram.
2. Meta `POST`s a small notification to our endpoint (`leadgen_id`, `page_id`, `form_id`, `ad_id`)
   signed with `X-Hub-Signature-256`.
3. We verify that HMAC signature against `META_APP_SECRET`. Unsigned/forged requests get `401`.
4. We call `GET /v25.0/{leadgen_id}` with the Page access token to pull the actual answers.
5. We post a formatted embed to Discord and return `200`.

If the Discord post fails we return `500` on purpose — Meta then retries for up to 36 hours,
so a lead is never silently lost. A short-lived in-memory set suppresses duplicate posts.

If `META_PAGE_ACCESS_TOKEN` is missing (e.g. App Review still pending), step 4 is skipped and
you still get an instant amber alert with the lead ID and a Leads Center link.

---

## Setup

### 1. Meta app

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps) → **Create app** →
   use case **Other** → type **Business**, and link it to the Business portfolio that owns the
   hexaigon Page and ad account.

   Use a **dedicated app** for this (e.g. "Hexaigon Leads"). Don't reuse an unrelated app —
   App Review is judged per app against its stated purpose, and each app gets only one Page
   webhook callback URL.
2. A new app lands on the **use-case dashboard**, which shows *"No use cases on this app."*
   Webhooks and permissions are no longer top-level products — they live inside a use case.

   Click **Add use cases** → filter **Ads and monetization** → tick
   **"Capture & manage ad leads with Marketing API"** → **Save**. That is the lead-ads use case;
   it carries `leads_retrieval`.

   Do *not* add "Create & manage ads with Marketing API" or "Measure ad performance" — those are
   for building campaigns programmatically and carry far heavier App Review.

   Then **Dashboard → the use case → Customize** and confirm it exposes `leads_retrieval`,
   `pages_manage_metadata`, and a **Webhooks** section for the Page object. Only if
   `pages_manage_metadata` is missing, additionally add **Manage everything on your Page**
   (Content management) and click **Add** next to `pages_manage_metadata` and
   `pages_read_engagement` there.

   > ⚠️ Use cases **cannot be removed** once added — only added to. Add the minimum, verify what
   > it gives you, then top up only if there is a real gap.

   The minimum this integration needs: **`leads_retrieval`** + **`pages_manage_metadata`**.
   `ads_management` only adds the campaign/ad name lines to the Discord embed and is optional.

3. **App settings → Basic**: copy the **App Secret** → `META_APP_SECRET`.

### 2. Environment variables

Set these locally in `.env` and on **Vercel → Project → Settings → Environment Variables**
(Production + Preview), then redeploy:

| Variable | Required | Notes |
| --- | --- | --- |
| `META_APP_SECRET` | ✅ | Validates the webhook signature |
| `META_VERIFY_TOKEN` | ✅ | Any random string; must match the App Dashboard. `openssl rand -hex 24` |
| `DISCORD_LEADS_WEBHOOK_URL` | ✅ | Falls back to `DISCORD_WEBHOOK_URL` |
| `META_PAGE_ACCESS_TOKEN` | Recommended | Long-lived Page token with `leads_retrieval` |
| `META_GRAPH_VERSION` | — | Defaults to `v25.0` |
| `DISCORD_LEADS_MENTION` | — | e.g. `@here` or `<@&ROLE_ID>` to ping on every lead |

Get the Discord webhook from **Server Settings → Integrations → Webhooks → New Webhook**.

### 3. Register the callback URL

App Dashboard → **Webhooks** → subscribe to the **Page** object → **Edit subscription**:

- **Callback URL:** `https://hexaigon.gr/api/webhooks/meta-leads`
- **Verify token:** the exact `META_VERIFY_TOKEN` value

Click **Verify and save**. Meta sends a `GET` with `hub.challenge`; our handler echoes it back.
Then subscribe to the **`leadgen`** field on that Page object.

> The URL must be HTTPS with a real certificate — Vercel gives you this for free.
> Self-signed certs are rejected.

### 4. Get a long-lived Page access token

In [Graph API Explorer](https://developers.facebook.com/tools/explorer/), pick your app and
request these permissions, then **Generate Access Token**:

```
pages_show_list, pages_read_engagement, pages_manage_metadata, leads_retrieval, ads_management
```

Switch the token dropdown from *User Token* to your **Page** to get a Page token, then extend it
to a long-lived (~60 day, effectively non-expiring for Page tokens) one:

```bash
curl -G "https://graph.facebook.com/v25.0/oauth/access_token" \
  -d grant_type=fb_exchange_token \
  -d client_id=YOUR_APP_ID \
  -d client_secret=YOUR_APP_SECRET \
  -d fb_exchange_token=YOUR_SHORT_LIVED_PAGE_TOKEN
```

Put the result in `META_PAGE_ACCESS_TOKEN`.

### 5. Install the app on the Page

This is the step people forget — the webhook stays silent without it:

```bash
curl -X POST "https://graph.facebook.com/v25.0/YOUR_PAGE_ID/subscribed_apps" \
  -d subscribed_fields=leadgen \
  -d access_token=YOUR_PAGE_ACCESS_TOKEN
```

Expected: `{"success": true}`. Verify with the same URL as a `GET`.

### 6. App Review — required before real leads work

This is the gate that matters, so be clear about it:

> "You can't retrieve leads if your app is in Development mode. For testing purposes,
> Development mode app users can access leads submitted by someone with a role in that same app."
> — [Meta Lead Ads guide](https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads)

So in **Development** mode you can only pull leads *you* submitted yourself (via the testing
tool or as an app admin/developer/tester). Leads from actual strangers clicking your ad are
**not** retrievable until the app is **Live**.

To go Live:

1. Submit App Review with `leads_retrieval` and `pages_manage_ads`. Reviewers expect a working
   `leadgen` webhook subscription, so finish steps 1–5 first — a broken endpoint fails the review.
2. Complete **Business Verification** for the Business portfolio.
3. Flip the app to **Live** in the App Dashboard.

Budget a few days for this. Until it's done, run the testing tool to confirm the plumbing works.

---

## Testing

Use the [Lead Ads Testing Tool](https://developers.facebook.com/tools/lead-ads-testing) — pick
your Page and form, submit a test lead, and it fires a real webhook. Test leads are free and
don't pollute your CRM exports.

Two quick local checks:

```bash
# Handshake — should print back "test123"
curl "http://localhost:3000/api/webhooks/meta-leads?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test123"

# Unsigned POST — should return 401
curl -X POST http://localhost:3000/api/webhooks/meta-leads \
  -H 'Content-Type: application/json' -d '{"object":"page","entry":[]}'
```

To simulate a signed delivery locally:

```bash
BODY='{"object":"page","entry":[{"id":"1","time":1,"changes":[{"field":"leadgen","value":{"leadgen_id":"999","page_id":"1","form_id":"2","ad_id":"3","created_time":1}}]}]}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$META_APP_SECRET" | sed 's/^.* //')
curl -X POST http://localhost:3000/api/webhooks/meta-leads \
  -H 'Content-Type: application/json' \
  -H "X-Hub-Signature-256: sha256=$SIG" \
  -d "$BODY"
```

Expose localhost to Meta with `npx untun@latest tunnel http://localhost:3000` or `ngrok http 3000`.

---

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| "The URL couldn't be validated" when saving | `META_VERIFY_TOKEN` mismatch, or not deployed yet |
| `401` in Vercel logs | `META_APP_SECRET` wrong, or a body-modifying proxy in front |
| Webhook never fires | `subscribed_apps` step skipped, or `leadgen` field not subscribed |
| Amber "Lead details unavailable" embed | `META_PAGE_ACCESS_TOKEN` missing/expired, or `leads_retrieval` not granted |
| `(#100) …` in logs | Token belongs to a User, not the Page |

Logs: **Vercel → Project → Logs**, filter on `[meta-leads]`.

---

## Costs

Free. Vercel Hobby covers the function invocations, Discord webhooks are free, and Meta's
Webhooks + Graph API have no charge for lead retrieval.
