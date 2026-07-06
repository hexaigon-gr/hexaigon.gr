import { AppWindow, Bot, Code, Globe, Megaphone, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const SERVICES = [
  { key: "websites", icon: Globe },
  { key: "webApps", icon: AppWindow },
  { key: "automations", icon: Bot },
  { key: "ads", icon: Megaphone },
  { key: "seoAeo", icon: Search },
  { key: "customSoftware", icon: Code },
] as const;

export const ServicesSection = async () => {
  const t = await getTranslations("Services");

  return (
    <section id="services" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            index="01"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>

        {/* Shared-hairline grid: one border system, engineering-table style */}
        <Reveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10">
            {SERVICES.map(({ key, icon: Icon }, i) => (
              <div
                key={key}
                className="group relative bg-background p-8 sm:p-10 hover:bg-[oklch(0.11_0.01_250)] transition-colors duration-500"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="inline-flex p-3 rounded-xl border border-white/10 text-primary group-hover:border-primary/40 group-hover:shadow-[0_0_24px_-6px] group-hover:shadow-primary/40 transition-all duration-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-white/20 group-hover:text-primary/70 transition-colors duration-500">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
