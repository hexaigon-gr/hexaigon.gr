import {
  AppWindow,
  Bot,
  Code,
  Github,
  Globe,
  Hexagon,
  Instagram,
  Linkedin,
  Mail,
  Megaphone,
  Newspaper,
  Search,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";
import { SocialIcon } from "@/components/social-icon";
import { TypographySmallReg } from "@/components/ui/typography";

const SERVICE_LINKS = [
  { key: "websites", icon: Globe },
  { key: "webApps", icon: AppWindow },
  { key: "automations", icon: Bot },
  { key: "ads", icon: Megaphone },
  { key: "seoAeo", icon: Search },
  { key: "customSoftware", icon: Code },
] as const;

const SOCIAL_LINKS = [
  {
    url: "https://www.linkedin.com/company/hexaigon",
    icon: <Linkedin className="h-4 w-4" />,
    color: "linkedin" as const,
  },
  {
    url: "https://github.com/hexaigon",
    icon: <Github className="h-4 w-4" />,
    color: "tiktok" as const,
  },
  {
    url: "https://www.instagram.com/hexaigon.gr",
    icon: <Instagram className="h-4 w-4" />,
    color: "instagram" as const,
  },
] as const;

const LINK_CLASS =
  "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors";

const LEGAL_LINK_CLASS =
  "text-xs text-muted-foreground hover:text-foreground transition-colors";

export const Footer = async () => {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Hexagon className="h-5 w-5 text-blue-500" />
              <p className="text-xl font-bold">
                hex<span className="text-blue-500">AI</span>gon
              </p>
            </div>
            <TypographySmallReg className="text-muted-foreground">
              {t("tagline")}
            </TypographySmallReg>

            <div className="flex gap-3 mt-4">
              {SOCIAL_LINKS.map(({ url, icon, color }) => (
                <SocialIcon
                  key={color}
                  url={url}
                  icon={icon}
                  color={color}
                  isMobile
                />
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="font-semibold mb-4">{t("services")}</p>
            <div className="space-y-3">
              {SERVICE_LINKS.map(({ key, icon: Icon }) => (
                <a key={key} href="#services" className={LINK_CLASS}>
                  <Icon className="h-3.5 w-3.5" />
                  {t(key)}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="font-semibold mb-4">{t("company")}</p>
            <div className="space-y-3">
              <a href="#contact" className={LINK_CLASS}>
                <Mail className="h-3.5 w-3.5" />
                {t("contact")}
              </a>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Newspaper className="h-3.5 w-3.5" />
                {t("blog")}{" "}
                <span className="text-xs text-muted-foreground/50">
                  ({t("comingSoon")})
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <TypographySmallReg className="text-muted-foreground">
            &copy; 2026 hexAIgon. {t("rights")}
          </TypographySmallReg>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className={LEGAL_LINK_CLASS}>
              {t("privacy")}
            </Link>
            <a href="#" className={LEGAL_LINK_CLASS}>
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
