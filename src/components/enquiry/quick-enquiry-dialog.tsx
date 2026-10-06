"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, MessageCircle, PhoneCall, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox, FieldError, FormBanner, Honeypot, Input, Label, Select, Textarea } from "@/components/ui/form";
import { ModalShell, useQuickEnquiry } from "./quick-enquiry-context";
import { quickEnquirySchema, SERVICE_LABELS, SERVICE_SLUGS, type QuickEnquiryValues } from "@/lib/validation";
import { submitPublicForm } from "@/lib/enquiry-client";
import { site } from "@/lib/site";
import { formatPhone } from "@/lib/utils";

type Values = QuickEnquiryValues;

/** Phone-first modal: name, number, done. Reached from every "Book a call" CTA. */
export function QuickEnquiryDialog() {
  const { isOpen, close, service } = useQuickEnquiry();
  const [status, setStatus] = React.useState<"idle" | "submitting" | "done">("idle");
  const [banner, setBanner] = React.useState<string | null>(null);
  const [honeypot, setHoneypot] = React.useState("");

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

  React.useEffect(() => {
    if (isOpen) {
      setValue("service", (service as Values["service"]) ?? "career-counselling");
      setStatus("idle");
      setBanner(null);
    }
  }, [isOpen, service, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    setBanner(null);

    const source = window.sessionStorage.getItem("cg:quick-source") ?? "WEBSITE_HERO";
    const result = await submitPublicForm({
      endpoint: "/api/enquiries/quick",
      source,
      company: honeypot,
      payload: { ...values, email: values.email || undefined },
    });

    if (result.ok) {
      setStatus("done");
      reset({ service: "career-counselling", message: "", email: "" });
      return;
    }

    setStatus("idle");
    setBanner(result.error);
    for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
      setError(path as keyof Values, { message, type: "server" });
    }
  });

  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `Hi ${site.name}, I'd like to talk about career counselling.`,
  )}`;

  return (
    <ModalShell open={isOpen} onClose={close} label="Quick enquiry">
      {status === "done" ? (
        <div className="py-4 text-center">
          <span className="mx-auto mb-5 grid size-14 place-items-center rounded-pill bg-teal-500/12 text-teal-500">
            <CheckCircle2 className="size-7" aria-hidden />
          </span>
          <h3 className="text-2xl">Got it — we will call you shortly</h3>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">
            A counsellor will call you within one working day. In a hurry? WhatsApp us and we will pick up faster.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="whatsapp" size="lg">
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden /> WhatsApp now
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" onClick={close}>
              <a href={`tel:${site.phoneRaw}`}>
                <PhoneCall className="size-4" aria-hidden /> {formatPhone(site.phone)}
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="relative">
          <p className="text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">20-minute clarity call</p>
          <h3 className="mt-2 text-2xl leading-tight sm:text-[1.75rem]">Tell us where you are stuck</h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            Two fields is genuinely enough. A counsellor calls you back — no call-centre, no sales script.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <Label htmlFor="q-name">Your name</Label>
              <Input
                id="q-name"
                autoComplete="name"
                placeholder="Aarav Sharma"
                invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="q-phone" hint="WhatsApp preferred">
                  Phone
                </Label>
                <Input id="q-phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" invalid={!!errors.phone} {...register("phone")} />
                <FieldError>{errors.phone?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="q-email" hint="Optional">
                  Email
                </Label>
                <Input id="q-email" type="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} {...register("email")} />
                <FieldError>{errors.email?.message}</FieldError>
              </div>
            </div>

            <div>
              <Label htmlFor="q-service">What is this about?</Label>
              <Select id="q-service" invalid={!!errors.service} {...register("service")}>
                {SERVICE_SLUGS.map((slug) => (
                  <option key={slug} value={slug}>
                    {SERVICE_LABELS[slug]}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="q-message" hint="Optional">
                One line about it
              </Label>
              <Textarea
                id="q-message"
                rows={2}
                placeholder="Confused between engineering and design after Class 12."
                className="min-h-20"
                invalid={!!errors.message}
                {...register("message")}
              />
            </div>

            <Checkbox id="q-consent" checked={!!watch("consent")} onChange={(v) => setValue("consent", v as true, { shouldValidate: true })} invalid={!!errors.consent}>
              I agree to be contacted about this enquiry, per the{" "}
              <a href="/privacy" className="font-medium text-fg underline underline-offset-2">
                privacy policy
              </a>
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
          </div>
        </form>
      )}
    </ModalShell>
  );
}