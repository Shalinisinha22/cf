import { Brain, UserRound, Users, Handshake } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { principles } from "@/lib/site";

const ICONS = [Brain, UserRound, Users, Handshake];

export function Principles() {
  return (
    <Section id="why-us" tone="base">
      <Container>
        <SectionHeading
          eyebrow="Why families pick us"
          title="A practice built on how we would want to be treated"
          description="Counselling is easy to sell and hard to do well. These are the four rules we do not bend."
        />

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          {principles.map((principle, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <RevealItem key={principle.title}>
                <div className="group h-full bg-bg p-8 transition-colors duration-500 hover:bg-bg-subtle sm:p-10">
                  <span className="grid size-11 place-items-center rounded-md bg-gold-500/12 text-gold-600 transition-all duration-500 group-hover:scale-105 group-hover:bg-gold-500 group-hover:text-ink-950 dark:group-hover:text-ink-950">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-xl leading-snug">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">{principle.body}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </Section>
  );
}