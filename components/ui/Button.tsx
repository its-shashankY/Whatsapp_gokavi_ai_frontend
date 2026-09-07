import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary shadow-[0_4px_14px_0_rgb(7,2,53,0.39)] hover:bg-primary-container hover:shadow-[0_6px_20px_rgb(7,2,53,0.23)]",
  secondary:
    "bg-secondary text-on-secondary shadow-[0_4px_14px_0_rgba(169,51,73,0.39)] hover:opacity-90",
  outline:
    "bg-surface-container-low text-primary border border-outline-variant hover:bg-surface-variant",
  ghost: "text-primary hover:bg-surface-container-low",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "font-button text-button rounded-lg px-4 py-2.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}
