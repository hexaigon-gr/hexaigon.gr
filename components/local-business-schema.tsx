import { localeUrl,SITE_URL } from "@/lib/seo";

const DESCRIPTION: Record<string, string> = {
  el: "Κατασκευή ιστοσελίδων, eshop και AI αυτοματισμών για επιχειρήσεις στην Αθήνα και σε όλη την Ελλάδα.",
  en: "Custom websites, eshops and AI automation for businesses in Athens and across Greece.",
};

/**
 * ProfessionalService (a LocalBusiness subtype) rather than a plain Organization,
 * so Google can tie the site to the Google Business Profile. hexAIgon is a
 * service-area business — no street address, `areaServed` instead.
 */
export const LocalBusinessSchema = ({ locale }: { locale: string }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "hexAIgon",
    url: localeUrl(locale),
    logo: `${SITE_URL}/seo-image.png`,
    image: `${SITE_URL}/seo-image.png`,
    description: DESCRIPTION[locale] ?? DESCRIPTION.el,
    email: "hexaigonsoftwaresolutions@gmail.com",
    telephone: "+306983882720",
    foundingDate: "2024",
    priceRange: "€€",
    knowsLanguage: ["el", "en"],
    areaServed: [
      { "@type": "City", name: "Ilioupoli" },
      { "@type": "City", name: "Athens" },
      { "@type": "AdministrativeArea", name: "Attica" },
      { "@type": "Country", name: "Greece" },
    ],
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
      telephone: "+306983882720",
      contactType: "customer service",
      availableLanguage: ["Greek", "English"],
    },
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
    sameAs: [
      "https://www.instagram.com/hexaigon.gr",
      "https://www.linkedin.com/company/hexaigon",
      "https://github.com/hexaigon",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
