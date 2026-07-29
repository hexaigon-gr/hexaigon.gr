# Digital business cards (NFC contact cards)

A sellable product: one themed page per client at `hexaigon.gr/card/<slug>`, with a
tap-to-save contact button, an NFC-ready short URL and a QR fallback.

**Cards live in:** [`lib/cards/data.ts`](../lib/cards/data.ts)
**Public page:** [`app/card/[slug]/page.tsx`](../app/card/[slug]/page.tsx)
**vCard download:** `GET https://www.hexaigon.gr/api/card/<slug>/vcf`

There is **no database, no admin panel and no environment variable** for this
feature. Cards are hand-written in one TypeScript file and prerendered at build
time.

---

## Adding a client

1. Open [`lib/cards/data.ts`](../lib/cards/data.ts) and copy an entry in `CARDS`.
   Only `slug`, `fullName` and `themeColor` are required; every other field is
   optional and the page adapts. No photo falls back to initials in a hexagon,
   no phone drops that row entirely.
2. Put their images in `public/cards/<slug>/` and point `photoUrl` at
   `/cards/<slug>/photo.jpg`. External URLs work too.
3. Commit and push. Vercel rebuilds and the card is live.
4. Write `https://www.hexaigon.gr/card/<slug>` onto the NFC tag with NFC Tools,
   as a URL/URI record. Lock the tag if you do not want it rewritten.
5. Hand over the QR from the bottom of the card page for non-NFC phones.

```ts
{
  slug: "mitsos-hexaigon",
  fullName: "Dimitris Mitsos",
  jobTitle: "Managing Director",
  company: "Mitsos Constructions",
  phone: "+30 698 388 2720",
  email: "dimitris@mitsos.gr",
  website: "https://mitsos.gr",
  address: "Ermou 12, Athens 10563",
  note: "Renovations and structural work since 1998",
  photoUrl: "/cards/mitsos-hexaigon/photo.jpg",
  companyLogoUrl: "/cards/mitsos-hexaigon/logo.png",
  socialLinks: { linkedin: "https://linkedin.com/in/mitsos" },
  themeColor: "#c2410c",
  updatedAt: "2026-07-29",
}
```

### What reaches the saved contact

Name, company, job title, mobile, email, website, the card URL, social profiles,
photo, address and note. All of it comes from the fields above.

`address` is worth setting for any client with a physical shop: it becomes a
contact row that opens Maps, and lands in the vCard as `ADR` plus `LABEL`, so the
saved contact can give directions. `note` shows as one muted line under the
company and becomes the vCard `NOTE`.

Not currently supported, though vCard 3.0 allows them: a second phone number,
a second email, birthday and nickname. Each would be a small addition.

### A note on field length

Contact-row values wrap rather than truncate, and anything over 28 characters
steps down a size, since hiding part of an email or address on a card someone is
reading is the wrong trade. A 35-character email still takes two lines. If a
client has a short alias like `info@company.gr`, prefer it.

### Taking a card offline

Set `isActive: false`. The page and the vCard both return 404, but the slug stays
reserved, so the client's tags keep pointing at something you control rather than
at a URL someone else could later claim. That is the lever for a client who stops
paying. It needs a redeploy, roughly a minute on Vercel.

### Renaming a slug

Renaming breaks every tag and printed QR already using the old URL. Prefer adding
a new entry. If you must rename, reprogram the tags.

### `updatedAt`

Optional, and only feeds the vCard `REV` field, which lets a contact someone
re-saves overwrite their older copy instead of duplicating it. Bump it when you
change a card's details. Omit it and `REV` is left out entirely, which is safer
than a stale value, since a stale `REV` can stop a genuine update from applying.

---

## Why it is built this way

### No database

The set is small and only we edit it, so a table bought nothing and cost plenty.
Static gets you: every card prerendered at build time, the vCard photo downloaded
and base64-embedded during the build rather than per request, no query and no cold
start when a tag is tapped, and one fewer credential to hold.

