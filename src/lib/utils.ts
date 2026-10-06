import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 98765 43210 → +91 98765 43210 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits.startsWith("+") || digits.length < 12) return phone;
  const rest = digits.slice(2);
  return `+${digits.slice(1, 3)} ${rest.slice(0, 5)} ${rest.slice(5, 10)}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** "2 hours ago", "3 days ago" — used in review/activity timelines. */
export function relativeTime(iso: string | Date): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDate(iso: string | Date): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}