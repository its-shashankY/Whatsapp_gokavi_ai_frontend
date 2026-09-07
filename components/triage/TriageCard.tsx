import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { TriageCase } from "@/types";

const PRIORITY_BADGE: Record<TriageCase["priority"], string> = {
  critical: "bg-error text-on-error",
  urgent: "bg-secondary text-on-secondary",
  standard: "bg-surface-container-high text-on-surface-variant",
};

export function TriageCard({ triageCase }: { triageCase: TriageCase }) {
  const critical = triageCase.priority === "critical";

  return (
    <article
      className={cn(
        "bg-surface-container-lowest rounded-xl ambient-shadow p-6 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1 duration-300",
        critical && "urgent-glow",
      )}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-error-container/40 rounded-bl-full -mr-4 -mt-4 z-0" />
      <div className="flex justify-between items-start mb-4 relative z-10 gap-2">
        <span
          className={cn(
            "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
            PRIORITY_BADGE[triageCase.priority],
          )}
        >
          {triageCase.levelLabel}
        </span>
        <div className="text-right flex-shrink-0">
          <div
            className={cn(
              "font-headline-md font-bold flex items-center gap-1 justify-end",
              critical ? "text-error animate-pulse" : "text-secondary",
            )}
          >
            <Icon name="timer" className="!text-lg" />
            {triageCase.waitTime}
          </div>
          <div className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Wait Time</div>
        </div>
      </div>

      <div className="mb-6 relative z-10 min-w-0">
        <h3 className="font-headline-md text-headline-md text-primary mb-1 break-words">
          {triageCase.patientName}
        </h3>
        <p className="text-on-surface-variant text-sm flex items-center gap-2 mb-3 flex-wrap">
          <Icon name="badge" className="!text-sm" /> ID: {triageCase.patientId}
          <span className="w-1 h-1 rounded-full bg-outline" />
          {triageCase.age} Yrs, {triageCase.sex}
        </p>
        <div
          className={cn(
            "p-3 bg-surface-container-low rounded-lg border-l-2",
            critical ? "border-error" : "border-secondary",
          )}
        >
          <p className="text-on-surface font-medium text-sm break-words">{triageCase.complaint}</p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 relative z-10">
        {triageCase.vitals.map((vital) => (
          <div key={vital.label} className="bg-surface p-2 rounded text-center border border-outline-variant/30">
            <div className="text-xs text-on-surface-variant mb-1">{vital.label}</div>
            <div className={cn("font-bold", critical ? "text-error" : "text-on-surface")}>{vital.value}</div>
          </div>
        ))}
      </div>

      <button
        className={cn(
          "w-full mt-4 font-button py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm relative z-10",
          critical
            ? "bg-error text-on-error hover:bg-error/90"
            : "bg-secondary text-on-secondary hover:opacity-90",
        )}
      >
        <Icon name="campaign" filled />
        Escalate to Attending
      </button>
    </article>
  );
}
