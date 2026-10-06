"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-md border border-line-strong bg-bg-elevated px-4 text-[0.95rem] text-fg placeholder:text-fg-muted/60 transition-all duration-200 outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/14 disabled:opacity-60";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, "h-12", invalid && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/14", className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, "min-h-32 py-3 leading-relaxed", invalid && "border-rose-500 focus:border-rose-500", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export function Label({ children, htmlFor, className, hint }: { children: React.ReactNode; htmlFor: string; className?: string; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-2 flex items-baseline justify-between gap-3 text-sm font-medium text-fg", className)}>
      <span>{children}</span>
      {hint ? <span className="text-xs font-normal text-fg-muted">{hint}</span> : null}
    </label>
  );
}

export function FieldError({ children, id }: { children?: React.ReactNode; id?: string }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-[0.8rem] text-rose-500">
      <AlertCircle className="size-3.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

export function FormBanner({ tone = "error", children }: { tone?: "error" | "success"; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div
      role="status"
      className={cn(
        "rounded-md border px-4 py-3 text-sm leading-relaxed",
        tone === "error" ? "border-rose-500/30 bg-rose-500/8 text-rose-600 dark:text-rose-400" : "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300",
      )}
    >
      {children}
    </div>
  );
}

/** Native select styled to match Input, with a chevron affordance. */
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(
  ({ className, invalid, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(fieldBase, "h-12 appearance-none pr-10", invalid && "border-rose-500", className)}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fg-muted"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden
      >
        <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ),
);
Select.displayName = "Select";

export function Checkbox({
  id,
  checked,
  onChange,
  children,
  invalid,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  invalid?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-fg-muted">
      <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
          aria-invalid={invalid || undefined}
        />
        <span
          className={cn(
            "size-5 rounded-[7px] border transition-all duration-200 peer-focus-visible:ring-4 peer-focus-visible:ring-gold-500/25",
            checked ? "border-gold-500 bg-gold-500" : invalid ? "border-rose-500 bg-transparent" : "border-line-strong bg-bg-elevated",
          )}
        />
        {checked ? (
          <svg className="pointer-events-none absolute size-3.5 text-ink-950" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="m5 10.5 3.2 3.2L15 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      <span className="leading-relaxed">{children}</span>
    </label>
  );
}

/** Honeypot: hidden from humans, irresistible to bots. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}