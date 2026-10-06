import type { Metadata } from "next";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Counsel & Guide collects, uses and protects the information you share with us.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    title: "What we collect",
    body: "When you submit an enquiry we record your name, phone number, email (if given), city, current qualification, the service you are interested in, your message, and how you reached us (source page, referrer and campaign parameters). We also keep an internal record of your counselling sessions, notes and follow-ups.",
  },
  {
    title: "Why we collect it",
    body: "To contact you about your enquiry, to prepare for and deliver counselling, to send the written roadmap you asked for, and to follow up if you ask us to. We do not use your details for third-party marketing.",
  },
  {
    title: "Who can see it",
    body: "Only the counsellor assigned to you and the practice leads. We never sell or rent contact lists. We share nothing with advertisers or data brokers.",
  },
  {
    title: "How long we keep it",
    body: "Enquiry records are kept for 24 months, after which contact details are deleted and session notes are anonymised. If you become a counselling client, records are retained for the period required by professional practice.",
  },
  {
    title: "Cookies",
    body: "We store first-party attribution parameters (UTM source, medium, campaign) in your browser so we know which enquiry came from which campaign. We do not run third-party advertising cookies.",
  },
  {
    title: "Your rights",
    body: `You can ask to see, correct or delete your data at any time by writing to ${site.email}. We respond within 30 days.`,
  },
];

export default function PrivacyPage() {
  return (
    <Section className="!pt-14 lg:!pt-20">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Legal" title="Privacy policy" description="Plain English, no dark patterns. Last updated this year." />
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
