import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { QuickEnquiryButton } from "@/components/enquiry/quick-enquiry-button";
import { processSteps } from "@/lib/site";

/** How the engagement actually runs — four steps, no mystery. */
export function Process() {
  return (
    <Section id="process" tone="ink">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="How it works"
              title={
                <>
                  From stuck
                  <br />
                  to <span className="text-gradient-gold">decided</span>.
                </>
              }
              description="No 12-week programmes you abandon in week three. A clear, bounded process with a written output at the end of it."
            />
            <div className="mt-9">
              <QuickEnquiryButton variant="gold" size="lg" source="WEBSITE_HERO" label="Start with the free call" />
            </div>
          </div>

          <RevealGroup className="relative flex flex-col gap-5">
            {/* connecting spine */}
            <span className="absolute top-6 bottom-6 left-[1.4rem] w-px bg-linear-to-b from-gold-500/60 via-teal-500/40 to-transparent" aria-hidden />

            {processSteps.map((item) => (
              <RevealItem key={item.step}>
                <div className="group relative flex gap-6 rounded-lg border border-ivory-100/10 bg-ivory-100/4 p-6 transition-colors duration-500 hover:border-gold-500/30 hover:bg-ivory-100/8 sm:p-7">
                  <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-pill border border-gold-500/30 bg-ink-900 font-display text-sm text-gold-300 transition-transform duration-500 group-hover:scale-105">
                    {item.step}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-xl text-ivory-50">{item.title}</h3>
                      <span className="text-xs font-medium tracking-wide text-gold-300/80 uppercase">{item.duration}</span>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-ivory-300/75">{item.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}