import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { buildAlternates } from "@/lib/seo";
import { BaseLayoutProps } from "@/types/page-props";

/**
 * The page itself is a client component, so its metadata has to live in a layout.
 */
export const generateMetadata = async ({
  params,
}: BaseLayoutProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("businessCardTitle"),
    description: t("businessCardDescription"),
    alternates: buildAlternates(locale, "/business-card"),
  };
};

const BusinessCardLayout = ({ children }: BaseLayoutProps) => children;

export default BusinessCardLayout;
