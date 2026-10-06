import type { MetadataRoute } from "next";
import { getBlogPosts, getColleges, getServices } from "@/lib/api";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, { colleges }] = await Promise.all([getServices(), getBlogPosts(50), getColleges()]);

  const staticRoutes = ["", "/services", "/colleges", "/about", "/contact", "/blog", "/privacy", "/terms"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : path === "/services" ? 0.9 : path === "/colleges" ? 0.85 : 0.6,
  }));

  return [
    ...staticRoutes,
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...colleges.map((c) => ({ url: `${site.url}/colleges/${c.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
