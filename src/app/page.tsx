import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { CollegeSpotlight } from "@/components/home/college-spotlight";
import { ServicesGrid } from "@/components/home/services-grid";
import { Process } from "@/components/home/process";
import { Principles } from "@/components/home/principles";
import { Testimonials } from "@/components/home/testimonials";
import { FaqSection } from "@/components/home/faq";
import { Team, TrustStrip, EnquiryBand } from "@/components/home/team";
import { FinalCta } from "@/components/home/final-cta";
import { getColleges, getFaqs, getServices, getTeam, getTestimonials } from "@/lib/api";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  // Content drives the page; fallbacks render when the API is unreachable.
  const [services, testimonials, faqs, team, { colleges }] = await Promise.all([
    getServices(),
    getTestimonials(3),
    getFaqs(),
    getTeam(),
    getColleges({ limit: 40 }),
  ]);

  // Banner slider: featured first, then colleges that have a real campus photo,
  // then the rest — so the hero leads with the strongest visuals.
  const rank = (c: (typeof colleges)[number]) =>
    (c.featured ? 0 : 2) + (c.image?.endsWith(".jpg") ? 0 : 1);
  const bannerColleges = [...colleges].sort((a, b) => rank(a) - rank(b)).slice(0, 3);

  return (
    <>
      <Hero colleges={bannerColleges} />
      <CollegeSpotlight colleges={colleges} />
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
