import type { MetadataRoute } from "next";

import { SHOWCASE_PROJECTS } from "@/lib/data/projects";
import { SERVICES, servicePaths } from "@/lib/data/services";
import type { Localized } from "@/lib/i18n/localized";
import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";
import { localeUrl } from "@/lib/seo";

type Route = {
  /**
   * Route per locale, without the locale prefix. Most routes share one path;
   * the service pages carry a Greek slug and an English one.
   */
  path: Localized<string>;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

const shared = (path: string): Localized<string> => ({ el: path, en: path });

const ROUTES: Route[] = [
  { path: shared(""), changeFrequency: "weekly", priority: 1.0 },
  { path: shared("/services"), changeFrequency: "monthly", priority: 0.9 },
  ...SERVICES.map((service) => ({
    path: servicePaths(service),
    changeFrequency: "monthly" as const,
    // The service pages are the ones meant to rank for the money keywords, so
    // they sit above the portfolio in the crawl priority we declare.
    priority: 0.9,
  })),
  { path: shared("/projects"), changeFrequency: "monthly", priority: 0.8 },
  ...SHOWCASE_PROJECTS.map((project) => ({
    path: shared(`/projects/${project.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
  { path: shared("/privacy-policy"), changeFrequency: "yearly", priority: 0.3 },
];

const sitemap = (): MetadataRoute.Sitemap =>
  ROUTES.flatMap(({ path, changeFrequency, priority }) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: localeUrl(locale, path[locale]),
      lastModified: new Date(),
      changeFrequency,
      priority,
      // Google reads hreflang from the sitemap as well as from the page head.
      alternates: {
        languages: {
          el: localeUrl("el", path.el),
          en: localeUrl("en", path.en),
        },
      },
    }))
  );

export default sitemap;
