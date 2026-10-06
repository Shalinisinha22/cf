"use client";

import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { useQuickEnquiry } from "@/components/enquiry/quick-enquiry-context";
import { footerNav, site } from "@/lib/site";

export function SiteFooter() {
  const { open } = useQuickEnquiry();
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden bg-ink-950 text-ivory-200">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full opacity-25 blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--gold-500), transparent 70%)" }}
        aria-hidden
      />

      <Container className="relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr] lg:gap-20 lg:py-20">
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-display text-2xl leading-snug text-ivory-50">{site.tagline}</p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory-300/80">{site.description}</p>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <a href={`tel:${site.phoneRaw}`} className="flex items-center gap-3 transition-colors hover:text-gold-300">
                <Phone className="size-4 text-gold-500" aria-hidden /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 transition-colors hover:text-gold-300">
                <Mail className="size-4 text-gold-500" aria-hidden /> {site.email}
              </a>
              <p className="flex items-start gap-3 text-ivory-300/80">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-500" aria-hidden />
                <span>
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => open()}
                className="inline-flex items-center gap-2 rounded-pill bg-gold-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-gold-400"
              >
                Book a free call <ArrowUpRight className="size-3.5" aria-hidden />
              </button>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-pill border border-ivory-200/25 px-5 py-2.5 text-sm font-medium transition-colors hover:border-ivory-200/50"
              >
                <MessageCircle className="size-4" aria-hidden /> WhatsApp
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.title}>
                <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-gold-500 uppercase">{group.title}</p>
                <ul className="mt-5 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.href}-${link.label}`}>
                      <Link href={link.href} className="text-sm text-ivory-300/85 transition-colors hover:text-gold-300">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-ivory-100/10 py-7 text-xs text-ivory-300/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="flex items-center gap-4">
            <span>{site.hours}</span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-2">
              {Object.entries(site.social).map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="capitalize transition-colors hover:text-gold-300">
                  {key}
                </a>
              ))}
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}