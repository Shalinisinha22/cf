"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import type { College } from "@/lib/api";

const SERVER_SNAPSHOT = "0|false|false";

/**
 * Hero banner slider — 2–3 college slides with autoplay, arrows and swipe.
 * Built on Embla (already a project dependency) so it handles touch, loop,
 * and reduced-motion the way a native carousel should.
 *
 * Slide state is read through useSyncExternalStore rather than an effect,
 * so the component stays in sync with Embla without setState-in-effect.
 */
export function CollegeBannerSlider({ colleges }: { colleges: College[] }) {
  const slides = colleges.slice(0, 3);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: slides.length > 1, align: "start", duration: 32 },
    slides.length > 1
      ? [Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })]
      : [],
  );

  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on("select", onChange).on("reInit", onChange);
      return () => {
        emblaApi.off("select", onChange).off("reInit", onChange);
      };
    },
    [emblaApi],
  );

  const getSnapshot = React.useCallback(() => {
    if (!emblaApi) return SERVER_SNAPSHOT;
    return `${emblaApi.selectedScrollSnap()}|${emblaApi.canScrollPrev()}|${emblaApi.canScrollNext()}`;
  }, [emblaApi]);

  const state = React.useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  const [selectedIndex, prevRaw, nextRaw] = state.split("|");
  const selected = Number(selectedIndex);
  const prevEnabled = prevRaw === "true";
  const nextEnabled = nextRaw === "true";

  if (!slides.length) return null;

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-gold-600 uppercase">
          Colleges our students aim for
        </p>

        {slides.length > 1 ? (
          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs text-fg-muted tabular-nums">
              {selected + 1} / {slides.length}
            </span>
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!prevEnabled}
              aria-label="Previous college"
              className="grid size-8 place-items-center rounded-pill border border-line-strong bg-bg-elevated text-fg-muted transition-colors hover:border-gold-500 hover:text-gold-700 disabled:opacity-40 disabled:hover:border-line-strong disabled:hover:text-fg-muted"
            >
              <ArrowLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!nextEnabled}
              aria-label="Next college"
              className="grid size-8 place-items-center rounded-pill border border-line-strong bg-bg-elevated text-fg-muted transition-colors hover:border-gold-500 hover:text-gold-700 disabled:opacity-40 disabled:hover:border-line-strong disabled:hover:text-fg-muted"
            >
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-line shadow-lift">
        <div ref={emblaRef} className="flex cursor-grab touch-pan-y active:cursor-grabbing">
          {slides.map((college) => (
            <Link
              key={college.id}
              href={`/colleges/${college.slug}`}
              className="group relative min-w-0 flex-[0_0_100%] select-none"
              prefetch
            >
              <div className="relative aspect-16/9 w-full overflow-hidden bg-ink-900 sm:aspect-21/9">
                {college.image ? (
                  <Image
                    src={college.image}
                    alt={`${college.name} campus, ${college.city}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    draggable={false}
                  />
                ) : null}
                <div className="absolute inset-0 bg-linear-to-t from-ink-950/92 via-ink-950/35 to-transparent" aria-hidden />

                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {college.stream ? (
                        <Badge tone="gold" className="bg-ink-950/60 backdrop-blur-sm">{college.stream}</Badge>
                      ) : null}
                      {college.featured ? (
                        <Badge className="bg-white/95 text-ink">
                          <TrendingUp className="size-3" aria-hidden /> Top pick
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-2 font-display text-xl text-ivory-50 sm:text-2xl">
                      {college.shortName ?? college.name}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-ivory-200/85">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" aria-hidden />
                        {college.city}, {college.state}
                      </span>
                      {college.avgPackageLpa ? (
                        <span className="text-ivory-300/80">· Avg {college.avgPackageLpa}</span>
                      ) : null}
                      {college.exams[0] ? <span className="text-ivory-300/80">· {college.exams[0]}</span> : null}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 text-sm font-medium text-gold-300 transition-all group-hover:gap-2">
                    View campus <ArrowRight className="size-4" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* progress dots */}
      {slides.length > 1 ? (
        <div className="mt-3 flex items-center gap-1.5" role="tablist" aria-label="Banner slides">
          {slides.map((college, i) => (
            <button
              key={college.id}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`Show ${college.shortName ?? college.name}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-pill transition-all duration-400",
                i === selected ? "w-7 bg-gold-500" : "w-3 bg-line-strong hover:bg-gold-500/40",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
