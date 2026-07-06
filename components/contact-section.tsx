"use client";

import { ArrowRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/reveal";
import { submitContactForm } from "@/server_actions/contact";

const FIELD_CLASS =
  "w-full bg-transparent border-0 border-b border-white/15 rounded-none px-0 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50";

export const ContactSection = () => {
  const t = useTranslations("Contact");
  const [pending, setPending] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setPending(true);

      const formData = new FormData(e.currentTarget);
      const result = await submitContactForm(formData);

      if (result.success) {
        toast.success(t("success"));
        e.currentTarget.reset();
      } else {
        toast.error(t("error"));
      }

      setPending(false);
    },
    [t]
  );

  return (
    <section id="contact" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="border-t border-white/10 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
            {/* Pitch column */}
            <Reveal className="lg:col-span-2">
              <p className="eyebrow mb-8">
                <span className="text-primary">05</span>
                <span className="mx-2 text-white/20">/</span>
                {t("eyebrow")}
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-balance">
                {t("title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                {t("subtitle")}
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:hexaigonsoftwaresolutions@gmail.com"
                  className="group flex items-center gap-3 text-sm text-foreground/90 hover:text-primary transition-colors"
                >
                  <span className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-white/15 group-hover:border-primary/50 transition-colors">
                    <Mail className="h-4 w-4" />
                  </span>
                  hexaigonsoftwaresolutions@gmail.com
                </a>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground pl-12">
                  {t("responseNote")}
                </p>
              </div>
            </Reveal>

            {/* Form column */}
            <Reveal delay={120} className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
                  <div>
                    <label htmlFor="contact-name" className="eyebrow block mb-1">
                      {t("name")}
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      required
                      disabled={pending}
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="eyebrow block mb-1">
                      {t("email")}
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={pending}
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-message" className="eyebrow block mb-1">
                    {t("message")}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    disabled={pending}
                    rows={4}
                    className={`${FIELD_CLASS} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="group inline-flex items-center justify-center gap-2 h-13 px-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-[0_0_32px_-8px] shadow-primary/50 hover:shadow-[0_0_44px_-6px] hover:shadow-primary/60 hover:brightness-110 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {t("submit")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
