import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/primitives";
import { QuickEnquiryButton } from "@/components/enquiry/quick-enquiry-button";
import type { Service } from "@/lib/api";
import { fallbackServices } from "@/lib/site";

export function ServicesGrid({ services }: { services: Service[] }) {
  const services_ = (services.length ? services : (fallbackServices as unknown as Service[])).slice(0, 4);

  return (
    <Section id="services" tone="subtle">
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Four decisions that shape the next decade
              <span className="block text-fg-muted">— sorted with evidence, not opinion.</span>
            </>
          }
          description="Every engagement starts the same way: understand the person, then the problem. Below are the decisions families ask us about most."
          action={
            <div className="mt-2 flex flex-wrap gap-3">
              <QuickEnquiryButton service="career-counselling" label="Book a free call" />
            </div>
          }
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2">
          {services_.map((service, index) => (
            <RevealItem key={service.id ?? service.slug}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-bg-elevated p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lift sm:p-8">
                <div
                  className="pointer-events-none absolute -top-20 -right-16 size-52 rounded-full bg-gold-500/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-sm text-fg-muted/70">{String(index + 1).padStart(2, "0")}</span>
                  <Badge tone="gold">{service.durationMins ? `${service.durationMins} min` : "Flexible"}</Badge>
                </div>

                <h3 className="mt-6 text-2xl leading-snug">{service.name}</h3>
                <p className="mt-2 text-sm font-medium text-gold-700 dark:text-gold-300">{service.tagline}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-muted">{service.description}</p>

                <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-5">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-gold-600"
                  >
                    What you get
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </Link>
                  <QuickEnquiryButton
                    service={service.slug}
                    variant="ghost"
                    size="sm"
                    label="Enquire"
                    className="opacity-70 transition-opacity group-hover:opacity-100"
                  />
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}