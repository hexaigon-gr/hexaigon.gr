import fs from "fs/promises";
import path from "path";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Markdown from "react-markdown";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BasePageProps } from "@/types/page-props";

export async function generateMetadata({ params }: BasePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy" });
  return { title: t("title") };
}

const PrivacyPolicyPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("PrivacyPolicy");
  const mdPath = path.join(process.cwd(), "content", "privacy-policy", `${locale}.md`);
  const content = await fs.readFile(mdPath, "utf-8");

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-center mb-2">
            {t("title")}
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            {t("lastUpdated")}
          </p>
          <article className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-blue-500 hover:prose-a:text-blue-400">
            <Markdown>{content}</Markdown>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
