"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

const ROTATION_KEYS = ["rotating1", "rotating2", "rotating3"] as const;
const TYPING_SPEED = 80;
const DELETE_SPEED = 40;
const PAUSE_DURATION = 2000;
const COUNTER_DURATION = 2000;

const STATS = [
  { key: "projects", value: 10, suffix: "+" },
  { key: "clients", value: 15, suffix: "+" },
  { key: "automations", value: 2, suffix: "+" },
] as const;

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / COUNTER_DURATION, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-mono text-3xl sm:text-4xl font-bold tracking-tight">
      {count}
      <span className="text-primary">{suffix}</span>
    </span>
  );
};

export const Hero = () => {
  const t = useTranslations("Hero");
  const tStats = useTranslations("Stats");
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = t(ROTATION_KEYS[currentIndex]);

  const scrollTo = useCallback((id: string) => {
    window.history.pushState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
    } else if (isDeleting && displayText === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % ROTATION_KEYS.length);
      }, 0);
    } else if (isDeleting) {
      timeout = setTimeout(
        () => setDisplayText((prev) => prev.slice(0, -1)),
        DELETE_SPEED
      );
    } else {
      timeout = setTimeout(
        () => setDisplayText(currentPhrase.slice(0, displayText.length + 1)),
        TYPING_SPEED
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhrase]);

  return (
    <section className="relative min-h-svh flex flex-col overflow-hidden">
      {/* Hero image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-image.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[30%_center] sm:object-center"
        />
        {/* Seamless blend into the page background */}
        <div className="absolute inset-0 bg-background/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/10 via-35% to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          <p className="eyebrow mb-8 animate-fade-in-up flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-primary/60" />
            {t("eyebrow")}
            <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-primary/60" />
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 min-h-[2.3em] animate-fade-in-up [animation-delay:100ms] opacity-0">
            {t("line1")}{" "}
            <span className="gradient-text">{displayText}</span>
            <span
              aria-hidden
              className="animate-blink inline-block w-[0.09em] h-[0.75em] translate-y-[0.08em] ml-[0.06em] rounded-xs bg-primary"
            />
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up [animation-delay:200ms] opacity-0 text-balance">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms] opacity-0">
            <button
              onClick={() => scrollTo("contact")}
              className="group inline-flex items-center justify-center gap-2 min-w-48 h-12 px-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-[0_0_32px_-8px] shadow-primary/60 hover:shadow-[0_0_44px_-6px] hover:shadow-primary/70 hover:brightness-110 transition-all duration-300 cursor-pointer"
            >
              {t("cta")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo("portfolio")}
              className="inline-flex items-center justify-center gap-2 min-w-48 h-12 px-8 rounded-full border border-white/15 text-sm font-medium text-foreground/90 hover:bg-white/5 hover:border-white/30 transition-all duration-300 cursor-pointer"
            >
              {t("ctaSecondary")}
              <span aria-hidden className="font-mono text-muted-foreground">↓</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative z-10 animate-fade-in-up [animation-delay:450ms] opacity-0">
        <div className="container mx-auto max-w-5xl px-4 pb-10">
          <div className="border-t border-white/10 grid grid-cols-3">
            {STATS.map(({ key, value, suffix }, i) => (
              <div
                key={key}
                className={`flex flex-col items-center gap-1.5 py-6 sm:py-8 ${
                  i > 0 ? "border-l border-white/10" : ""
                }`}
              >
                <AnimatedCounter target={value} suffix={suffix} />
                <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground text-center px-2">
                  {tStats(key)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
