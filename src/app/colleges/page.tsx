import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, MapPin, Search, TrendingUp } from "lucide-react";
import { getColleges, type College } from "@/lib/api";
import { Badge, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";

export const metadata: Metadata = {
  title: "Colleges we help you get into",
  description:
    "A curated list of universities and institutes our counsellors work with — courses, entrance exams, indicative cut-offs and placements, with honest caveats.",
  alternates: { canonical: "/colleges" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function CollegesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const stream = one(sp.stream);
  const state = one(sp.state);
  const search = one(sp.search);

  const { colleges, facets } = await getColleges({ stream, state, search });

  const buildHref = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { stream, state, search, ...patch };
    for (const [key, value] of Object.entries(merged)) if (value) next.set(key, value);
    const qs = next.toString();
    return qs ? `/colleges?${qs}` : "/colleges";
  };

  return (
    <>
      <Section className="!pt-12 lg:!pt-16">
        <Container>
          <SectionHeading
            eyebrow="Our shortlist"
            title="Colleges we help students get into"
            description="Not a scraped directory — every entry here has been worked through with a student. Cut-offs and packages are indicative of a typical year, not promises."
          />
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          <form method="get" className="grid gap-3 rounded-xl border border-line bg-bg-subtle p-4 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted" aria-hidden />
              <Input name="search" defaultValue={search} placeholder="Search a college or city…" className="pl-9" aria-label="Search colleges" />
            </div>
            <Select name="stream" defaultValue={stream} aria-label="Filter by stream">
              <option value="">All streams</option>
              {facets.streams.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </Select>
            <Select name="state" defaultValue={state} aria-label="Filter by state">
              <option value="">All states</option>
              {facets.states.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </Select>
            <Button type="submit" variant="primary">Apply</Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-fg-muted">
            <span>{colleges.length} of {facets.total} colleges</span>
            {(stream || state || search) ? (
              <Link href="/colleges" className="text-gold-700 underline underline-offset-4 dark:text-gold-300">Clear filters</Link>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section className="!py-10 lg:!py-14">
        <Container>
          {colleges.length === 0 ? (
            <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-line-strong bg-bg-subtle p-8 sm:items-center sm:text-center">
              <GraduationCap className="size-7 text-gold-600" aria-hidden />
              <div>
                <h2 className="text-xl">No colleges match those filters</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                  Try widening the search, or tell us what you are aiming for and we will build a shortlist with you.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/contact">Ask for a shortlist</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section className="!py-0 lg:!pb-20">
        <Container>
          <div className="flex flex-col items-start gap-4 rounded-xl border border-line bg-bg-subtle p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl">Cut-offs change. Plans should not.</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
                Every number on this page moves year to year. A counsellor will model three previous cycles for you before
                you commit to anything.
              </p>
            </div>
            <Button asChild variant="primary" size="lg" className="shrink-0">
              <Link href="/contact">Talk to a counsellor <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

function CollegeCard({ college }: { college: College }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-bg-card transition-shadow hover:shadow-lg">
      <Link href={`/colleges/${college.slug}`} className="relative block aspect-3/2 overflow-hidden bg-ink">
        {college.image ? (
          <Image
            src={college.image}
            alt={`${college.name}, ${college.city}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
        {college.featured ? (
          <Badge className="absolute top-3 left-3 bg-white/95 text-ink">
            <TrendingUp className="size-3" aria-hidden /> Top pick
          </Badge>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg leading-snug">
            <Link href={`/colleges/${college.slug}`} className="hover:text-gold-700 dark:hover:text-gold-300">
              {college.shortName ?? college.name}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-fg-muted">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {college.city}, {college.state}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 border-y border-line py-3 text-sm">
          <div>
            <dt className="text-xs text-fg-muted">Entrance</dt>
            <dd className="mt-0.5 font-medium">{college.exams[0] ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-fg-muted">Avg package</dt>
            <dd className="mt-0.5 font-medium">{college.avgPackageLpa ?? "—"}</dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {college.courses.slice(0, 3).map((course) => (
            <Badge key={course} className="bg-bg-subtle text-fg-muted">{course}</Badge>
          ))}
        </div>

        <Link
          href={`/colleges/${college.slug}`}
          className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-gold-700 hover:gap-2 dark:text-gold-300"
        >
          View cut-offs &amp; campus <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}