import { getTranslations } from "next-intl/server";

const TECH_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "OpenAI",
  "Anthropic",
  "Stripe",
  "Supabase",
  "Tailwind CSS",
] as const;

export const TechStackSection = async () => {
  const t = await getTranslations("TechStack");

  return (
    <section id="tech-stack" className="py-16">
      <div className="border-y border-white/10 py-10 sm:py-12">
        <p className="eyebrow text-center mb-8">{t("title")}</p>

        {/* Infinite marquee — duplicate list for a seamless loop */}
        <div
          className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          aria-label={TECH_STACK.join(", ")}
        >
          <div className="marquee-track flex w-max items-center">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
                {TECH_STACK.map((name) => (
                  <span
                    key={name}
                    className="flex items-center font-mono text-xl sm:text-2xl uppercase tracking-widest text-muted-foreground/80 hover:text-foreground transition-colors duration-300 whitespace-nowrap"
                  >
                    <span className="px-8 sm:px-10">{name}</span>
                    <span aria-hidden className="text-primary/40 text-sm">+</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
