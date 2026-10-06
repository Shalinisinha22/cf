import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container, Section, SectionHeading, Badge } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { QuickEnquiryButton } from "@/components/enquiry/quick-enquiry-button";
import { getServices } from "@/lib/api";
import { serviceImage } from "@/lib/images";
import { fallbackServices } from "@/lib/site";
import type { Service } from "@/lib/api";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Career counselling, admission guidance, stream selection, psychometric testing, study abroad and scholarship support — structured sessions with a written roadmap.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const fromApi = await getServices();
  const services: Service[] = fromApi.length ? fromApi : (fallbackServices as unknown as Service[]);

  return (
    <>
      <Section className="!pt-14 !pb-12 lg:!pt-20">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Services"
            title="Pick the decision you need help with"
            description="Each service is a defined process with a written output — not an open-ended hourly arrangement. Not sure which applies? The free call will sort it in twenty minutes."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <QuickEnquiryButton variant="gold" size="lg" source="SERVICE_PAGE" label="Not sure? Book a free call" />
            <Button asChild variant="outline" size="lg">
              <a href="#compare">Compare everything</a>
            </Button>
          </div>
        </Container>
      </Section>

      <Section className="!pt-0">
        <RevealGroup className="flex flex-col gap-5">
          {services.map((service) => (
            <RevealItem key={service.id}>
              <article className="group grid gap-6 rounded-xl border border-line bg-bg-elevated p-7 transition-all duration-500 hover:border-gold-500/40 hover:shadow-lift sm:p-9 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
                <div>
                  <div className="relative aspect-3/1 overflow-hidden rounded-lg border border-line bg-ink">
                    <Image
                      src={serviceImage(service.slug)}
                      alt={`${service.name} illustration`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl leading-snug sm:text-3xl">
                      <Link href={`/services/${service.slug}`} className="transition-colors hover:text-gold-700 dark:hover:text-gold-300">
                        {service.name}
                      </Link>
                    </h2>
                    {service.durationMins ? <Badge tone="teal">{service.durationMins} min</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm font-medium text-gold-700 dark:text-gold-300">{service.tagline}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted">{service.description}</p>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <QuickEnquiryButton
                      variant="primary"
                      size="md"
                      service={service.slug}
                      source="SERVICE_PAGE"
                      label="Enquire about this"
                    />
                    <Button asChild variant="ghost" size="md">
                      <Link href={`/services/${service.slug}`}>
                        Full details <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-3 rounded-lg border border-line bg-bg-subtle p-6">
                  <p className="text-[0.66rem] font-semibold tracking-[0.2em] text-fg-muted uppercase">What you walk away with</p>
                  <ul className="flex flex-col gap-2.5">
                    {(service.highlights?.length ? service.highlights : service.outcomes?.slice(0, 3) ?? []).slice(0, 4).map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-fg-muted">
                        <Check className="mt-0.5 size-4 shrink-0 text-teal-500" aria-hidden />
                        {item}
                      </li>
                    ))}
                    {!service.highlights?.length && !service.outcomes?.length ? (
                      <li className="text-sm text-fg-muted">A written roadmap and a 90-day follow-up plan.</li>
                    ) : null}
                  </ul>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section id="compare" tone="subtle">
        <Container>
          <SectionHeading eyebrow="Side by side" title="Which session do you need?" />
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-3xl border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-4 pr-4 font-medium">Service</th>
                  <th className="py-4 pr-4 font-medium">Best for</th>
                  <th className="py-4 pr-4 font-medium">Length</th>
                  <th className="py-4 pr-4 font-medium">Output</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} className="border-b border-line/70 transition-colors hover:bg-bg/60">
                    <td className="py-4 pr-4 font-medium">
                      <Link href={`/services/${s.slug}`} className="hover:text-gold-700 dark:hover:text-gold-300">
                        {s.name}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-fg-muted">{s.tagline}</td>
                    <td className="py-4 pr-4 text-fg-muted">{s.durationMins ? `${s.durationMins} min` : "Flexible"}</td>
                    <td className="py-4 text-fg-muted">Written roadmap</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>
    </>
  );
}