import "./globals.css";

import type { Metadata } from "next";
import { Commissioner, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale } from "next-intl";
import { getMessages,getTranslations,setRequestLocale } from "next-intl/server";

import { LocalBusinessSchema } from "@/components/local-business-schema";
import { Providers } from "@/components/providers";
import { routing } from "@/lib/i18n/routing";
import { localeUrl,SITE_URL } from "@/lib/seo";
import { BaseLayoutProps } from "@/types/page-props";

const META_PIXEL_ID = "1961881335206282";

const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin", "greek"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "greek"],
});

/**
 * Brand-level metadata only. Anything locale- or route-specific (title,
 * description, canonical, hreflang) is set by each page's generateMetadata —
 * a canonical declared here would be inherited by every route and point them
 * all at the same URL.
 */
export const generateMetadata = async ({
  params,
}: BaseLayoutProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: "%s | hexAIgon",
    },
    description: t("description"),
    authors: [{ name: "hexAIgon", url: SITE_URL }],
    creator: "hexAIgon",
    publisher: "hexAIgon",
    formatDetection: { telephone: false },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_GR" : "el_GR",
      alternateLocale: locale === "en" ? "el_GR" : "en_GR",
      url: localeUrl(locale),
      siteName: "hexAIgon",
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
};

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

const LocaleLayout = async ({ children, params }: BaseLayoutProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${commissioner.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <LocalBusinessSchema locale={locale} />
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default LocaleLayout;
