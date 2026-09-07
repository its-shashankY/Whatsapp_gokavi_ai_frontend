import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/types";
import { LEAD_STATUS_LABEL } from "@/lib/mockData";

// Each lead status gets its own fixed color pairing so the tag stays
// recognizable at a glance across Inbox, Patient Detail and Escalation Queue.
const STATUS_STYLES: Record<LeadStatus, string> = {
  cold_lead: "bg-gray-200 text-gray-700",
  warm_lead: "bg-orange-100 text-orange-800",
  booked: "bg-green-100 text-green-800",
  existing_patient: "bg-blue-100 text-blue-800",
  dormant: "bg-slate-100 text-slate-500 border border-dashed border-slate-300",
};

interface StatusTagProps {
  status: LeadStatus;
  className?: string;
}

export function StatusTag({ status, className }: StatusTagProps) {
  return (
    <span
      className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap",
        STATUS_STYLES[status],
        className,
      )}
    >
      {LEAD_STATUS_LABEL[status]}
    </span>
  );
}
