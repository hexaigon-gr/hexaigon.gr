# SEO build-out — hexAIgon (2026-09-22)

Goal: rank for the money keywords — «κατασκευή ιστοσελίδων», «κατασκευή eshop»,
«κατασκευή εφαρμογών» (+ Αθήνα / Ηλιούπολη variants) — and be quotable by AI
answer engines.

## Diagnosis

The technical layer was already solid (canonicals, hreflang, sitemap, robots,
OG, ProfessionalService schema). What was missing is the thing that actually
ranks: **pages**. The site had 3 indexable URLs per locale (home, /projects,
/privacy-policy) and every one of them targeted the same broad intent. There was
no page a search engine could return for "κατασκευή eshop", and the portfolio
linked 21 times to external domains with nothing indexable of our own behind it.

## Plan

- [x] Audit: crawl every portfolio URL, read every live site, check GSC
- [x] `lib/i18n/localized.ts` — `Localized<T>` + `pick()` helper
- [x] `lib/data/services.ts` — 9 services with per-locale slugs, H1, meta, body
      copy, deliverables, FAQ, related projects
- [x] `lib/data/projects.ts` — per-project case-study copy (category, location,
      summary, highlights, stack), verified against each live site
- [x] `lib/seo.ts` — `buildAlternatesFor()` for per-locale slugs + JSON-LD builders
- [x] `/[locale]/services` hub + `/[locale]/services/[slug]` (9 × 2 locales)
- [x] `/[locale]/projects/[slug]` case studies (21 × 2 locales)
- [x] FAQ section on the homepage + FAQPage schema
- [x] Breadcrumbs + BreadcrumbList, ItemList, Service, WebSite/Organization schema
- [x] Portfolio cards link internally; outbound links keep `rel="noopener"`
- [x] Footer + services grid link to the new pages (crawl depth 1)
- [x] Sitemap generated from data; `/business-card` set to noindex
- [x] Fix: MOISS Defense Systems 404, Wheel Way mis-description
- [x] `pnpm lint` + `pnpm tsc --noEmit` + `pnpm build` clean

## Result

- Indexable URLs: **6 → 68** (homepage, services hub, 9 service pages, portfolio,
  21 case studies, privacy — each in both locales). 84 pages prerendered.
- Every service page carries Service + FAQPage + BreadcrumbList markup; the
  homepage adds WebSite and FAQPage on top of the existing ProfessionalService.
- Greek slugs where Greeks search: `/el/services/kataskevi-eshop` pairs with
  `/en/services/ecommerce-development` through hreflang.
- The portfolio no longer leaks 21 outbound links from the homepage; cards go to
  our case studies, which carry the outbound link themselves.

`pnpm tsc --noEmit` and `next build` are clean. `pnpm lint` reports 3 errors that
predate this work, all in `components/cards/card-typewriter.tsx`
(`no-nested-ternary`) — left alone as out of scope.

## Review

Two content decisions worth flagging to Nikos:

1. **MOISS Defense Systems** — `moiss-defense-systems.vercel.app` returns 404.
   Kept as a case study, outbound link removed (`live: false`) rather than
   linking the portfolio to a dead page. Redeploy it and flip the flag back.
2. **Wheel Way** was described as "a driving school". It is a used car and
   motorhome dealership in Rafina (sister company of Antoniadis Auto Service).
   Corrected everywhere.
