import { z } from "zod";

/**
 * Mirrors `api/src/validation/contracts.ts`.
 * The three apps are deployed independently, so the contract is copied rather
 * than shared as a package — keep the two files in sync. The API is the source
 * of truth: slugs, modes, sources and qualification values must match it exactly
 * or submissions are rejected with a validation error.
 */

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(180)
  .email("Enter a valid email address")
  .toLowerCase();

const optionalEmail = z.union([email, z.literal("")]).optional().default("");

const phone = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .transform((v) => v.replace(/[\s\-().]/g, "").replace(/^0+/, ""))
  .refine((v) => /^\+?[1-9]\d{9,14}$/.test(v), "Enter a valid phone number")
  .transform((v) => (v.startsWith("+") || v.length > 10 ? (v.startsWith("+") ? v : `+${v}`) : `+91${v}`));

const name = z
  .string()
  .trim()
  .min(2, "Please enter the full name")
  .max(80, "That name is too long");

export const SERVICE_SLUGS = [
  "career-counselling",
  "admission-guidance",
  "stream-selection",
  "psychometric-test",
  "study-abroad",
  "scholarship-help",
  "student-mentoring",
] as const;

export const SERVICE_LABELS: Record<(typeof SERVICE_SLUGS)[number], string> = {
  "career-counselling": "Career counselling",
  "admission-guidance": "Admission guidance",
  "stream-selection": "Stream & course selection",
  "psychometric-test": "Psychometric & aptitude testing",
  "study-abroad": "Study abroad guidance",
  "scholarship-help": "Scholarship assistance",
  "student-mentoring": "Student mentoring",
};

export const MODES = ["IN_PERSON", "VIDEO_CALL", "PHONE_CALL", "CHAT"] as const;

export const MODE_LABELS: Record<(typeof MODES)[number], string> = {
  IN_PERSON: "In person (Mumbai)",
  VIDEO_CALL: "Video call",
  PHONE_CALL: "Phone call",
  CHAT: "Chat",
};

export const QUALIFICATIONS = [
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Undergraduate",
  "Postgraduate",
  "Working professional",
  "Parent / Guardian",
  "Other",
] as const;

/** Sent as a `datetime-local` value; the API parses it into a real timestamp. */
const preferredSlot = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((value) => {
    if (!value) return true;
    const parsed = new Date(value);
    return !Number.isNaN(parsed.getTime());
  }, "Pick a valid date & time");

export const ENQUIRY_SOURCES = [
  "WEBSITE_HERO",
  "WEBSITE_FOOTER",
  "BOOKING_MODAL",
  "SERVICE_PAGE",
  "CONTACT_PAGE",
  "BLOG",
  "REFERRAL",
  "WHATSAPP",
  "INSTAGRAM",
  "GOOGLE",
  "OTHER",
] as const;

export type EnquirySource = (typeof ENQUIRY_SOURCES)[number];

export const enquiryFormSchema = z.object({
  name,
  /** Whose journey this is — lets one form serve students and parents. */
  whoFor: z.enum(["SELF", "CHILD", "STUDENT"]).default("SELF"),
  phone,
  email,
  city: z.string().trim().min(2, "Which city are you in?").max(60),
  qualification: z.enum(QUALIFICATIONS, { errorMap: () => ({ message: "Select the closest option" }) }),
  service: z.enum(SERVICE_SLUGS, { errorMap: () => ({ message: "Choose the guidance you need" }) }),
  mode: z.enum(MODES).default("VIDEO_CALL"),
  preferredSlot,
  message: z.string().trim().max(1200, "Please keep it under 1200 characters").optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the privacy terms" }) }),
});

export const quickEnquirySchema = z.object({
  name,
  phone,
  email: optionalEmail,
  service: z.enum(SERVICE_SLUGS).default("career-counselling"),
  message: z.string().trim().max(600).optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the privacy terms" }) }),
});

export const contactFormSchema = z.object({
  name,
  email,
  phone,
  subject: z.string().trim().min(3, "Add a subject").max(140),
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the privacy terms" }) }),
});

export type EnquiryFormValues = z.input<typeof enquiryFormSchema>;
export type QuickEnquiryValues = z.input<typeof quickEnquirySchema>;
export type ContactFormValues = z.input<typeof contactFormSchema>;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];