import { Hammer, Rocket, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const STEPS = [
  { key: "step1", icon: Search, number: "01" },
  { key: "step2", icon: Hammer, number: "02" },
  { key: "step3", icon: Rocket, number: "03" },
] as const;

export const HowWeWorkSection = async () => {
  const t = await getTranslations("HowWeWork");

  return (
    <section id="how-we-work" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            index="04"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {STEPS.map(({ key, icon: Icon, number }, i) => (
            <Reveal key={key} delay={i * 120}>
              <div className="group relative border-t border-white/10 pt-8 hover:border-primary/60 transition-colors duration-500">
                {/* Plus mark riding the hairline */}
                <span
                  aria-hidden
                  className="absolute -top-[9px] left-0 font-mono text-xs text-white/30 group-hover:text-primary transition-colors duration-500 bg-background pr-2"
                >
                  +
                </span>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-5xl font-bold gradient-text opacity-90">
                    {number}
                  </span>
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-2">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`${key}.description`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
