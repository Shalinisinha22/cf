"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox, FieldError, FormBanner, Honeypot, Input, Label, Select, Textarea } from "@/components/ui/form";
import { Container } from "@/components/ui/primitives";
import {
  enquiryFormSchema,
  MODE_LABELS,
  MODES,
  QUALIFICATIONS,
  SERVICE_LABELS,
  SERVICE_SLUGS,
  type EnquiryFormValues,
} from "@/lib/validation";
import { submitPublicForm } from "@/lib/enquiry-client";
import { cn, formatPhone } from "@/lib/utils";

type Values = EnquiryFormValues;

const STEPS = [
  { id: 0, title: "About you", hint: "Who we are speaking with" },
  { id: 1, title: "Your situation", hint: "Where the decision sits" },
  { id: 2, title: "The question", hint: "Anything we should know first" },
] as const;

/**
 * Full enquiry form — the primary conversion path.
 * Posts to `POST /api/enquiries` and surfaces the human reference ID on success.
 */
export function EnquiryForm({ defaultService, source = "WEBSITE_HERO" }: { defaultService?: string; source?: string }) {
  const [step, setStep] = React.useState(0);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "done">("idle");
  const [banner, setBanner] = React.useState<string | null>(null);
  const [honeypot, setHoneypot] = React.useState("");
  const [refId, setRefId] = React.useState<string | null>(null);
  const topRef = React.useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(enquiryFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      whoFor: "SELF",
      phone: "",
      email: "",
      city: "",
      qualification: undefined,
      service: (defaultService as Values["service"]) ?? "career-counselling",
      mode: "VIDEO_CALL",
      preferredSlot: "",
      message: "",
    },
  });

  const whoFor = watch("whoFor");

  const stepFields: (keyof Values)[][] = [
    ["name", "whoFor", "phone", "email"],
    ["city", "qualification", "service", "mode", "preferredSlot"],
    ["message", "consent"],
  ];

  const goNext = async () => {
    const valid = await trigger(stepFields[step] as never, { shouldFocus: true });
    if (!valid) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    setBanner(null);

    const result = await submitPublicForm<{ refId: string }>({
      endpoint: "/api/enquiries",
      source,
      company: honeypot,
      payload: {
        ...values,
        // datetime-local has no timezone; convert against the visitor's clock so the
        // API stores the slot they actually meant.
        preferredSlot: values.preferredSlot ? new Date(values.preferredSlot).toISOString() : undefined,
        // The API has no dedicated field for this, so keep it inside the message.
        message:
          values.whoFor === "SELF"
            ? values.message
            : `This enquiry is about ${values.whoFor === "CHILD" ? "my child" : "a student I support"}.\n\n${values.message}`.trim(),
      },
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
    // Jump back to the step that owns the first failing field.
    const firstBad = Object.keys(result.fieldErrors ?? {})[0];
    const owning = stepFields.findIndex((fields) => fields.includes(firstBad as keyof Values));
    if (owning >= 0) setStep(owning);
  });

  const progress = status === "done" ? 100 : ((step + 1) / STEPS.length) * 100;

  if (status === "done") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-teal-500/25 bg-bg-elevated p-8 text-center shadow-lift sm:p-12">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full opacity-25 blur-[90px]"
          style={{ background: "radial-gradient(circle, var(--teal-500), transparent 70%)" }}
          aria-hidden
        />
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative mx-auto grid size-16 place-items-center rounded-pill bg-teal-500/12 text-teal-500"
        >
          <CheckCircle2 className="size-8" aria-hidden />
        </motion.span>

        <h3 className="relative mt-6 text-3xl">Enquiry received</h3>
        <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
          A counsellor will read this personally and call you within one working day. If it is urgent, WhatsApp us and quote
          your reference.
        </p>

        {refId ? (
          <div className="relative mx-auto mt-7 inline-flex flex-col items-center rounded-lg border border-gold-500/30 bg-gold-500/8 px-8 py-4">
            <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-gold-700 uppercase dark:text-gold-300">Your reference</span>
            <span className="mt-1 font-display text-2xl tracking-wide">{refId}</span>
          </div>
        ) : null}

        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="primary" size="lg">
            <Link href="/thank-you">
              <Sparkles className="size-4" aria-hidden /> Book a time that suits you
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              reset();
              setStep(0);
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
    <div ref={topRef} className="relative overflow-hidden rounded-xl border border-line bg-bg-elevated shadow-lift">
      {/* progress rail */}
      <div className="border-b border-line px-6 pt-7 pb-6 sm:px-9">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={cn(
                  "flex items-center gap-2.5 text-left text-sm transition-colors",
                  i <= step ? "text-fg" : "text-fg-muted/60",
                  i < step && "cursor-pointer hover:text-gold-700 dark:hover:text-gold-300",
                )}
              >
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-pill border text-xs font-medium transition-all duration-500",
                    i < step && "border-teal-500 bg-teal-500 text-white",
                    i === step && "border-gold-500 bg-gold-500 text-ink-950",
                    i > step && "border-line-strong",
                  )}
                >
                  {i < step ? <CheckCircle2 className="size-4" aria-hidden /> : i + 1}
                </span>
                <span className="hidden sm:block">
                  <span className="block text-[0.8rem] font-medium">{s.title}</span>
                  <span className="block text-[0.7rem] text-fg-muted">{s.hint}</span>
                </span>
              </button>
              {i < STEPS.length - 1 ? <span className="h-px flex-1 bg-line-strong" aria-hidden /> : null}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-5 h-1 w-full overflow-hidden rounded-pill bg-line">
          <motion.div className="h-full rounded-pill bg-linear-to-r from-gold-500 to-teal-500" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="relative px-6 py-8 sm:px-9 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5"
          >
            {step === 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="e-name">Full name</Label>
                    <Input id="e-name" autoComplete="name" placeholder="Aarav Sharma" invalid={!!errors.name} {...register("name")} />
                    <FieldError>{errors.name?.message}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="e-who">This enquiry is for</Label>
                    <Select id="e-who" {...register("whoFor")}>
                      <option value="SELF">Myself</option>
                      <option value="CHILD">My child</option>
                      <option value="STUDENT">A student I support</option>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="e-phone" hint={whoFor === "SELF" ? "Your number" : "Parent / guardian number"}>
                      Phone
                    </Label>
                    <Input id="e-phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" invalid={!!errors.phone} {...register("phone")} />
                    <FieldError>{errors.phone?.message}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="e-email" hint="Optional but useful">
                      Email
                    </Label>
                    <Input id="e-email" type="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} {...register("email")} />
                    <FieldError>{errors.email?.message}</FieldError>
                  </div>
                </div>

                <p className="rounded-md bg-fg/4 px-4 py-3 text-xs leading-relaxed text-fg-muted">
                  We use your number only to arrange counselling. No marketing lists, no data reselling — see the{" "}
                  <Link href="/privacy" className="underline underline-offset-2 hover:text-fg">
                    privacy policy
                  </Link>
                  .
                </p>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="e-service">What do you need help with?</Label>
                    <Select id="e-service" invalid={!!errors.service} {...register("service")}>
                      {SERVICE_SLUGS.map((slug) => (
                        <option key={slug} value={slug}>
                          {SERVICE_LABELS[slug]}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="e-city">City</Label>
                    <Input id="e-city" autoComplete="address-level2" placeholder="Pune" invalid={!!errors.city} {...register("city")} />
                    <FieldError>{errors.city?.message}</FieldError>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="e-qual">Currently studying</Label>
                    <Select id="e-qual" invalid={!!errors.qualification} {...register("qualification")}>
                      <option value="">Select…</option>
                      {QUALIFICATIONS.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </Select>
                    <FieldError>{errors.qualification?.message}</FieldError>
                  </div>
                  <div>
                    <Label htmlFor="e-mode">Preferred mode</Label>
                    <Select id="e-mode" {...register("mode")}>
                      {MODES.map((mode) => (
                        <option key={mode} value={mode}>
                          {MODE_LABELS[mode]}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="e-slot" hint="Optional">
                    Preferred date &amp; time
                  </Label>
                  <Input id="e-slot" type="datetime-local" invalid={!!errors.preferredSlot} {...register("preferredSlot")} />
                  <FieldError>{errors.preferredSlot?.message}</FieldError>
                  <p className="mt-2 text-xs text-fg-muted">Working hours are Mon–Sat, 9 AM – 8 PM IST. We confirm or suggest a nearby slot.</p>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div>
                  <Label htmlFor="e-message" hint={`${watch("message")?.length ?? 0}/1200`}>
                    What is the decision you are stuck on?
                  </Label>
                  <Textarea
                    id="e-message"
                    rows={6}
                    placeholder="My son is in Class 11 and torn between BBA and B.Com. He is good at design but the family wants engineering…"
                    invalid={!!errors.message}
                    {...register("message")}
                  />
                  <FieldError>{errors.message?.message}</FieldError>
                </div>

                <Checkbox
                  id="e-consent"
                  checked={!!watch("consent")}
                  onChange={(v) => setValue("consent", v as true, { shouldValidate: true })}
                  invalid={!!errors.consent}
                >
                  I agree to Counsel &amp; Guide contacting me about this enquiry, per the{" "}
                  <Link href="/privacy" className="font-medium text-fg underline underline-offset-2">
                    privacy policy
                  </Link>
                  .
                </Checkbox>
                <FieldError>{errors.consent?.message}</FieldError>

                <FormBanner>{banner}</FormBanner>

                <Honeypot value={honeypot} onChange={setHoneypot} />
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
          <Button type="button" variant="ghost" size="lg" onClick={goBack} disabled={step === 0 || status === "submitting"} className={cn(step === 0 && "invisible")}>
            <ArrowLeft className="size-4" aria-hidden /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" variant="primary" size="lg" onClick={goNext}>
              Continue <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button type="submit" variant="gold" size="lg" disabled={status === "submitting"}>
              {status === "submitting" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
                </>
              ) : (
                <>
                  Send my enquiry <ArrowRight className="size-4" aria-hidden />
                </>
              )}
            </Button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-fg-muted">
          Prefer to talk? Call {formatPhone("+919876543210")} — someone answers.
        </p>
      </form>
    </div>
  );
}

/** Page-level wrapper with the reassurance panel beside the form. */
export function EnquirySection({
  defaultService,
  source,
  reassurance,
}: {
  defaultService?: string;
  source?: string;
  reassurance?: React.ReactNode;
}) {
  return (
    <Container className="grid gap-10 lg:grid-cols-[1fr_0.62fr] lg:gap-14">
      <EnquiryForm defaultService={defaultService} source={source} />
      <aside className="lg:pt-4">{reassurance}</aside>
    </Container>
  );
}