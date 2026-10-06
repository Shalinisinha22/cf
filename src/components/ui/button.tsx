import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-55 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-ink-900 text-ivory-100 shadow-[0_10px_30px_-12px_rgb(11_18_32/0.55)] hover:bg-ink-800 hover:shadow-[0_18px_40px_-14px_rgb(11_18_32/0.6)] active:translate-y-px",
        gold: "bg-gold-500 text-ink-950 shadow-[0_10px_30px_-12px_rgb(201_162_75/0.75)] hover:bg-gold-400 hover:shadow-[0_18px_44px_-14px_rgb(201_162_75/0.85)] active:translate-y-px",
        outline: "border border-line-strong text-fg hover:border-fg/40 hover:bg-fg/5 active:translate-y-px",
        ghost: "text-fg hover:bg-fg/6",
        teal: "bg-teal-500 text-white shadow-[0_10px_30px_-12px_rgb(47_127_122/0.7)] hover:bg-teal-600 active:translate-y-px",
        light: "bg-ivory-100 text-ink-900 hover:bg-white shadow-[0_10px_30px_-14px_rgb(0_0_0/0.5)]",
        whatsapp: "bg-[#1FA855] text-white hover:bg-[#17924a] shadow-[0_10px_30px_-14px_rgb(31_168_85/0.8)]",
      },
      size: {
        sm: "h-9 rounded-pill px-4 text-sm",
        md: "h-11 rounded-pill px-6 text-sm",
        lg: "h-13 rounded-pill px-8 text-[0.975rem]",
        xl: "h-14 rounded-pill px-9 text-base",
        icon: "size-10 rounded-pill",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };