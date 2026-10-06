import { cn } from "@/lib/utils";

/** Monogram mark: an ink diamond holding a gold compass needle. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden fill="none">
      <rect x="1" y="1" width="38" height="38" rx="11" fill="currentColor" className="text-ink-900" />
      <path d="M13 27.5 20 12l7 15.5-7-3.6-7 3.6Z" fill="currentColor" className="text-gold-500" />
      <circle cx="20" cy="29.6" r="1.9" fill="currentColor" className="text-gold-300" />
    </svg>
  );
}

export function Wordmark({ className, tone = "default" }: { className?: string; tone?: "default" | "inverse" }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Logo />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-lg font-medium", tone === "inverse" && "text-ivory-100")}>Counsel &amp; Guide</span>
        <span className={cn("mt-1 text-[0.6rem] font-semibold tracking-[0.22em] uppercase", tone === "inverse" ? "text-ivory-300" : "text-fg-muted")}>
          Career Advisory
        </span>
      </span>
    </span>
  );
}