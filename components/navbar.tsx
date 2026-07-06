"use client";

import { CalendarDays, Hexagon, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { cn } from "@/lib/general/utils";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";

const NAV_LINKS = ["services", "ourWork", "whyUs", "howWeWork", "techStack", "contact"] as const;

const SCROLL_IDS: Record<string, string> = {
  services: "services",
  ourWork: "portfolio",
  whyUs: "why-us",
  howWeWork: "how-we-work",
  techStack: "tech-stack",
  contact: "contact",
};

export const Navbar = () => {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";

  const navigateToSection = useCallback(
    (id: string) => {
      setMobileOpen(false);
      if (isHome) {
        window.history.pushState(null, "", `#${id}`);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/#${id}`);
      }
    },
    [isHome, router]
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to hash on page load (for shared URLs)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Small delay to ensure sections are rendered
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-background/70 backdrop-blur-2xl border-b border-white/5 shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <Hexagon className="h-5 w-5 text-primary group-hover:rotate-90 transition-transform duration-500" />
          <span className="text-lg font-bold tracking-tight">
            hex<span className="text-primary">AI</span>gon
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1.5 border border-white/5">
          {NAV_LINKS.map((key) => (
            <button
              key={key}
              onClick={() => navigateToSection(SCROLL_IDS[key])}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-4 py-1.5 rounded-full hover:bg-white/5"
            >
              {t(key)}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => navigateToSection("contact")}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_-8px] shadow-primary/60 hover:shadow-[0_0_32px_-6px] hover:shadow-primary/70 hover:brightness-110 transition-all duration-300 cursor-pointer"
          >
            <CalendarDays className="h-4 w-4" />
            {t("getStarted")}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out",
          mobileOpen ? "max-h-112 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-background/95 backdrop-blur-2xl border-t border-white/5 p-6 space-y-1">
          {NAV_LINKS.map((key) => (
            <button
              key={key}
              onClick={() => navigateToSection(SCROLL_IDS[key])}
              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg px-4 py-3 transition-all cursor-pointer"
            >
              {t(key)}
            </button>
          ))}
          <div className="flex items-center gap-3 pt-4 mt-2 border-t border-white/5">
            <LanguageSwitcher />
            <button
              onClick={() => navigateToSection("contact")}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground transition-all cursor-pointer"
            >
              <CalendarDays className="h-4 w-4" />
              {t("getStarted")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
