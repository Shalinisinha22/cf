import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section, SectionHeading, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { QuickEnquiryButton } from "@/components/enquiry/quick-enquiry-button";
import { getService, getServices } from "@/lib/api";
import { serviceImage } from "@/lib/images";
import { fallbackServices, site } from "@/lib/site";

export async function generateStaticParams() {
  const services = await getServices();
  if (services.length) return services.map((s) => ({ slug: s.slug }));
  return fallbackServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.name,
    description: service.description.slice(0, 180),
    alternates: { canonical: `/services/${slug}` },
    openGraph: { title: `${service.name} · ${site.name}`, description: service.tagline ?? undefined },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const others = (await getServices()).filter((s) => s.slug !== slug).slice(0, 3);

  const highlights = service.highlights?.length ? service.highlights : service.outcomes ?? [];
  const includes = service.includes?.length ? service.includes : [];
  const faqs = (service as unknown as { faqs?: { question: string; answer: string }[] }).faqs ?? [];

  return (
    <>
      <Section className="!pt-12 !pb-12 lg:!pt-16">
        <Container className="max-w-3xl">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg">
            <ArrowLeft className="size-4" aria-hidden /> All services
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl leading-[1.05] sm:text-5xl">{service.name}</h1>
            {service.durationMins ? (
              <Badge tone="teal" className="mt-2">
                <Clock className="size-3.5" aria-hidden /> {service.durationMins} min
              </Badge>
            ) : null}
          </div>
          {service.tagline ? <p className="mt-3 text-lg text-gold-700 dark:text-gold-300">{service.tagline}</p> : null}
          <p className="mt-6 text-base leading-relaxed text-fg-muted">{service.description}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <QuickEnquiryButton variant="gold" size="lg" service={slug} source="SERVICE_PAGE" label="Book a free call about this" />
            {service.priceFrom ? (
              <span className="flex items-center gap-2 text-sm text-fg-muted">
                <IndianRupee className="size-4" aria-hidden /> From {service.priceFrom.toLocaleString("en-IN")} / {service.priceUnit ?? "session"}
              </span>
            ) : null}
          </div>
        </Container>

        <Container className="mt-10">
          <Reveal className="overflow-hidden rounded-2xl border border-line shadow-soft">
            <div className="relative aspect-3/1 bg-ink">
              <Image
                src={serviceImage(slug)}
                alt={`${service.name} illustration`}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container className="grid gap-10 lg:grid-cols-3">
          {highlights.length ? (
            <div className="lg:col-span-2">
              <Reveal className="rounded-xl border border-line bg-bg-elevated p-7 sm:p-9">
                <h2 className="text-2xl">What you walk away with</h2>
                <ul className="mt-6 flex flex-col gap-3.5">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-pill bg-teal-500/12 text-teal-600 dark:text-teal-300">
                        <Check className="size-3" aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ) : null}

          {includes.length ? (
            <Reveal className="rounded-xl border border-line bg-bg-subtle p-7">
              <h2 className="text-lg">What is included</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-fg-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-500" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </Container>
      </Section>

      {faqs.length ? (
        <Section tone="subtle" className="!py-16">
          <Container className="max-w-3xl">
            <SectionHeading eyebrow="Questions" title="About this service" />
            <div className="mt-8 divide-y divide-line border-y border-line">
              {faqs.map((faq) => (
                <div key={faq.question} className="py-6">
                  <h3 className="text-base font-medium">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {others.length ? (
        <Section className="!py-16">
          <Container>
            <h2 className="text-2xl">Other services</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.id}
                  href={`/services/${other.slug}`}
                  className="group rounded-lg border border-line bg-bg-elevated p-6 transition-all duration-400 hover:-translate-y-0.5 hover:border-gold-500/40 hover:shadow-soft"
                >
                  <p className="text-sm font-medium">{other.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{other.tagline}</p>
                </Link>
              ))}
            </div>
            <Button asChild variant="outline" size="lg" className="mt-8">
              <Link href="/services">Compare all services</Link>
            </Button>
          </Container>
        </Section>
      ) : null}
    </>
  );
}