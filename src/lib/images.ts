/**
 * Local illustration assets in /public/images.
 *
 * Every image is a generated placeholder SVG in the site palette — swap the
 * file for real photography of the same aspect ratio without touching code.
 */

const SERVICE_IMAGES: Record<string, string> = {
  "career-counselling": "/images/services/career-counselling.svg",
  "stream-selection": "/images/services/stream-selection.svg",
  "admission-guidance": "/images/services/admission-guidance.svg",
  "study-abroad": "/images/services/study-abroad.svg",
};

const DEFAULT_SERVICE_IMAGE = "/images/services/default.svg";

export const heroImage = "/images/hero-session.svg";
export const aboutImage = "/images/about-studio.svg";

const PORTRAITS = ["/images/portrait-1.svg", "/images/portrait-2.svg", "/images/portrait-3.svg"];

export function serviceImage(slug: string): string {
  return SERVICE_IMAGES[slug] ?? DEFAULT_SERVICE_IMAGE;
}

export function teamPortrait(index: number): string {
  return PORTRAITS[index % PORTRAITS.length];
}
