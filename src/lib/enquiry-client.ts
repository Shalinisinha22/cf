"use client";

/**
 * Browser client for the public enquiry endpoints.
 * Captures UTM attribution and the bot honeypot, resolves a Turnstile token when
 * configured, then posts to the API and maps validation errors back to fields.
 *
 * Payload shape must match `api/src/validation/contracts.ts` — attribution fields
 * are flat (`utmSource`, not `utm: {}`) and the honeypot key is `company`.
 */

export const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type SubmitResult<T = unknown> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export type FieldError = { path: string; message: string };

const UTM_STORAGE_KEY = "cg:utm";

const UTM_FIELDS = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
} as const;

type Utm = Partial<Record<(typeof UTM_FIELDS)[keyof typeof UTM_FIELDS], string>>;

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Captures the current URL's UTM parameters once, then reuses them across pages. */
export function captureAttribution(): { utm: Utm; referrer: string; sourcePage: string } {
  const params = new URLSearchParams(window.location.search);

  let utm: Utm = {};
  try {
    const stored = readStored(UTM_STORAGE_KEY);
    if (stored) utm = JSON.parse(stored) as Utm;
  } catch {
    utm = {};
  }

  const incoming: Utm = {};
  for (const [queryKey, field] of Object.entries(UTM_FIELDS) as [keyof typeof UTM_FIELDS, Utm[keyof Utm]][]) {
    const value = params.get(queryKey);
    if (value) incoming[field as keyof Utm] = value.slice(0, 120);
  }
  if (Object.keys(incoming).length) {
    utm = { ...utm, ...incoming };
    try {
      window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    } catch {
      /* storage unavailable — attribution simply stays empty */
    }
  }

  return {
    utm,
    referrer: document.referrer.slice(0, 300),
    sourcePage: window.location.href.slice(0, 300),
  };
}

/** Turnstile tokens are only resolved when the site key is configured. */
async function turnstileToken(): Promise<string | undefined> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey || typeof window === "undefined") return undefined;

  const w = window as unknown as {
    turnstile?: { execute: (el: HTMLElement, opts: Record<string, unknown>) => Promise<string> };
  };

  await new Promise<void>((resolve) => {
    if (w.turnstile) return resolve();
    let tries = 0;
    const timer = window.setInterval(() => {
      if (w.turnstile || tries > 80) {
        window.clearInterval(timer);
        resolve();
      }
      tries += 1;
    }, 50);
  });

  if (!w.turnstile) return undefined;
  try {
    const holder = document.createElement("div");
    holder.style.position = "absolute";
    holder.style.left = "-9999px";
    document.body.appendChild(holder);
    const token = await w.turnstile.execute(holder, { sitekey: siteKey, action: "enquiry" });
    document.body.removeChild(holder);
    return token;
  } catch {
    return undefined;
  }
}

type SubmitOptions = {
  endpoint: string;
  payload: Record<string, unknown>;
  source: string;
  /** Populated by the bot honeypot; bots fill it, humans never see it. */
  company?: string;
};

export async function submitPublicForm<T = { refId: string }>({
  endpoint,
  payload,
  source,
  company,
}: SubmitOptions): Promise<SubmitResult<T>> {
  const attribution = captureAttribution();
  const token = await turnstileToken();

  const body = {
    ...payload,
    source,
    ...attribution.utm,
    referrer: attribution.referrer,
    sourcePage: attribution.sourcePage,
    company: company ?? "",
    ...(token ? { turnstileToken: token } : {}),
  };

  try {
    const res = await fetch(`${PUBLIC_API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    const json = (await res.json().catch(() => null)) as
      | {
          data?: T;
          message?: string;
          error?: { code?: string; message?: string; details?: { fields?: FieldError[] } };
        }
      | null;

    if (res.ok) {
      return { ok: true, data: (json?.data ?? ({} as T)) as T, message: json?.message };
    }

    const fields: Record<string, string> = {};
    for (const field of json?.error?.details?.fields ?? []) {
      if (!fields[field.path]) fields[field.path] = field.message;
    }

    return {
      ok: false,
      error: json?.error?.message ?? "Something went wrong. Please try again or call us directly.",
      fieldErrors: Object.keys(fields).length ? fields : undefined,
    };
  } catch {
    return {
      ok: false,
      error: "We could not reach the server. Please check your connection, or WhatsApp us instead.",
    };
  }
}