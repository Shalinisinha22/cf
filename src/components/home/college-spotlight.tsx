import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Badge, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import type { College } from "@/lib/api";

/**
 * Deterministic-ish shuffle so the homepage shows a different mix of colleges
 * across deploys without needing a client-side randomiser (which would hurt
 * SSR/SEO). Seeded by the week number.
 */
function weeklyPick<T>(items: T[], count: number): T[] {
  if (items.length <= count) return items;
  const seed = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const pool = [...items];
  // Mulberry32 — tiny deterministic PRNG
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/** Homepage band that puts real college covers in front of the visitor. */
export function CollegeSpotlight({ colleges }: { colleges: College[] }) {
  if (!colleges.length) return null;
  const picks = weeklyPick(colleges, 6);

  return (
    <Section id="colleges" tone="subtle">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Campus directory"
            title="Colleges on our shortlist"
            description="A rotating sample from the directory — engineering, medical, law, management and more. Every entry has been worked through with a real student."
          />
          <Link
            href="/colleges"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors hover:text-gold-600"
          >
            See all colleges <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((college) => (
            <RevealItem key={college.id}>
              <Link
                href={`/colleges/${college.slug}`}
                className="group relative block overflow-hidden rounded-xl border border-line bg-ink-900 shadow-lift transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-3/2 w-full overflow-hidden">
                  {college.image ? (
                    <Image
                      src={college.image}
                      alt={`${college.name}, ${college.city}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-600 group-hover:scale-[1.05]"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-linear-to-t from-ink-950/90 via-ink-950/20 to-transparent" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    {college.stream ? (
                      <Badge tone="gold" className="bg-ink-950/60 backdrop-blur-sm">{college.stream}</Badge>
                    ) : null}
                    <p className="mt-2 font-display text-lg text-ivory-50">{college.shortName ?? college.name}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ivory-200/85">
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      {college.city}, {college.state}
                    </p>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
