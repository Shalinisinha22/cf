"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox, FieldError, FormBanner, Honeypot, Input, Label, Textarea } from "@/components/ui/form";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation";
import { submitPublicForm } from "@/lib/enquiry-client";

/** General message form — routed to the admin inbox, not the lead pipeline. */
export function ContactForm() {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "done">("idle");
  const [banner, setBanner] = React.useState<string | null>(null);
  const [honeypot, setHoneypot] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    setBanner(null);

    const result = await submitPublicForm({
      endpoint: "/api/enquiries/contact",
      source: "CONTACT_PAGE",
      company: honeypot,
      payload: values,
    });

    if (result.ok) {
      setStatus("done");
      return;
    }

    setStatus("idle");
    setBanner(result.error);
    for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
      setError(path as keyof ContactFormValues, { message, type: "server" });
    }
  });

  if (status === "done") {
    return (
      <div className="rounded-xl border border-teal-500/25 bg-bg-elevated p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-pill bg-teal-500/12 text-teal-500">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h3 className="mt-5 text-2xl">Message sent</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-fg-muted">
          Thank you — we reply to general messages within two working days.
        </p>
        <Button variant="outline" size="md" className="mt-6" onClick={() => { reset(); setStatus("idle"); }}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative rounded-xl border border-line bg-bg-elevated p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input id="c-name" autoComplete="name" placeholder="Your name" invalid={!!errors.name} {...register("name")} />
            <FieldError>{errors.name?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="c-email">Email</Label>
            <Input id="c-email" type="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} {...register("email")} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="c-phone">
              Phone
            </Label>
            <Input id="c-phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" invalid={!!errors.phone} {...register("phone")} />
            <FieldError>{errors.phone?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="c-subject">Subject</Label>
            <Input id="c-subject" placeholder="Workshop for Class 10" invalid={!!errors.subject} {...register("subject")} />
            <FieldError>{errors.subject?.message}</FieldError>
          </div>
        </div>

        <div>
          <Label htmlFor="c-message">Message</Label>
          <Textarea id="c-message" rows={6} placeholder="Tell us what you need…" invalid={!!errors.message} {...register("message")} />
          <FieldError>{errors.message?.message}</FieldError>
        </div>

        <Checkbox id="c-consent" checked={!!watch("consent")} onChange={(v) => setValue("consent", v as true, { shouldValidate: true })} invalid={!!errors.consent}>
          I agree to be contacted about this message.
        </Checkbox>
        <FieldError>{errors.consent?.message}</FieldError>

        <FormBanner>{banner}</FormBanner>
        <Honeypot value={honeypot} onChange={setHoneypot} />

        <Button type="submit" variant="primary" size="lg" disabled={status === "submitting"} className="sm:self-start">
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden /> Send message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}