import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/primitives";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { QuickEnquiryProvider } from "@/components/enquiry/quick-enquiry-context";
import { QuickEnquiryDialog } from "@/components/enquiry/quick-enquiry-dialog";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "career counselling",
    "stream selection",
    "admissions guidance",
    "study abroad counselling",
    "career counselling Mumbai",
    "student counselling India",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#070c16" },
  ],
  width: "device-width",
  initialScale: 1,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  url: site.url,
  telephone: site.phoneRaw,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressCountry: "IN",
  },
  areaServed: "IN",
  sameAs: Object.values(site.social),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* Fonts are loaded at runtime (not next/font) so builds never depend on
            Google's servers being reachable. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
        <style>{`:root{--font-display-family:"Fraunces";--font-body-family:"Plus Jakarta Sans"}`}</style>
      </head>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:rounded-pill focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:text-ivory-100"
        >
          Skip to content
        </a>

        <QuickEnquiryProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
          <QuickEnquiryDialog />
        </QuickEnquiryProvider>

        <Script
          id="org-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        {turnstileSiteKey ? (
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
        ) : null}
      </body>
    </html>
  );
}