import Link from "next/link";
import { ArrowUpRight, GraduationCap, Building2, HandCoins } from "lucide-react";
import { Container, Section, SectionHeading, Badge } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { QuickEnquiryButton } from "@/components/enquiry/quick-enquiry-button";
import { initials } from "@/lib/utils";
import type { TeamMember } from "@/lib/api";

/** The team — proof that real people, not a marketplace, answer the phone. */
export function Team({ team }: { team: TeamMember[] }) {
  if (!team.length) return null;

  return (
    <Section id="team" tone="base">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="The people"
            title="You will speak to one of these"
            description="Every counsellor here has spent years in education or psychology — and still keeps a caseload small enough to remember the details."
          />
          <Link
            href="/about#team"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors hover:text-gold-600"
          >
            Meet everyone <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.slice(0, 3).map((member) => (
            <RevealItem key={member.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-bg-elevated transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-ink-700 to-ink-900">
                  <div
                    className="absolute inset-0 opacity-80"
                    style={{ background: "radial-gradient(90% 80% at 25% 15%, color-mix(in oklab, var(--gold-500) 30%, transparent), transparent 60%)" }}
                    aria-hidden
                  />
                  <svg className="absolute inset-0 size-full text-ivory-100/85" viewBox="0 0 400 300" fill="none" aria-hidden>
                    <circle cx="200" cy="112" r="48" fill="currentColor" opacity="0.9" />
                    <path d="M112 300c0-46 40-76 88-76s88 30 88 76H112Z" fill="currentColor" opacity="0.9" />
                  </svg>
                  <span className="absolute top-4 left-4">
                    <Badge tone="gold" className="bg-ink-950/70 backdrop-blur-sm">
                      {member.yearsExperience ? `${member.yearsExperience} yrs` : "Expert"}
                    </Badge>
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg leading-snug">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-gold-700 dark:text-gold-300">{member.title}</p>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-fg-muted">{member.bio}</p>

                  {member.specialties?.length ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {member.specialties.slice(0, 3).map((s) => (
                        <li key={s}>
                          <Badge>{s}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

const TRUST = [
  { icon: GraduationCap, title: "Schools & colleges", body: "Workshops and 1:1 sessions for entire cohorts, billed per institution." },
  { icon: Building2, title: "Employers", body: "Pre-hire assessment and career-mapping sessions for bulk hiring drives." },
  { icon: HandCoins, title: "NGOs & trusts", body: "Pro-bono counselling slots reserved for students from lower-income families." },
];

/** Who we work with — signals institutional credibility next to the family tone. */
export function TrustStrip() {
  return (
    <Section tone="subtle" className="!py-14">
      <Container>
        <Reveal className="text-center">
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-fg-muted uppercase">Trusted with</p>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-3">
          {TRUST.map((item) => (
            <RevealItem key={item.title}>
              <div className="flex h-full items-start gap-4 rounded-lg border border-line bg-bg p-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-teal-500/12 text-teal-600 dark:text-teal-300">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{item.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

/** Small inline band that pushes the enquiry CTA without a full section. */
export function EnquiryBand() {
  return (
    <section className="border-y border-line bg-bg-subtle py-12">
      <Container className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-xl sm:text-2xl">Not sure which service you need?</p>
          <p className="mt-1.5 text-sm text-fg-muted">Describe the situation on a call — we will tell you honestly.</p>
        </div>
        <QuickEnquiryButton variant="primary" size="lg" label="Book a free 20-min call" source="WEBSITE_FOOTER" />
      </Container>
    </section>
  );
}