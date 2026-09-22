import { localeUrl, SITE_URL } from "@/lib/seo";

/**
 * JSON-LD builders.
 *
 * Every block points `provider` / `publisher` at the same `#organization` node
 * that `LocalBusinessSchema` emits, so Google merges them into one entity
 * instead of reading each page as a separate unnamed business.
 */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const organizationRef = { "@id": ORGANIZATION_ID };

export const websiteSchema = (locale: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: localeUrl(locale),
  name: "hexAIgon",
  inLanguage: locale === "en" ? "en" : "el",
  publisher: organizationRef,
});

export type BreadcrumbItem = {
  name: string;
  /** Route without the locale prefix, "" for the homepage. */
  path: string;
};

export const breadcrumbSchema = (locale: string, trail: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map(({ name, path }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name,
    item: localeUrl(locale, path),
  })),
});

export type FaqItem = { question: string; answer: string };

export const faqSchema = (items: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
});

export const serviceSchema = ({
  locale,
  name,
  description,
  path,
  areaServed = "GR",
}: {
  locale: string;
  name: string;
  description: string;
  path: string;
  areaServed?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  serviceType: name,
  url: localeUrl(locale, path),
  provider: organizationRef,
  areaServed: { "@type": "Country", name: areaServed },
  availableLanguage: ["el", "en"],
});

export const itemListSchema = (
  locale: string,
  items: { name: string; path: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  numberOfItems: items.length,
  itemListElement: items.map(({ name, path }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name,
    url: localeUrl(locale, path),
  })),
});

/**
 * A case study is our page *about* a site we built, so the page is a
 * CreativeWork whose `about` is the client's WebSite. Claiming the client's
 * site itself lives at our URL would be the wrong entity.
 */
export const caseStudySchema = ({
  locale,
  title,
  description,
  path,
  image,
  clientUrl,
  category,
}: {
  locale: string;
  title: string;
  description: string;
  path: string;
  image: string;
  clientUrl?: string;
  category: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: title,
  headline: title,
  description,
  url: localeUrl(locale, path),
  image: `${SITE_URL}${image}`,
  inLanguage: locale === "en" ? "en" : "el",
  creator: organizationRef,
  genre: category,
  ...(clientUrl
    ? { about: { "@type": "WebSite", name: title, url: clientUrl } }
    : {}),
});
