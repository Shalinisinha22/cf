"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type QuickEnquiryContextValue = {
  open: (service?: string) => void;
  close: () => void;
  isOpen: boolean;
  /** Service slug the modal should preselect, when opened from a service card. */
  service?: string;
};

const QuickEnquiryContext = React.createContext<QuickEnquiryContextValue | null>(null);

/**
 * Makes the "quick enquiry" modal reachable from anywhere on the page without
 * prop-drilling: any button can call `useQuickEnquiry().open()`.
 */
export function QuickEnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [service, setService] = React.useState<string | undefined>(undefined);

  const value = React.useMemo<QuickEnquiryContextValue>(
    () => ({
      isOpen,
      service,
      open: (nextService?: string) => {
        setService(nextService);
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
    }),
    [isOpen, service],
  );

  return <QuickEnquiryContext.Provider value={value}>{children}</QuickEnquiryContext.Provider>;
}

export function useQuickEnquiry(): QuickEnquiryContextValue {
  const ctx = React.useContext(QuickEnquiryContext);
  if (!ctx) throw new Error("useQuickEnquiry must be used inside <QuickEnquiryProvider>");
  return ctx;
}

/** Button that opens the modal with the right source attribution. */
export function useEnquiryTriggers() {
  const { open } = useQuickEnquiry();
  return {
    openQuickEnquiry: (source?: string, service?: string) => {
      if (source) window.sessionStorage.setItem("cg:quick-source", source);
      open(service);
    },
  };
}

export const revealVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export function ModalShell({
  open,
  onClose,
  children,
  label,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={label}>
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink-950/55 backdrop-blur-sm"
        initial={reduce ? undefined : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
      />
      <motion.div
        className={cn(
          "relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-line bg-bg-elevated p-6 shadow-[0_40px_90px_-30px_rgb(0_0_0/0.55)] sm:max-w-lg sm:rounded-3xl sm:p-8",
          className,
        )}
        initial={reduce ? undefined : { opacity: 0, y: 28, scale: 0.97 }}
        animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 grid size-9 place-items-center rounded-pill text-fg-muted transition-colors hover:bg-fg/8 hover:text-fg"
          aria-label="Close dialog"
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden>
            <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </motion.div>
    </div>
  );
}