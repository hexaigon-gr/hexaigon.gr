import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HowWeWorkSection } from "@/components/how-we-work-section";
import { Navbar } from "@/components/navbar";
import { PaymentsBanner } from "@/components/payments-banner";
import { PortfolioSection } from "@/components/portfolio-section";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ServicesSection } from "@/components/services-section";
import { TechStackSection } from "@/components/tech-stack-section";
import { WhyUsSection } from "@/components/why-us-section";
import { buildAlternates } from "@/lib/seo";
import { BasePageProps } from "@/types/page-props";

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/seo-image.png",
          width: 1200,
          height: 630,
          alt: t("title"),
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/seo-image.png"],
    },
  };
};

const Home = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServicesSection />
        <PaymentsBanner />
        <WhyUsSection />
        <PortfolioSection />
        <HowWeWorkSection />
        <TechStackSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Home;
