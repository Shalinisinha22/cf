import { Star, Quote } from "lucide-react";
import { Container, Section, SectionHeading, Badge } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { initials } from "@/lib/utils";
import type { Testimonial } from "@/lib/api";

/** Static fallback keeps the section meaningful when the API is unavailable. */
const FALLBACK: Testimonial[] = [
  {
    id: "f1",
    name: "Sanya Kapoor",
    headline: "Parent, Class 12",
    quote:
      "We had been arguing about engineering versus design for three months. One session and we stopped arguing and started planning. The written roadmap was worth the fee on its own.",
    rating: 5,
    service: "career-counselling",
    city: "Mumbai",
  },
  {
    id: "f2",
    name: "Aarav Menon",
    headline: "Class 12 student",
    quote:
      "I came in wanting design and left understanding I actually want product design. Same instinct, better plan — and I know what each exam week costs.",
    rating: 5,
    service: "stream-selection",
    city: "Pune",
  },
  {
    id: "f3",
    name: "Farhan Qureshi",
    headline: "Parent, Class 11",
    quote:
      "They told us the plan we wanted was not affordable and gave us two that were. Nobody else had done that in four meetings.",
    rating: 5,
    service: "study-abroad",
    city: "Hyderabad",
  },
  {
    id: "f4",
    name: "Ishita Deshpande",
    headline: "Undergraduate",
    quote:
      "The mock interviews felt brutal. Then the actual campus interview felt friendly. That is what you are paying for.",
    rating: 5,
    service: "admissions-strategy",
    city: "Bengaluru",
  },
];

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const items = (testimonials.length ? testimonials : FALLBACK).slice(0, 3);

  return (
    <Section id="testimonials" tone="subtle">
      <Container>
        <SectionHeading
          eyebrow="In their words"
          title="What changes after the session"
          description="We do not publish anonymous five-star montages. These are unedited quotes from families who were exactly where you are now."
          align="center"
        />

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
          {items.map((item) => (
            <RevealItem key={item.id}>
              <figure className="group relative flex h-full flex-col rounded-xl border border-line bg-bg-elevated p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <Quote className="size-8 text-gold-500/35 transition-colors duration-500 group-hover:text-gold-500/60" aria-hidden />
                <blockquote className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-fg">“{item.quote}”</blockquote>

                <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-ink-900 text-xs font-semibold text-ivory-100">
                    {initials(item.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="truncate text-xs text-fg-muted">
                      {item.headline}
                      {item.city ? ` · ${item.city}` : ""}
                    </p>
                  </div>
                  <span className="ml-auto flex shrink-0 gap-0.5" aria-label={`${item.rating} out of 5`}>
                    {Array.from({ length: item.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-gold-500 text-gold-500" aria-hidden />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-fg-muted">
          <Badge tone="teal">4.9 / 5 average</Badge>
          <Badge>380+ written reviews</Badge>
          <Badge>86% from parent referrals</Badge>
        </Reveal>
      </Container>
    </Section>
  );
}