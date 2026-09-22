"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/schema";

/**
 * The accordion needs client-side state, but the questions and answers are
 * rendered into the server HTML regardless of whether a panel is open — so the
 * FAQPage markup and the copy behind it are both visible to crawlers.
 */
export const FaqAccordion = ({ items }: { items: FaqItem[] }) => (
  <Accordion
    type="single"
    collapsible
    className="rounded-2xl border border-white/10 divide-y divide-white/10 overflow-hidden"
  >
    {items.map(({ question, answer }, index) => (
      <AccordionItem
        key={question}
        value={`item-${index}`}
        className="border-b-0 px-6 sm:px-8 bg-white/[0.02]"
      >
        <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-6">
          {question}
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground leading-relaxed pb-6 max-w-3xl">
          {answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);
