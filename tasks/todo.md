# Digital business card / NFC contact feature

Sellable product: one themed public card page per client, tap-to-save contact,
NFC + QR entry points. Cards are hand-written in one TypeScript file and
prerendered at build time.

## Architecture decision: no database

Originally built against a `digital_cards` Postgres table via Prisma, because the
spec asked for one. Nikos pushed back: for a handful of cards that only we ever
edit, a table costs a migration, a credential, a connection and a query on every
tap, and buys nothing. Correct call, so the DB layer was removed.

What static buys:

- Every card and every vCard is prerendered at build time (`● SSG` in the build
  output for both `/card/[slug]` and `/api/card/[slug]/vcf`).
- The vCard photo is downloaded and base64-embedded **during the build**, so a
  slow or briefly unreachable image host cannot degrade a client's card.
- No `DATABASE_URL`, no `ADMIN_EMAILS`, no `SUPABASE_S3_*`. The feature needs
  zero configuration.
- Slug typos and duplicates fail the build instead of becoming silent 404s.

What it costs, accepted knowingly:

- Clients cannot self-serve edits. Every change is a git push.
- Deactivating a card needs a redeploy (about a minute) rather than a checkbox.

Removed in the rewrite: the `DigitalCard` Prisma model and its migration,
`app/[locale]/admin/cards`, `components/admin/`, `lib/auth/admin.ts`,
`server_actions/digital-cards.ts`, `lib/cards/queries.ts`, `lib/cards/slug.ts`,
and the `.env.template` additions.

## Other deviations from the original spec

- **`qrcode.react`, not `qrcode`.** Already a dependency and already used by
  `app/[locale]/business-card/page.tsx`. No new package needed.
- **Card route lives outside `app/[locale]`.** next-intl runs with
  `localePrefix: "always"`, so a page under `[locale]` could only ever be
  `/el/card/slug`. The requirement is a short `hexaigon.gr/card/slug`, so the
  route sits at `app/card/` with its own root layout and `card` is excluded from
  the `proxy.ts` matcher.
- **Card pages are `noindex, follow`.** Thin, near-duplicate, per-client pages.
  Indexing them at scale risks index bloat on a domain that is otherwise
  SEO-tuned. One-line change if a client wants theirs indexed.

## Final shape

```
lib/cards/data.ts        the CARDS array (hand-edited) + lookups + slug validation
lib/cards/types.ts       Card interface, social platform config
lib/cards/theme.ts       one hex -> accent, contrast, glow, QR foreground
lib/cards/vcard.ts       vCard 3.0 builder (folding, escaping, photo embed)
app/card/layout.tsx      second root layout: fonts, globals, no site chrome
app/card/[slug]/         public page + branded not-found
app/api/card/[slug]/vcf  prerendered vCard download
components/cards/        portrait, contact rows, QR, share/copy
```

Also moved `app/[locale]/globals.css` to `app/globals.css`, since both root
layouts need it and it matches the path `components.json` already declared.

## Verification

- `pnpm tsc --noEmit` clean. `pnpm lint` 0 errors (the 8 warnings are all in
  pre-existing files). `pnpm build` passes.
- **Both card routes prerender.** Build output shows `● /card/[slug]` and
  `● /api/card/[slug]/vcf`.
- **Real generated artifacts inspected** with the template card temporarily
  activated: `.next/server/app/card/hexaigon.html` exists, and
  `.next/server/app/api/card/hexaigon/vcf.body` holds a correct CRLF vCard.
  Critically, `vcf.meta` confirms the headers survive static prerendering:
  `text/vcard; charset=utf-8`, `attachment` with both `filename` and
  `filename*`, and a matching `content-length`.
- **Served over HTTP** from `pnpm start`: `/card/hexaigon` 200 with no locale
  redirect, `/card/unknown-slug` 404, and the vCard downloads at 391 bytes
  matching its `content-length`.
- **Routing:** `/` still 307s to `/el`, so excluding `card` from the matcher did
  not disturb the rest of the site.
- **Rendered and screenshotted** at 390x844 with a mid-tone blue and a pale
  yellow accent. The accent drives the CTA, tints, rim, glow and QR from one
  field; a pale accent correctly flips CTA text to near-black and pulls QR
  modules off the accent, which would otherwise be unscannable. No horizontal
  overflow, no console errors.
- **vCard and data logic executed** against fixtures. Verified: CRLF with no bare
  LF, `N` family/given split, comma and semicolon escaping, phone compaction,
  scheme added to a bare domain, folding at 75 UTF-8 octets that never splits a
  multi-byte character and unfolds back to the exact Greek string, ASCII filename
  falling back to the slug for an all-Greek name, a minimal card emitting no
  stray or `undefined` lines, a date-only `updatedAt` expanding to a valid `REV`,
  an unparseable `updatedAt` omitting `REV` rather than faking one, and both the
  duplicate-slug and malformed-slug build failures.

Defects found and fixed during the visual pass:

1. The hexagon's luminous rim never rendered. `box-shadow` on the same element as
   `clip-path` is clipped away entirely. Now a `filter: drop-shadow` on the
   wrapper plus a slightly larger hexagon behind for the hairline.
2. The company name rendered twice when a client has no logo, once as the header
   fallback and again under the name. The header fallback was dropped.
3. `--accent` collided with the existing shadcn semantic token in `globals.css`.
   Renamed to `--card-accent` before it could break a `bg-accent` inside the card
   subtree.

## State

The one entry in `CARDS` is a template for hexAIgon itself, left
`isActive: false` so nothing unexpected goes live. Its job title is invented
copy; the phone, email and Instagram are the real public values already in
`app/[locale]/business-card/page.tsx`. Flip `isActive` to publish it, or copy the
block for the first client.

## Follow-ups worth considering

- Nothing tracks card views or Save Contact taps, which would be an easy upsell
  and a reason for clients to renew. Needs a real datastore, so it is the one
  thing that would justify revisiting the static decision.
- The pre-existing `ENVIRONMENT_FALLBACK` error printed during `pnpm build` was
  confirmed to reproduce on a clean `HEAD` with none of this feature present. It
  is unrelated to these changes but still worth chasing separately.
