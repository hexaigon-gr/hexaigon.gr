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
import { BasePageProps } from "@/types/page-props";

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "hexAIgon",
    url: "https://hexaigon.gr",
    logo: "https://hexaigon.gr/seo-image.png",
    description:
      "AI-powered web development, automation, and custom software solutions for businesses across Greece.",
    foundingDate: "2024",
    areaServed: {
      "@type": "Country",
      name: "Greece",
    },
    serviceType: [
      "Website Development",
      "Web Application Development",
      "AI Automation",
      "Digital Advertising",
      "SEO",
      "Answer Engine Optimization",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hexaigonsoftwaresolutions@gmail.com",
      contactType: "customer service",
      availableLanguage: ["English", "Greek"],
    },
    sameAs: [
      "https://www.instagram.com/hexaigon.gr",
      "https://www.linkedin.com/company/hexaigon",
      "https://github.com/hexaigon",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "OpenAI",
      "Anthropic",
      "Tailwind CSS",
      "Supabase",
      "Stripe",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
