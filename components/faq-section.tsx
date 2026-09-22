import { getTranslations } from "next-intl/server";

import { FaqAccordion } from "@/components/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { faqSchema } from "@/lib/schema";

const QUESTION_KEYS = ["1", "2", "3", "4", "5", "6"] as const;

/**
 * Answer engines quote FAQ content far more readily than marketing prose, and
 * FAQPage markup is what lets them attribute the answer back to us.
 */
export const FaqSection = async () => {
  const t = await getTranslations("Faq");

  const items = QUESTION_KEYS.map((key) => ({
    question: t(`q${key}` as "q1"),
    answer: t(`a${key}` as "a1"),
  }));

  return (
    <section id="faq" className="py-24 px-4">
      <JsonLd data={faqSchema(items)} />
      <div className="container mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            index="05"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>
        <Reveal delay={100}>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </section>
  );
};
