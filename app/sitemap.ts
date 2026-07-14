import type { MetadataRoute } from "next";

import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";
import { localeUrl } from "@/lib/seo";

const ROUTES: {
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.8 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

const sitemap = (): MetadataRoute.Sitemap =>
  ROUTES.flatMap(({ path, changeFrequency, priority }) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: new Date(),
      changeFrequency,
      priority,
      // Google reads hreflang from the sitemap as well as from the page head.
      alternates: {
        languages: {
          el: localeUrl("el", path),
          en: localeUrl("en", path),
        },
      },
    }))
  );

export default sitemap;
