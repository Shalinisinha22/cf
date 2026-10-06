import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { QuickEnquiryButton } from "@/components/enquiry/quick-enquiry-button";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

/** Closing call to action — the one place we ask twice. */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 text-ivory-100 sm:py-28">
      <div
        className="pointer-events-none absolute -top-32 left-1/4 size-[30rem] rounded-full opacity-30 blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--gold-500), transparent 68%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 -bottom-32 size-[28rem] rounded-full opacity-25 blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--teal-500), transparent 68%)" }}
        aria-hidden
      />

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-gold-300 uppercase">No cost, no obligation</p>
          <h2 className="mt-5 text-[2.1rem] leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
            One conversation can save
            <br />
            <span className="text-gradient-gold">a year of wrong turns.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory-300/80 sm:text-lg">
            Book the free 20-minute call. Bring the question you keep circling — the one nobody answers well at home.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <QuickEnquiryButton variant="gold" size="xl" source="WEBSITE_HERO" label="Book my free call" />
            <Button asChild variant="light" size="xl">
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4.5" aria-hidden /> WhatsApp instead
              </a>
            </Button>
          </div>

          <p className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-ivory-300/70">
            <span className="flex items-center gap-2">
              <Phone className="size-3.5 text-gold-300" aria-hidden /> Prefer to talk now?
            </span>
            <a href={`tel:${site.phoneRaw}`} className="font-medium text-ivory-100 underline decoration-gold-500/60 underline-offset-4 transition-colors hover:text-gold-300">
              {site.phone}
            </a>
            <span className="hidden sm:inline">· {site.hours}</span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}