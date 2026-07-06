import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/reveal";

const FEATURE_KEYS = [
  "seo",
  "aeo",
  "speed",
  "mobile",
  "scalable",
  "cms",
  "ads",
  "design",
  "ux",
  "growth",
  "security",
  "support",
  "integrations",
  "analytics",
  "copywriting",
  "pricing",
] as const;

export const WhyUsSection = async () => {
  const t = await getTranslations("WhyUs");

  return (
    <section id="why-us" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="border-t border-white/10 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Sticky intro column */}
            <Reveal className="lg:col-span-1">
              <div className="lg:sticky lg:top-32">
                <p className="eyebrow mb-8">
                  <span className="text-primary">02</span>
                  <span className="mx-2 text-white/20">/</span>
                  {t("eyebrow")}
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-balance">
                  {t("title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {t("description")}
                </p>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all duration-300"
                >
                  {t("cta")}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>

            {/* Feature ledger */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-9">
              {FEATURE_KEYS.map((key, i) => (
                <Reveal
                  key={key}
                  delay={(i % 2) * 80}
                  className="group border-l border-white/10 pl-5 hover:border-primary transition-colors duration-500"
                >
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="font-mono text-[10px] text-white/25 group-hover:text-primary/70 transition-colors duration-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-semibold tracking-tight">
                      {t(`${key}.title`)}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                    {t(`${key}.description`)}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
