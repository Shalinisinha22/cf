import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/primitives";
import { QuickEnquiryButton } from "@/components/enquiry/quick-enquiry-button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enquiry received",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Section className="!pt-16 lg:!pt-24">
      <Container className="max-w-2xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-pill bg-teal-500/12 text-teal-500">
          <CalendarCheck className="size-8" aria-hidden />
        </span>
        <h1 className="mt-7 text-4xl leading-tight sm:text-5xl">Enquiry received</h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-fg-muted">
          A counsellor will call you within one working day. In the meantime, if it is urgent, WhatsApp is the fastest way
          to reach us.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="whatsapp" size="lg">
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden /> WhatsApp a counsellor
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={`tel:${site.phoneRaw}`}>
              <Phone className="size-4" aria-hidden /> {site.phone}
            </a>
          </Button>
        </div>

        <div className="mt-14 rounded-xl border border-line bg-bg-subtle p-7 text-left">
          <h2 className="text-lg">While you wait</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-fg-muted">
            <li>• Note down the questions you want answered — we will work through them live.</li>
            <li>• Have your marksheets or reports handy if you already have them.</li>
            <li>• Think about constraints — budget, location, family expectations. Honesty here saves weeks.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/services" className="text-gold-700 underline underline-offset-4 hover:text-gold-600 dark:text-gold-300">
            Browse services
          </Link>
          <Link href="/blog" className="text-fg-muted underline underline-offset-4 hover:text-fg">
            Read our insights
          </Link>
          <QuickEnquiryButton variant="ghost" size="sm" label="Add another enquiry" />
        </div>
      </Container>
    </Section>
  );
}
