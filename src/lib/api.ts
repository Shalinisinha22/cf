/**
 * Server-side client for the Counsel API.
 *
 * Every read degrades gracefully: if the API is unreachable (fresh clone, API
 * still booting, offline demo) the page renders with the fallback content from
 * `site.ts` instead of erroring out.
 */

export const API_URL = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type Service = {
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  tagline: string | null;
  description: string;
  highlights: string[];
  includes: string[];
  outcomes: string[];
  durationMins: number | null;
  priceFrom: number | null;
  priceUnit: string | null;
  order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  headline: string | null;
  quote: string;
  rating: number;
  service: string | null;
  city: string | null;
};

export type Faq = { id: string; question: string; answer: string; category: string | null };

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  yearsExperience: number | null;
  languages: string[];
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string | null;
  coverImage: string | null;
  author: string | null;
  tags: string[];
  publishedAt: string | null;
};

export type College = {
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  city: string;
  state: string;
  type: string;
  affiliation: string | null;
  exams: string[];
  courses: string[];
  stream: string | null;
  rankRange: string | null;
  cutoffNote: string | null;
  avgPackageLpa: string | null;
  highestLpa: string | null;
  campusNote: string | null;
  websiteUrl: string | null;
  image: string | null;
  logo: string | null;
  featured: boolean;
};

export type CollegeFacets = { total: number; states: string[]; streams: string[] };

export type ApiResponse<T> = { data: T; meta?: { total: number; page: number; pageSize: number; totalPages: number; hasNext: boolean; hasPrev: boolean } };

async function getJson<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as ApiResponse<T>;
    return body.data ?? null;
  } catch {
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  return (await getJson<Service[]>("/api/content/services", 600)) ?? [];
}

export async function getService(slug: string): Promise<Service | null> {
  return getJson<Service>(`/api/content/services/${slug}`, 600);
}

export async function getTestimonials(limit = 6): Promise<Testimonial[]> {
  return (await getJson<Testimonial[]>("/api/content/testimonials", 600))?.slice(0, limit) ?? [];
}

export async function getFaqs(): Promise<Faq[]> {
  return (await getJson<Faq[]>("/api/content/faqs", 900)) ?? [];
}

export async function getTeam(): Promise<TeamMember[]> {
  return (await getJson<TeamMember[]>("/api/content/team", 900)) ?? [];
}

export async function getBlogPosts(limit = 12): Promise<BlogPost[]> {
  const posts = await getJson<BlogPost[]>(`/api/content/blog?pageSize=${limit}`, 600);
  return posts ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return getJson<BlogPost>(`/api/content/blog/${slug}`, 600);
}

export async function getColleges(
  filters: { stream?: string; state?: string; exam?: string; search?: string; featured?: boolean } = {},
): Promise<{ colleges: College[]; facets: CollegeFacets }> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "" && value !== false) query.set(key, String(value));
  }
  const qs = query.toString();
  const [rows, facets] = await Promise.all([
    getJson<College[]>(`/api/content/colleges${qs ? `?${qs}` : ""}`, 900),
    getJson<College[]>("/api/content/colleges?limit=100", 900),
  ]);
  return {
    colleges: rows ?? [],
    facets: {
      total: facets?.length ?? rows?.length ?? 0,
      states: [...new Set((facets ?? []).map((c) => c.state))].sort(),
      streams: [...new Set((facets ?? []).map((c) => c.stream).filter((s): s is string => Boolean(s)))].sort(),
    },
  };
}

export async function getCollege(slug: string): Promise<College | null> {
  return getJson<College>(`/api/content/colleges/${slug}`, 900);
}

export type PublicSettings = {
  site: { name?: string; tagline?: string; description?: string; phone?: string; email?: string; address?: string };
  social?: Record<string, string>;
};

export async function getPublicSettings(): Promise<PublicSettings | null> {
  return getJson<PublicSettings>("/api/content/settings/public", 900);
}