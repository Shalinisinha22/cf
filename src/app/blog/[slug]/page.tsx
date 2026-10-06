import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Section, Badge } from "@/components/ui/primitives";
import { QuickEnquiryButton } from "@/components/enquiry/quick-enquiry-button";
import { getBlogPost, getBlogPosts } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const posts = await getBlogPosts(12);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article" };
  return {
    title: post.title,
    description: post.excerpt.slice(0, 180),
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.publishedAt ?? undefined },
  };
}

/** The CMS stores plain paragraphs; blank lines separate them. */
function renderBody(body: string | null) {
  if (!body) return null;
  return body.split(/\n{2,}/).map((block, i) => (
    <p key={i} className="mt-5 text-base leading-relaxed text-fg-muted first:mt-0">
      {block}
    </p>
  ));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <Section className="!pt-12 !pb-10">
        <Container className="max-w-2xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg">
            <ArrowLeft className="size-4" aria-hidden /> All insights
          </Link>
          <p className="mt-8 text-xs tracking-[0.18em] text-gold-600 uppercase">{post.author ?? site.name}</p>
          <h1 className="mt-3 text-4xl leading-[1.08] sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-fg-muted">{post.publishedAt ? formatDate(post.publishedAt) : ""}</p>
          <p className="mt-7 border-l-2 border-gold-500/50 pl-5 text-lg leading-relaxed text-fg">{post.excerpt}</p>
        </Container>
      </Section>

      <Section className="!pt-0 !pb-20">
        <Container className="max-w-2xl">
          <article>{renderBody(post.body)}</article>
          <div className="mt-10 flex flex-wrap gap-2">
            {(post.tags ?? []).map((tag) => (
              <Badge key={tag} tone="teal">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-14 rounded-xl border border-line bg-bg-subtle p-7">
            <h2 className="text-xl">Want this looked at properly?</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Reading is a start. A counsellor will map your actual situation — data, constraints and all.
            </p>
            <QuickEnquiryButton variant="gold" size="lg" className="mt-6" source="BLOG" label="Book a free clarity call" />
          </div>
        </Container>
      </Section>
    </>
  );
}
