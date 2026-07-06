import { CreditCard } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/reveal";

export const PaymentsBanner = async () => {
  const t = await getTranslations("Payments");

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Reveal>
          <div className="panel p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex items-center gap-6 shrink-0">
              <div className="inline-flex p-4 rounded-xl border border-green-400/20 bg-green-400/5">
                <CreditCard className="h-8 w-8 text-green-400" />
              </div>
              <Image
                src="/mydata-logo.png"
                alt="myDATA AADE"
                width={80}
                height={80}
                className="h-14 w-auto object-contain opacity-90"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="eyebrow mb-3">{t("eyebrow")}</p>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2">
                {t("title")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                {t("description")}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
