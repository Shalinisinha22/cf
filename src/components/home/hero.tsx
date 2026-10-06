"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarClock, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { useQuickEnquiry } from "@/components/enquiry/quick-enquiry-context";
import { heroImage } from "@/lib/images";
import { site } from "@/lib/site";

const PROOF = [
  "Class 8 → Class 12 & beyond",
  "One named counsellor",
  "Written roadmap in 3 days",
  "90-day follow-through",
];

export function Hero() {
  const { open } = useQuickEnquiry();
  const reduce = useReducedMotion();

  return (
    <section className="grain relative overflow-hidden pt-10 pb-24 sm:pt-16 lg:pt-24 lg:pb-32">
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
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
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
              className="mt-7 text-[2.6rem] leading-[1.03] sm:text-6xl lg:text-[4.25rem]"
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
              className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg"
            >
              Career, stream and admission decisions are too big to make on instinct and too expensive to get wrong.
              Start with a free 20-minute call — an honest read on where you stand, from a counsellor who will tell you when
              we are not the right fit.
            </motion.p>

            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 18 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button variant="gold" size="xl" onClick={() => open("career-counselling")} className="group">
                <CalendarClock className="size-4.5" aria-hidden />
                Book your free clarity call
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="/services">Explore our services</Link>
              </Button>
            </motion.div>

            <motion.ul
              initial={reduce ? undefined : { opacity: 0 }}
              animate={reduce ? undefined : { opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.34 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {PROOF.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-fg-muted">
                  <ShieldCheck className="size-4 text-teal-500" aria-hidden />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Portrait card — the human behind the advice */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 30, scale: 0.97 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-xl border border-line bg-bg-elevated shadow-lift">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-ink-900">
                <Image
                  src={heroImage}
                  alt="A counsellor and a student working through a career roadmap together"
                  fill
                  sizes="(max-width: 1024px) 100vw, 44vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink-950/90 via-ink-950/10 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-xl text-ivory-50">Dr. Ananya Rao</p>
                  <p className="mt-1 text-sm text-ivory-200/85">Founder &amp; Lead Career Counsellor · 15 yrs</p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gold-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" aria-hidden />
                    ))}
                    <span className="ml-1 text-ivory-200/70">4.9 average across 380 reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating testimonial */}
            <div className="absolute -bottom-6 -left-4 hidden max-w-60 rounded-lg border border-line bg-bg-elevated p-4 shadow-lift sm:block lg:-left-10">
              <p className="text-sm leading-relaxed text-fg">
                “We had argued for three months. One session and we stopped arguing and started planning.”
              </p>
              <p className="mt-2 text-xs text-fg-muted">Sanya Kapoor · Parent, Class 12</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-6 border-t border-line pt-10 sm:grid-cols-4">
          {site.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
            >
              <p className="font-display text-3xl sm:text-4xl">{stat.value}</p>
              <p className="mt-1.5 text-sm text-fg-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}