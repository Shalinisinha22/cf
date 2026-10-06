"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { QuickEnquiryButton } from "@/components/enquiry/quick-enquiry-button";
import { cn } from "@/lib/utils";
import type { Faq } from "@/lib/api";

const FALLBACK: Faq[] = [
  {
    id: "f1",
    question: "How much does career counselling cost?",
    answer:
      "A single session starts at ₹1,500 and runs 60 minutes. Complete admission guidance is priced after we understand your goal — you always get the number before we start, never after.",
    category: "Fees",
  },
  {
    id: "f2",
    question: "My child is in Class 10. Is counselling too early?",
    answer:
      "It is actually the ideal time. Aptitude and interest patterns are far clearer at 14 than at 17, and the exploration you do now costs nothing but conversations.",
    category: "Age",
  },
  {
    id: "f3",
    question: "Do you work with parents, or only with students?",
    answer:
      "Both, together, in the same session. Most of our work is the triangle between the student's instinct, the parent's budget and what is actually achievable.",
    category: "Sessions",
  },
  {
    id: "f4",
    question: "Can we pay in instalments?",
    answer:
      "Yes — most families split across two or three payments, and the roadmap is yours to keep either way. EMI options are available for longer packages.",
    category: "Fees",
  },
  {
    id: "f5",
    question: "What if we are not sure which service we need?",
    answer:
      "That is exactly what the free call is for. Tell us the situation, we will tell you whether we can help or point you to someone better suited.",
    category: "Getting started",
  },
  {
    id: "f6",
    question: "Is online counselling as good as in person?",
    answer:
      "For most families, yes — and it removes travel entirely. We offer video and phone sessions, and keep in-person available for students who concentrate better face to face.",
    category: "Sessions",
  },
];

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  const items = faqs.length ? faqs : FALLBACK;
  const [open, setOpen] = React.useState<string | null>(items[0]?.id ?? null);

  return (
    <Section id="faq" tone="base">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Questions"
              title="The things people ask before they call"
              description="Straight answers. If yours is not here, WhatsApp us — a real counsellor replies, usually the same day."
            />
            <div className="mt-8">
              <QuickEnquiryButton variant="outline" size="lg" label="Ask us something else" source="WEBSITE_HERO" />
            </div>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {items.map((faq) => {
              const isOpen = open === faq.id;
              return (
                <div key={faq.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                  >
                    <span className={cn("text-base font-medium transition-colors sm:text-lg", isOpen ? "text-gold-700 dark:text-gold-300" : "group-hover:text-gold-700 dark:group-hover:text-gold-300")}>
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 grid size-8 shrink-0 place-items-center rounded-pill border border-line-strong transition-all duration-500",
                        isOpen ? "rotate-45 border-gold-500 bg-gold-500 text-ink-950" : "text-fg-muted group-hover:border-gold-500/50",
                      )}
                      aria-hidden
                    >
                      <Plus className="size-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pr-12 text-sm leading-relaxed text-fg-muted">{faq.answer}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}