"use client";

import { CalendarClock } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useQuickEnquiry } from "./quick-enquiry-context";

type Props = Omit<ButtonProps, "onClick" | "children"> & {
  label?: string;
  service?: string;
  source?: string;
};

/** Any "Book a call" CTA on the page — opens the quick-enquiry modal. */
export function QuickEnquiryButton({ label = "Book a free call", service, source, variant, size, className, ...rest }: Props) {
  const { open } = useQuickEnquiry();
  return (
    <Button
      {...rest}
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        if (source) window.sessionStorage.setItem("cg:quick-source", source);
        open(service);
      }}
    >
      {label}
      {!className?.includes("gap-0") ? <CalendarClock className="size-4" aria-hidden /> : null}
    </Button>
  );
}