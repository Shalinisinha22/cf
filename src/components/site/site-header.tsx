"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { useQuickEnquiry } from "@/components/enquiry/quick-enquiry-context";
import { primaryNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function SiteHeader() {
  const pathname = usePathname();
  const { open } = useQuickEnquiry();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [servicesOpen, setServicesOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setServicesOpen(false);
  }

  const serviceLinks = [
    { label: "Career counselling", href: "/services/career-counselling" },
    { label: "Stream selection", href: "/services/stream-selection" },
    { label: "Admissions & strategy", href: "/services/admissions-strategy" },
    { label: "Study abroad", href: "/services/study-abroad" },
  ];

  return (
    <>
      {/* Utility bar */}
      <div className="hidden bg-ink-950 text-ivory-200 lg:block">
        <Container className="flex h-9 items-center justify-between text-[0.72rem]">
          <p className="tracking-[0.12em] uppercase">
            <span className="text-gold-300">Free</span> 20-minute clarity call · Mon–Sat, 9 AM – 8 PM IST
          </p>
          <div className="flex items-center gap-6">
            <a href={`tel:${site.phoneRaw}`} className="flex items-center gap-2 transition-colors hover:text-gold-300">
              <Phone className="size-3" aria-hidden /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-gold-300">
              {site.email}
            </a>
          </div>
        </Container>
      </div>

      <header
        className={cn(
          "sticky top-0 z-90 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled ? "glass border-b border-line shadow-[0_1px_0_rgb(11_18_32/0.04),0_10px_30px_-24px_rgb(11_18_32/0.4)]" : "bg-transparent",
        )}
      >
        <Container className="flex h-18 items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} home`}>
            <Logo className="size-9 transition-transform duration-500 group-hover:rotate-[-6deg]" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[1.05rem] font-medium tracking-[-0.01em]">Counsel &amp; Guide</span>
              <span className="mt-1 text-[0.6rem] font-semibold tracking-[0.22em] text-fg-muted uppercase">Career Advisory</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                href="/services"
                className={cn(
                  "flex items-center gap-1 rounded-pill px-4 py-2 text-sm font-medium transition-colors hover:bg-fg/6",
                  pathname.startsWith("/services") ? "text-fg" : "text-fg-muted",
                )}
              >
                Services
                <ChevronDown className={cn("size-3.5 transition-transform duration-300", servicesOpen && "rotate-180")} aria-hidden />
              </Link>
              <AnimatePresence>
                {servicesOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 w-72 pt-3"
                  >
                    <div className="overflow-hidden rounded-lg border border-line bg-bg-elevated p-2 shadow-lift">
                      {serviceLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block rounded-md px-3 py-2.5 text-sm text-fg-muted transition-colors hover:bg-fg/6 hover:text-fg"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        className="mt-1 block rounded-md border-t border-line px-3 py-2.5 text-xs font-semibold tracking-wide text-gold-600 uppercase"
                      >
                        Compare all services
                      </Link>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {primaryNav
              .filter((item) => item.href !== "/services")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-pill px-4 py-2 text-sm font-medium transition-colors hover:bg-fg/6",
                    pathname === item.href ? "text-fg" : "text-fg-muted",
                  )}
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="gold" size="sm" className="hidden sm:inline-flex" onClick={() => open("career-counselling")}>
              Book a free call
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-pill border border-line-strong text-fg transition-colors hover:bg-fg/6 lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="glass z-80 overflow-hidden border-b lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-5">
              {[{ label: "All services", href: "/services" }, ...serviceLinks, ...primaryNav.filter((n) => n.href !== "/services")].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-base font-medium text-fg transition-colors hover:bg-fg/6"
                >
                  {item.label}
                </Link>
              ))}
              <Button
                variant="gold"
                size="lg"
                className="mt-3 w-full"
                onClick={() => {
                  setMenuOpen(false);
                  open("career-counselling");
                }}
              >
                Book a free call
              </Button>
              <a href={`tel:${site.phoneRaw}`} className="mt-2 text-center text-sm text-fg-muted">
                or call {site.phone}
              </a>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}