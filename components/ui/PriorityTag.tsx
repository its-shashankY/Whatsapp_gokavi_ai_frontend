import { cn } from "@/lib/utils";
import type { EscalationSeverity } from "@/types";
import { Icon } from "./Icon";

const SEVERITY_STYLES: Record<EscalationSeverity, string> = {
  CRITICAL: "bg-error text-on-error",
  HIGH: "bg-secondary text-on-secondary",
  NORMAL: "bg-surface-container-high text-on-surface-variant",
};

interface PriorityTagProps {
  severity: EscalationSeverity;
  label?: string;
  className?: string;
}

export function PriorityTag({ severity, label, className }: PriorityTagProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1",
        SEVERITY_STYLES[severity],
        className,
      )}
    >
      {severity === "CRITICAL" && <Icon name="warning" className="!text-[14px]" filled />}
      {label ?? severity}
    </span>
  );
}
