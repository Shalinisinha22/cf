"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox, FieldError, FormBanner, Honeypot, Input, Label, Select, Textarea } from "@/components/ui/form";
import { quickEnquirySchema, SERVICE_LABELS, SERVICE_SLUGS, type QuickEnquiryValues } from "@/lib/validation";
import { submitPublicForm } from "@/lib/enquiry-client";

type Values = QuickEnquiryValues;

/**
 * Compact single-step enquiry card for the homepage hero.
 * Same `/api/enquiries/quick` contract as the modal, but inline so the
 * primary conversion path never leaves the page.
 */
export function HeroEnquiryForm() {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "done">("idle");
  const [banner, setBanner] = React.useState<string | null>(null);
  const [honeypot, setHoneypot] = React.useState("");
  const [refId, setRefId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(quickEnquirySchema),
    mode: "onBlur",
    defaultValues: { service: "career-counselling", message: "", email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    setBanner(null);

    const result = await submitPublicForm<{ refId?: string }>({
      endpoint: "/api/enquiries/quick",
      source: "WEBSITE_HERO",
      company: honeypot,
      payload: { ...values, email: values.email || undefined },
    });

    if (result.ok) {
      setRefId(result.data?.refId ?? null);
      setStatus("done");
      return;
    }

    setStatus("idle");
    setBanner(result.error);
    for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
      setError(path as keyof Values, { message, type: "server" });
    }
  });

  if (status === "done") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-teal-500/25 bg-bg-elevated p-7 text-center shadow-lift sm:p-9">
        <span className="mx-auto grid size-14 place-items-center rounded-pill bg-teal-500/12 text-teal-500">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h3 className="mt-5 text-2xl">We will call you shortly</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">
          A counsellor reads every enquiry personally and calls within one working day.
        </p>
        {refId ? (
          <div className="mx-auto mt-6 inline-flex flex-col items-center rounded-lg border border-gold-500/30 bg-gold-500/8 px-6 py-3">
            <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-gold-700 uppercase dark:text-gold-300">Reference</span>
            <span className="mt-1 font-display text-xl tracking-wide">{refId}</span>
          </div>
        ) : null}
        <div className="mt-7 flex flex-col gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/colleges">
              Browse colleges meanwhile <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              reset();
              setStatus("idle");
              setRefId(null);
            }}
          >
            Send another enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-bg-elevated shadow-lift">
      <div className="border-b border-line px-6 pt-6 pb-5 sm:px-8">
        <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-gold-600 uppercase">Free 20-minute clarity call</p>
        <h2 className="mt-2 text-2xl leading-tight">Tell us where you are stuck</h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Two fields is enough. A counsellor calls you back — no call-centre, no sales script.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-4 px-6 py-6 sm:px-8 sm:py-7">
        <div>
          <Label htmlFor="hero-name">Your name</Label>
          <Input id="hero-name" autoComplete="name" placeholder="Aarav Sharma" invalid={!!errors.name} {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="hero-phone" hint="WhatsApp preferred">Phone</Label>
          <Input id="hero-phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" invalid={!!errors.phone} {...register("phone")} />
          <FieldError>{errors.phone?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="hero-service">What do you need help with?</Label>
          <Select id="hero-service" invalid={!!errors.service} {...register("service")}>
            {SERVICE_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {SERVICE_LABELS[slug]}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="hero-message" hint="Optional">One line about it</Label>
          <Textarea
            id="hero-message"
            rows={2}
            placeholder="Confused between engineering and design after Class 12."
            className="min-h-18"
            invalid={!!errors.message}
            {...register("message")}
          />
        </div>

        <Checkbox
          id="hero-consent"
          checked={!!watch("consent")}
          onChange={(v) => setValue("consent", v as true, { shouldValidate: true })}
          invalid={!!errors.consent}
        >
          I agree to be contacted about this enquiry, per the{" "}
          <Link href="/privacy" className="font-medium text-fg underline underline-offset-2">
            privacy policy
          </Link>
          .
        </Checkbox>
        <FieldError>{errors.consent?.message}</FieldError>

        <FormBanner>{banner}</FormBanner>
        <Honeypot value={honeypot} onChange={setHoneypot} />

        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              <PhoneCall className="size-4" aria-hidden /> Request my callback
            </>
          )}
        </Button>

        <AnimatePresence>
          {status === "submitting" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-fg-muted"
            >
              Usually answered within a few minutes during working hours.
            </motion.div>
          ) : null}
        </AnimatePresence>
      </form>
    </div>
  );
}