The trade accepted in exchange: a client cannot self-serve edits, and
deactivating needs a redeploy instead of a checkbox. If that ever changes, note
that only [`lib/cards/data.ts`](../lib/cards/data.ts) knows where cards come
from. The page, the vCard route, the builder and the theme logic all take a
`Card` object, so swapping in a real data source is a one-file change plus
dropping `generateStaticParams`.

### The URL has no locale prefix

next-intl runs with `localePrefix: "always"`, so anything under `app/[locale]`
would be `/el/card/<slug>`. NFC tags are written once and reprogramming a
client's tags is not an option, so the route lives at `app/card/` with its own
root layout and `card` is excluded from the matcher in
[`proxy.ts`](../proxy.ts).

### Slug validation runs at build time

`getAllCardSlugs()` checks the format and rejects duplicates, and it is called
from `generateStaticParams`. A typo therefore fails the build loudly instead of
becoming a silent 404 in production.

### Notes on the vCard

- Version 3.0, not 4.0: iOS, Android, Outlook and Google Contacts all read 3.0
  reliably, while 4.0 support is still patchy on older Android builds.
- The photo is embedded as base64 when it is under 500 KB. A `PHOTO;VALUE=URI`
  line is silently ignored by iOS Contacts and most Android builds, so a
  URI-only vCard would save a contact with no picture. Larger or unreachable
  photos fall back to the URI form, made absolute with `SITE_URL`, because a
  relative URI is useless once the file has left the browser.
- A `photoUrl` starting with `/` is read off disk at build time, not fetched over
  HTTP. Fetching our own origin during the build would hit the *currently
  deployed* site, so a photo added in the same commit would not exist yet and the
  embed would silently fail until the following deploy.
- **Local photos must live under `public/cards/`.** That is the only directory the
  builder reads from. Vercel's file tracer cannot tell which file a dynamic
  `readFile` will open, so it bundles everything under the deepest directory it
  can resolve; pointing it at `public/` pulled in all 400+ MB of project
  screenshots and failed the deploy on the function size limit. Scoped to
  `public/cards/`, the traced function is about 1 MB. A photo outside `/cards/`
  still shows on the page but will not embed in the vCard.
- The vCard route is `force-static` with `dynamicParams: false`, so it has no
  runtime handler at all. The disk read only ever happens during `next build`.

## Before writing the first NFC tag

The bytes and headers are verified, but the handoff from browser to Contacts app
is OS behaviour that can only be confirmed on real hardware. Test once, on both
platforms, before selling:

1. Deploy with one real card, `isActive: true`.
2. Open `https://www.hexaigon.gr/card/<slug>` on an iPhone in Safari, tap
   **Save Contact**, and confirm the contact sheet appears with the name, number
   and photo, then save it and check the entry.
3. Repeat on an Android phone in Chrome.
4. Only then write the tag. Use the **www** URL: the apex 307s to www, and a
   redirect hop on a tap is avoidable.

The `Save Contact` link deliberately has no `download` attribute. The
`Content-Disposition: attachment` header already forces the download, and
`download` pushes iOS toward saving into Files rather than opening the contact
sheet.
- `charset=utf-8` is declared explicitly, or Android decodes Greek names as
  mojibake.
- Lines fold at 75 octets counted in UTF-8 bytes, never mid-character, since
  Greek letters are two bytes each.
- Both `filename` and `filename*` are sent, since the plain parameter is
  ASCII-only per RFC 6266. An all-Greek name reduces to nothing in ASCII, so the
  filename falls back to the slug.

---

## SEO

Card pages are `noindex, follow`. They are thin, near-identical pages, one per
client, and indexing them at scale would bloat the index of a domain that is
otherwise SEO-tuned. `follow` still passes link equity to the client's own site.
To index a particular client's card, override `robots` in that page's metadata.

They are also absent from [`app/sitemap.ts`](../app/sitemap.ts) on purpose,
which is consistent with the above.
