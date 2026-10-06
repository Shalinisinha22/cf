import type { Metadata } from "next";
import Image from "next/image";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Team, TrustStrip } from "@/components/home/team";
import { FinalCta } from "@/components/home/final-cta";
import { getTeam } from "@/lib/api";
import { aboutImage } from "@/lib/images";
import { site, processSteps, principles } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Counsel & Guide is a small career counselling practice in Mumbai. Fifteen years of educational psychology, small caseloads, and a written roadmap after every engagement.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <>
      <Section className="!pt-14 !pb-12 lg:!pt-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="About us"
            title="We started this because good advice was being sold as a package"
            description="Counsel & Guide was founded in 2012 by Dr. Ananya Rao after a decade of watching capable students make life-changing decisions on advice that was either too late, too expensive, or too casual."
          />
        </Container>
        <Container className="mt-12">
          <Reveal className="overflow-hidden rounded-2xl border border-line shadow-soft">
            <Image
              src={aboutImage}
              alt="Inside the Counsel & Guide counselling studio — desks, diplomas and a city window"
              width={1400}
              height={560}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="h-auto w-full"
            />
          </Reveal>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal className="flex flex-col gap-5 text-base leading-relaxed text-fg-muted">
            <p>
              Most families arrive with the same two questions — <em className="text-fg">is this the right choice?</em> and{" "}
              <em className="text-fg">how do we know?</em> We built the practice around answering the second one with
              evidence: aptitude data, current admission numbers, real costs, and honest trade-offs.
            </p>
            <p>
              We deliberately keep caseloads small. Every student gets a named counsellor who knows their case in detail,
              because the value is not in a single session — it is in someone noticing the pattern across four of them.
            </p>
            <p>
              We also say no. If your problem needs a clinical psychologist, an education lawyer, or a migration agent,
              we will say so and point you to someone who can actually help. Referrals are not lost revenue to us.
            </p>
          </Reveal>

          <Reveal className="grid gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="rounded-lg border border-line bg-bg-subtle p-5">
                <p className="text-sm font-medium">{p.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{p.body}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section tone="subtle" className="!py-16">
        <Container>
          <SectionHeading eyebrow="Our process" title="Four steps, no surprises" />
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <RevealItem key={step.step}>
                <div className="h-full rounded-lg border border-line bg-bg p-6">
                  <span className="font-display text-2xl text-gold-500">{step.step}</span>
                  <h3 className="mt-4 text-lg">{step.title}</h3>
                  <p className="mt-1 text-xs font-medium tracking-wide text-fg-muted uppercase">{step.duration}</p>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Team team={team} />
      <TrustStrip />

      <Section tone="base" className="!py-16">
        <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {site.stats.map((stat) => (
            <Reveal key={stat.label} className="text-center">
              <p className="font-display text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-fg-muted">{stat.label}</p>
            </Reveal>
          ))}
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}