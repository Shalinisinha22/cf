import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Section, SectionHeading, Badge } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { getBlogPosts } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Insights",
  description: "Practical writing on career decisions, admissions and student wellbeing — no listicles, no scare tactics.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts(12);
  const [lead, ...rest] = posts;

  return (
    <>
      <Section className="!pt-14 !pb-12 lg:!pt-20">
        <Container>
          <SectionHeading
            eyebrow="Insights"
            title="Things worth reading before you decide"
            description="Written by our counsellors between sessions. No listicles, no 'top 10 careers in 2026'."
          />
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          {posts.length === 0 ? (
            <p className="text-sm text-fg-muted">No articles published yet — check back soon.</p>
          ) : (
            <div className="flex flex-col gap-14">
              {lead ? (
                <RevealItem>
                  <Link
                    href={`/blog/${lead.slug}`}
                    className="group grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center"
                  >
                    <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-linear-to-br from-ink-700 to-ink-900">
                      <div
                        className="absolute inset-0 opacity-70"
                        style={{ background: "radial-gradient(80% 70% at 30% 20%, color-mix(in oklab, var(--gold-500) 30%, transparent), transparent 62%)" }}
                        aria-hidden
                      />
                      <span className="absolute bottom-4 left-4">
                        <Badge className="bg-ink-950/70 backdrop-blur-sm">Latest</Badge>
                      </span>
                    </div>
                    <div>
                      <p className="text-xs tracking-[0.18em] text-gold-600 uppercase">{lead.author ?? "Counsel & Guide"}</p>
                      <h2 className="mt-3 text-3xl leading-tight transition-colors group-hover:text-gold-700 dark:group-hover:text-gold-300">
                        {lead.title}
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-fg-muted">{lead.excerpt}</p>
                      <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                        Read the piece
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                      </p>
                    </div>
                  </Link>
                </RevealItem>
              ) : null}

              {rest.length ? (
                <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <RevealItem key={post.id}>
                      <article className="group flex h-full flex-col rounded-xl border border-line bg-bg-elevated p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                        <p className="text-xs text-fg-muted">{post.publishedAt ? formatDate(post.publishedAt) : ""}</p>
                        <h3 className="mt-3 text-lg leading-snug transition-colors group-hover:text-gold-700 dark:group-hover:text-gold-300">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {(post.tags ?? []).slice(0, 2).map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                      </article>
                    </RevealItem>
                  ))}
                </RevealGroup>
              ) : null}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
