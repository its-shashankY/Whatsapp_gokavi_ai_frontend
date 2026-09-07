import { cn } from "@/lib/utils";
import type { PriorityLevel } from "@/types";
import { Icon } from "./Icon";

const PRIORITY_STYLES: Record<PriorityLevel, string> = {
  critical: "bg-error text-on-error",
  urgent: "bg-secondary text-on-secondary",
  standard: "bg-surface-container-high text-on-surface-variant",
};

const PRIORITY_LABEL: Record<PriorityLevel, string> = {
  critical: "Critical",
  urgent: "Urgent",
  standard: "Standard",
};

interface PriorityTagProps {
  priority: PriorityLevel;
  label?: string;
  className?: string;
}

export function PriorityTag({ priority, label, className }: PriorityTagProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1",
        PRIORITY_STYLES[priority],
        className,
      )}
    >
      {priority === "critical" && <Icon name="warning" className="!text-[14px]" filled />}
      {label ?? PRIORITY_LABEL[priority]}
    </span>
  );
}
