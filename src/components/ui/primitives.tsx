import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container-page", className)} {...props}>
      {children}
    </div>
  );
}

export function Section({
  className,
  children,
  tone = "base",
  id,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  tone?: "base" | "subtle" | "ink" | "elevated";
  id?: string;
}) {
  const tones = {
    base: "bg-bg",
    subtle: "bg-bg-subtle",
    ink: "bg-ink-950 text-ivory-100",
    elevated: "bg-bg-elevated",
  } as const;
  return (
    <section id={id} className={cn("relative py-20 sm:py-24 lg:py-32", tones[tone], className)} {...props}>
      {children}
    </section>
  );
}

/** Small gold label that sits above a section heading. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.22em] text-gold-600 uppercase", className)}>
      <span className="h-px w-8 bg-linear-to-r from-gold-500 to-transparent" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className={cn("text-3xl leading-[1.08] sm:text-4xl lg:text-[3.25rem]", titleClassName)}>{title}</h2>
      {description ? (
        <p className={cn("max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "gold" | "teal" | "outline";
}) {
  const tones = {
    neutral: "bg-fg/8 text-fg-muted",
    gold: "bg-gold-500/14 text-gold-700 dark:text-gold-300",
    teal: "bg-teal-500/14 text-teal-700 dark:text-teal-300",
    outline: "border border-line-strong text-fg-muted",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}