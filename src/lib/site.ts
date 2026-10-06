/**
 * Single source of truth for brand copy, navigation and contact details.
 * Content that the CMS owns (services, testimonials, FAQs, blog) comes from the
 * API instead — see `src/lib/api.ts`.
 */
export const site = {
  name: "Counsel & Guide",
  legalName: "Counsel & Guide Career Advisory LLP",
  tagline: "Career clarity, with someone in your corner.",
  description:
    "Human-first career, education and admissions counselling for students and parents. Free 20-minute clarity call, structured assessments and a written roadmap you can act on.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+91 98765 43210",
  phoneRaw: "+919876543210",
  whatsapp: "919876543210",
  email: "hello@counselguide.in",
  address: {
    line1: "2nd Floor, Sterling House",
    line2: "Bandra West, Mumbai 400050",
    country: "India",
  },
  hours: "Mon–Sat · 9:00 AM – 8:00 PM IST",
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
  stats: [
    { value: "12,400+", label: "Sessions guided" },
    { value: "94%", label: "Report a clearer decision" },
    { value: "9 yrs", label: "Combined practice" },
    { value: "4.9/5", label: "Average parent rating" },
  ],
} as const;

export const primaryNav = [
  { label: "Services", href: "/services" },
  { label: "How we work", href: "/#process" },
  { label: "Colleges", href: "/colleges" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = [
  {
    title: "Services",
    links: [
      { label: "Career counselling", href: "/services/career-counselling" },
      { label: "Stream selection", href: "/services/stream-selection" },
      { label: "Admissions guidance", href: "/services/admission-guidance" },
      { label: "Study abroad", href: "/services/study-abroad" },
      { label: "Student mentoring", href: "/services/student-mentoring" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our counsellors", href: "/about#team" },
      { label: "College guide", href: "/colleges" },
      { label: "Insights", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Book a free call", href: "/contact#book" },
      { label: "FAQs", href: "/#faq" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
    ],
  },
] as const;

/** Fallback list used before the API responds and if content is unreachable. */
export const fallbackServices = [
  {
    slug: "career-counselling",
    name: "Career counselling",
    shortName: "Career",
    tagline: "Find the career that fits who you actually are",
    description:
      "A structured one-to-one process: interest and aptitude mapping, a realistic market read, and a written roadmap you can act on this month.",
    durationMins: 60,
    priceFrom: 0,
    priceUnit: "session",
    icon: "compass",
  },
  {
    slug: "stream-selection",
    name: "Stream selection",
    shortName: "Streams",
    tagline: "Choose the stream you will not regret in June",
    description:
      "For Class 8–12 students. Subject mapping, exam timelines and honest trade-offs between science, commerce and humanities.",
    durationMins: 45,
    priceFrom: 0,
    priceUnit: "session",
    icon: "compass",
  },
  {
    slug: "admission-guidance",
    name: "Admissions guidance",
    shortName: "Admissions",
    tagline: "Applications that stand out, not ones that fit in",
    description:
      "Profile assessment, college shortlists, essay direction and a submission calendar that respects deadlines without panic.",
    durationMins: 60,
    priceFrom: 0,
    priceUnit: "session",
    icon: "compass",
  },
  {
    slug: "study-abroad",
    name: "Study abroad",
    shortName: "Abroad",
    tagline: "A visa-ready plan, built early",
    description:
      "Country shortlisting, budget reality checks, IELTS/TOEFL timing and a document checklist that survives consulate scrutiny.",
    durationMins: 60,
    priceFrom: 0,
    priceUnit: "session",
    icon: "compass",
  },
] as const;

export const processSteps = [
  {
    step: "01",
    title: "Free clarity call",
    duration: "20 minutes",
    body: "Tell us where you are stuck. No forms, no sales pitch — just an honest read on whether we can help.",
  },
  {
    step: "02",
    title: "Deep-dive assessment",
    duration: "60–90 minutes",
    body: "A counsellor maps aptitude, interests, constraints and the market reality, in that order. Parents welcome.",
  },
  {
    step: "03",
    title: "Written roadmap",
    duration: "Within 3 days",
    body: "You leave with a prioritised plan, dates, and the two decisions that actually move the needle.",
  },
  {
    step: "04",
    title: "Follow-through",
    duration: "90 days",
    body: "Application reviews, mock interviews and check-ins until the decision is made — not just discussed.",
  },
] as const;

export const principles = [
  {
    title: "Evidence before opinion",
    body: "Every recommendation is backed by assessment data, real cost figures and current admission data — never vibes.",
  },
  {
    title: "One counsellor, start to finish",
    body: "You get a named person who knows your case. No rotating call-centre voices, no being re-briefed every session.",
  },
  {
    title: "Parents in the room, respectfully",
    body: "Most Indian families fund this decision. We include them without letting them overrule the student's own trajectory.",
  },
  {
    title: "Small, honest pipeline",
    body: "We take a limited number of students each month. If we are not the right fit, we say so and point you elsewhere.",
  },
] as const;