"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Container } from "@/components/ui/primitives";
import { HeroEnquiryForm } from "@/components/enquiry/hero-enquiry-form";
import type { College } from "@/lib/api";

const PROOF = [
  "Class 8 → Class 12 & beyond",
  "One named counsellor",
  "Written roadmap in 3 days",
  "90-day follow-through",
];

const BANNER_INTERVAL_MS = 4500;

/**
 * Homepage hero — college banner carousel on the left, enquiry form on the
 * right. Falls back to a static campus plate when the API has no colleges yet.
 */
export function Hero({ colleges }: { colleges: College[] }) {
  const reduce = useReducedMotion();
  const slides = colleges.slice(0, 3);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduce || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, BANNER_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [reduce, slides.length]);

  const active = slides[index] ?? null;

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
          {/* Left — pitch + college banners */}
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

            {/* College banner carousel — 2–3 slides from the live catalogue */}
            {slides.length > 0 && active ? (
              <motion.div
                initial={reduce ? undefined : { opacity: 0, y: 24 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-gold-600 uppercase">
                    Colleges our students aim for
                  </p>
                  <div className="flex items-center gap-1.5" role="tablist" aria-label="Featured colleges">
                    {slides.map((college, i) => (
                      <button
                        key={college.id}
                        type="button"
                        role="tab"
                        aria-selected={i === index}
                        aria-label={`Show ${college.shortName ?? college.name}`}
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-pill transition-all duration-400 ${
                          i === index ? "w-7 bg-gold-500" : "w-3 bg-line-strong hover:bg-gold-500/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-line bg-bg-elevated shadow-lift">
                  <AnimatePresence mode="wait">
                    <Link
                      key={active.id}
                      href={`/colleges/${active.slug}`}
                      className="group relative block"
                      prefetch
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-900 sm:aspect-[21/9]">
                        {active.image ? (
                          <Image
                            src={active.image}
                            alt={`${active.name}, ${active.city}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 48vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        ) : null}
                        <div
                          className="absolute inset-0 bg-linear-to-t from-ink-950/92 via-ink-950/35 to-transparent"
                          aria-hidden
                        />
                        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 sm:p-6">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              {active.stream ? (
                                <Badge tone="gold" className="bg-ink-950/60 backdrop-blur-sm">{active.stream}</Badge>
                              ) : null}
                              {active.featured ? (
                                <Badge className="bg-white/95 text-ink">Top pick</Badge>
                              ) : null}
                            </div>
                            <p className="mt-2 font-display text-xl text-ivory-50 sm:text-2xl">
                              {active.shortName ?? active.name}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-ivory-200/85">
                              <MapPin className="size-3.5" aria-hidden />
                              {active.city}, {active.state}
                              {active.avgPackageLpa ? <span className="text-ivory-300/80">· {active.avgPackageLpa}</span> : null}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-gold-300 transition-all group-hover:gap-2">
                            View campus <ArrowRight className="size-4" aria-hidden />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimatePresence>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {PROOF.map((item) => (
                    <span key={item} className="flex items-center gap-1.5 text-xs text-fg-muted sm:text-sm">
                      <ShieldCheck className="size-3.5 text-teal-500" aria-hidden />
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : null}
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
