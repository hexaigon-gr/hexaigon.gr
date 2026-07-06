import "./globals.css";

import type { Metadata } from "next";
import { Commissioner, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale } from "next-intl";
import { getMessages,setRequestLocale } from "next-intl/server";

import { Providers } from "@/components/providers";
import { routing } from "@/lib/i18n/routing";
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

const SITE_URL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://hexaigon.gr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "hexAIgon — AI-Powered Web Development & Automation | Greece",
    template: "%s | hexAIgon",
  },
  description:
    "We build custom websites, AI automation workflows, and software solutions that help businesses across Greece grow faster. Next.js, React, OpenAI, Anthropic.",
  keywords: [
    "web development Greece",
    "AI automation",
    "custom software",
    "Next.js development",
    "React developer Greece",
    "κατασκευή ιστοσελίδων",
    "αυτοματισμοί AI",
    "web developer Ελλάδα",
    "hexAIgon",
  ],
  authors: [{ name: "hexAIgon", url: SITE_URL }],
  creator: "hexAIgon",
  publisher: "hexAIgon",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_GR",
    alternateLocale: "el_GR",
    url: SITE_URL,
    siteName: "hexAIgon",
    title: "hexAIgon — AI-Powered Web Development & Automation",
    description:
      "Custom websites, AI automation, and software solutions for businesses across Greece.",
    images: [
      {
        url: "/seo-image.png",
        width: 1200,
        height: 630,
        alt: "hexAIgon — AI-Powered Web Development & Automation",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "hexAIgon — AI-Powered Web Development & Automation",
    description:
      "Custom websites, AI automation, and software solutions for businesses across Greece.",
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
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}/en`,
      el: `${SITE_URL}/el`,
    },
  },
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
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default LocaleLayout;
