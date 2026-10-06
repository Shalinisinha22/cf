import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { ServicesGrid } from "@/components/home/services-grid";
import { Process } from "@/components/home/process";
import { Principles } from "@/components/home/principles";
import { Testimonials } from "@/components/home/testimonials";
import { FaqSection } from "@/components/home/faq";
import { Team, TrustStrip, EnquiryBand } from "@/components/home/team";
import { FinalCta } from "@/components/home/final-cta";
import { getFaqs, getServices, getTeam, getTestimonials } from "@/lib/api";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  // Content drives the page; fallbacks render when the API is unreachable.
  const [services, testimonials, faqs, team] = await Promise.all([
    getServices(),
    getTestimonials(3),
    getFaqs(),
    getTeam(),
  ]);

  return (
    <>
      <Hero />
      <ServicesGrid services={services} />
      <Process />
      <Principles />
      <Team team={team} />
      <Testimonials testimonials={testimonials} />
      <TrustStrip />
      <FaqSection faqs={faqs.slice(0, 6)} />
      <EnquiryBand />
      <FinalCta />
    </>
  );
}