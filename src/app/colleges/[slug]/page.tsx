import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, CalendarClock, ExternalLink, IndianRupee, MapPin } from "lucide-react";
import { getCollege, getColleges } from "@/lib/api";
import { Badge, Container, Section } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

export const revalidate = 900;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const { colleges } = await getColleges();
  return colleges.slice(0, 12).map((college) => ({ slug: college.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const college = await getCollege(slug);
  if (!college) return { title: "College not found" };
  return {
    title: `${college.shortName ?? college.name} — cut-offs, courses & placements`,
    description: `${college.name} in ${college.city}: entrance exams, indicative cut-offs, courses, campus notes and placement figures, reviewed by a counsellor.`,
    alternates: { canonical: `/colleges/${college.slug}` },
    openGraph: { images: college.image ? [{ url: college.image }] : undefined },
  };
}

export default async function CollegeDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const college = await getCollege(slug);
  if (!college) notFound();

  const { colleges } = await getColleges({ stream: college.stream ?? undefined });
  const related = colleges.filter((c) => c.slug !== college.slug && c.state === college.state).slice(0, 3);
  const suggestions = (related.length > 0 ? related : colleges.filter((c) => c.slug !== college.slug)).slice(0, 3);

  const facts: { label: string; value: string; icon: typeof MapPin }[] = [
    { label: "Location", value: `${college.city}, ${college.state}`, icon: MapPin },
    { label: "Institute type", value: college.type, icon: Building2 },
    { label: "Indicative rank range", value: college.rankRange ?? "Ask a counsellor", icon: CalendarClock },
    { label: "Average package", value: college.avgPackageLpa ?? "Not published", icon: IndianRupee },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-ivory-100">
        {college.image ? (
          <Image
            src={college.image}
            alt={`${college.name} campus`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/85 to-ink/55" aria-hidden />

        <Container className="relative py-14 lg:py-20">
          <Link href="/colleges" className="inline-flex items-center gap-2 text-sm text-ivory-300 hover:text-ivory-100">
            <ArrowLeft className="size-4" aria-hidden /> All colleges
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {college.stream ? <Badge tone="gold">{college.stream}</Badge> : null}
            {college.featured ? <Badge tone="gold">Top pick</Badge> : null}
            {college.type !== "University" ? <Badge tone="outline" className="border-ivory-100/30 text-ivory-200">{college.type}</Badge> : null}
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl leading-[1.08] sm:text-4xl lg:text-5xl">{college.name}</h1>
          <p className="mt-4 flex items-center gap-2 text-ivory-200">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {college.city}, {college.state}
            {college.affiliation ? <span className="text-ivory-300">· {college.affiliation}</span> : null}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <Link href="/contact">Check my chances <ArrowRight className="size-4" /></Link>
            </Button>
            {college.websiteUrl ? (
              <Button asChild variant="light" size="lg">
                <a href={college.websiteUrl} target="_blank" rel="noreferrer noopener">
                  Official site <ExternalLink className="size-4" />
                </a>
              </Button>
            ) : null}
          </div>
        </Container>
      </section>

      <Section className="!py-12 lg:!py-16">
        <Container>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-xl border border-line bg-bg-card p-5">
                <dt className="flex items-center gap-2 text-xs tracking-wide text-fg-muted uppercase">
                  <fact.icon className="size-3.5 text-gold-600" aria-hidden />
                  {fact.label}
                </dt>
                <dd className="mt-2 text-lg leading-snug font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-10">
              <section>
                <h2 className="text-2xl">Entrance exams</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {college.exams.length > 0
                    ? college.exams.map((exam) => <Badge key={exam} tone="teal">{exam}</Badge>)
                    : <p className="text-sm text-fg-muted">Entrance route varies — a counsellor will confirm the current exam.</p>}
                </div>
              </section>

              <section>
                <h2 className="text-2xl">Popular courses</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {college.courses.map((course) => (
                    <li key={course} className="flex items-center gap-2 rounded-lg bg-bg-subtle px-4 py-2.5 text-sm">
                      <span className="size-1.5 rounded-full bg-gold-500" aria-hidden />
                      {course}
                    </li>
                  ))}
                </ul>
              </section>

              {college.cutoffNote || college.rankRange ? (
                <section>
                  <h2 className="text-2xl">Cut-offs, honestly</h2>
                  <p className="mt-3 leading-relaxed text-fg-muted">
                    {college.cutoffNote ?? "Indicative range only."}
                  </p>
                  {college.rankRange ? (
                    <p className="mt-3 text-sm text-fg-muted">
                      <span className="font-medium text-fg">Typical closing rank:</span> {college.rankRange}
                    </p>
                  ) : null}
                </section>
              ) : null}

              <section>
                <h2 className="text-2xl">Placements</h2>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  {college.avgPackageLpa ? `Average package sits around ${college.avgPackageLpa}.` : "Package figures are not consistently published."}
                  {college.highestLpa ? ` Highest observed offer is around ${college.highestLpa}.` : ""} These are recruiter-reported
                  numbers from a single cohort — ask us for the three-year trend before you weigh them.
                </p>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {college.campusNote ? (
                <div className="rounded-xl border border-line bg-bg-card p-6">
                  <h2 className="text-lg">Campus &amp; vibe</h2>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{college.campusNote}</p>
                </div>
              ) : null}

              <div className="rounded-xl border border-gold-500/40 bg-gold-500/8 p-6">
                <h2 className="text-lg">Is this realistic for you?</h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Send us your scores and we will tell you straight whether this is a safe, a stretch, or a dream — with a
                  backup list either way.
                </p>
                <Button asChild variant="primary" className="mt-5 w-full">
                  <Link href="/contact">Check my chances</Link>
                </Button>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {suggestions.length > 0 ? (
        <Section className="!py-0 lg:!pb-20">
          <Container>
            <h2 className="text-2xl">Also worth a look</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {suggestions.map((item) => (
                <Link
                  key={item.slug}
                  href={`/colleges/${item.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-bg-card p-5 transition-colors hover:border-line-strong"
                >
                  <span>
                    <span className="block font-medium">{item.shortName ?? item.name}</span>
                    <span className="mt-1 block text-sm text-fg-muted">{item.city} · {item.stream}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-fg-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}