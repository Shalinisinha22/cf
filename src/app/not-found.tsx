import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/primitives";
import { primaryNav } from "@/lib/site";

export default function NotFound() {
  return (
    <Section className="!pt-20 lg:!pt-28">
      <Container className="max-w-xl text-center">
        <p className="font-display text-6xl text-gold-500">404</p>
        <h1 className="mt-6 text-3xl sm:text-4xl">This page took a wrong turn</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fg-muted">
          The link may be old, or we moved something. Try one of these instead — or tell us what you were looking for and
          we will fix the link.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="primary" size="lg">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Report a broken link</Link>
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-fg-muted">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="underline underline-offset-4 hover:text-fg">
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
