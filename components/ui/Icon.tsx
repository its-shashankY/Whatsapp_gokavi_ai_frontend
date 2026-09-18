import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  className?: string;
  filled?: boolean;
}

export function Icon({ name, className, filled, ...rest }: IconProps) {
  return (
    <span className={cn("material-symbols-outlined", filled && "fill", className)} {...rest}>
      {name}
    </span>
  );
}
