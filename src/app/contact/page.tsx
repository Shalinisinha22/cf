import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { EnquirySection } from "@/components/enquiry/enquiry-form";
import { ContactForm } from "@/components/enquiry/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free 20-minute clarity call with a counsellor at Counsel & Guide, or send us a message. Mon–Sat, 9 AM – 8 PM IST.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Section className="!pb-10 !pt-14 lg:!pt-20" tone="base">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Talk to us"
            title="Tell us what you are deciding"
            description="The more specific you are, the more useful our first call will be. Three short steps, about ninety seconds."
          />
        </Container>
      </Section>

      <Section className="!pt-4" tone="base">
        <EnquirySection
          source="CONTACT_PAGE"
          reassurance={
            <div className="flex flex-col gap-5">
              <Reveal className="rounded-xl border border-line bg-bg-subtle p-6">
                <h3 className="text-base font-medium">Prefer to just talk?</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Call during working hours and you will reach a counsellor — not a receptionist reading a script.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <Button asChild variant="primary" size="lg">
                    <a href={`tel:${site.phoneRaw}`}>
                      <Phone className="size-4" aria-hidden /> {site.phone}
                    </a>
                  </Button>
                  <Button asChild variant="whatsapp" size="lg">
                    <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-4" aria-hidden /> WhatsApp us
                    </a>
                  </Button>
                </div>
              </Reveal>

              <Reveal className="rounded-xl border border-line bg-bg-subtle p-6">
                <h3 className="text-base font-medium">Studio &amp; hours</h3>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-fg-muted">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden />
                    <span>
                      {site.address.line1}
                      <br />
                      {site.address.line2}
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="size-4 shrink-0 text-gold-600" aria-hidden />
                    {site.hours}
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="size-4 shrink-0 text-gold-600" aria-hidden />
                    <a href={`mailto:${site.email}`} className="underline underline-offset-2 hover:text-fg">
                      {site.email}
                    </a>
                  </li>
                </ul>
              </Reveal>

              <Reveal className="rounded-xl border border-gold-500/25 bg-gold-500/6 p-6">
                <h3 className="text-base font-medium">What happens next</h3>
                <ol className="mt-4 flex flex-col gap-3 text-sm text-fg-muted">
                  <li className="flex gap-3">
                    <span className="font-display text-xs text-gold-600">1</span> A counsellor reads your enquiry and calls within one working day.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display text-xs text-gold-600">2</span> The 20-minute call — we tell you honestly whether we can help.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display text-xs text-gold-600">3</span> You get a written summary of what we discussed. Free, regardless.
                  </li>
                </ol>
              </Reveal>
            </div>
          }
        />
      </Section>

      <Section id="message" tone="subtle" className="!pt-4">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="General message"
              title="Not an enquiry?"
              description="Partnerships, school workshops, press, billing — anything that is not a counselling request goes straight to our inbox."
            />
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}