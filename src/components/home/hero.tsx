"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { HeroEnquiryForm } from "@/components/enquiry/hero-enquiry-form";
import { CollegeBannerSlider } from "@/components/home/college-banner-slider";
import type { College } from "@/lib/api";

const PROOF = [
  "Class 8 → Class 12 & beyond",
  "One named counsellor",
  "Written roadmap in 3 days",
  "90-day follow-through",
];

/**
 * Homepage hero — college banner slider on the left, enquiry form on the
 * right. Slides come from the live catalogue (featured first).
 */
export function Hero({ colleges }: { colleges: College[] }) {
  const reduce = useReducedMotion();

  return (
    <section className="grain relative overflow-hidden pt-10 pb-24 sm:pt-16 lg:pt-20 lg:pb-28">
      {/* ambient light */}
      <div
        className="pointer-events-none absolute -top-56 -left-40 size-[38rem] rounded-full opacity-[0.22] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--gold-500), transparent 65%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-40 -right-56 size-[34rem] rounded-full opacity-[0.18] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--teal-500), transparent 65%)" }}
        aria-hidden
      />
      {/* fine grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--ink-900) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--ink-900) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 80% 55% at 50% 35%, black, transparent 75%)",
        }}
        aria-hidden
      />

      <Container className="relative">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left — pitch + college banner slider */}
          <div>
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-pill border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-medium text-gold-700 dark:text-gold-300"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold-500 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-gold-500" />
              </span>
              Accepting new students for this month
            </motion.div>

            <motion.h1
              initial={reduce ? undefined : { opacity: 0, y: 22 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 text-[2.4rem] leading-[1.03] sm:text-5xl lg:text-[3.6rem]"
            >
              The right choice is
              <br />
              <span className="text-gradient-gold">not obvious.</span>{" "}
              <span className="block text-fg-muted sm:inline">We help you find it.</span>
            </motion.h1>

            <motion.p
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg"
            >
              Career, stream and admission decisions are too big to make on instinct and too expensive to get wrong.
              Start with a free 20-minute call — an honest read on where you stand.
            </motion.p>

            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 18 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button asChild variant="outline" size="xl">
                <Link href="/colleges">Explore colleges</Link>
              </Button>
              <Button asChild variant="ghost" size="xl">
                <Link href="/services">
                  Our services <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </motion.div>

            {/* Banner slider — 2–3 slides, autoplay + arrows + swipe */}
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10"
            >
              <CollegeBannerSlider colleges={colleges} />

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                {PROOF.map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-xs text-fg-muted sm:text-sm">
                    <ShieldCheck className="size-3.5 text-teal-500" aria-hidden />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — enquiry form */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 28, scale: 0.98 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-24"
          >
            <HeroEnquiryForm />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
