import type { Metadata } from "next";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms that apply when you use the Counsel & Guide website or book a counselling session.",
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    title: "Using this website",
    body: "Content on this site is general guidance, not professional advice. Nothing here creates a counsellor-client relationship — that only begins after a paid session is confirmed.",
  },
  {
    title: "Booking and cancellation",
    body: "Sessions are confirmed by our team after your first call. Reschedule or cancel free of charge up to 24 hours before the session. Inside 24 hours, 50% of the session fee applies because the slot is held for you.",
  },
  {
    title: "Fees and payment",
    body: "Fees are quoted before a session is booked and never change afterwards. Payment is due at the start of the session unless an instalment plan has been agreed in writing.",
  },
  {
    title: "Our limitations",
    body: "We give career and admissions guidance, not clinical psychology, legal advice or immigration guarantees. Where a problem needs another kind of professional, we will refer you on.",
  },
  {
    title: "Liability",
    body: `Decisions made on our guidance remain yours. To the extent permitted by law, ${site.legalName} is not liable for academic, admission or employment outcomes that follow from advice given in good faith. Concerns should be raised at ${site.email} within 14 days.`,
  },
];

export default function TermsPage() {
  return (
    <Section className="!pt-14 lg:!pt-20">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Legal" title="Terms of use" description="The short version of what you can expect, and what we ask in return." />
        <div className="mt-12 flex flex-col gap-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{section.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
