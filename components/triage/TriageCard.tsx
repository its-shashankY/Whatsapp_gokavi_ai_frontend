"use client";

import { useState } from "react";
import Link from "next/link";
import { cn, formatElapsedSince } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { PriorityTag } from "@/components/ui/PriorityTag";
import type { Escalation, EscalationTrigger } from "@/types";

const TRIGGER_LABEL: Record<EscalationTrigger, string> = {
  RED_FLAG_SYMPTOM: "Red-Flag Symptom",
  MISSED_CRITICAL_DOSE: "Missed Critical Dose",
  HUMAN_REQUEST: "Requested Human Help",
  SENTIMENT_DISTRESS: "Distress Signal",
  CYCLE_CANCELLATION: "Cycle Cancellation",
  NO_SHOW_PATTERN: "No-Show Pattern",
};

interface TriageCardProps {
  escalation: Escalation;
  onAck: (id: string) => Promise<void>;
  onResolve: (id: string) => Promise<void>;
}

export function TriageCard({ escalation, onAck, onResolve }: TriageCardProps) {
  const [busy, setBusy] = useState(false);
  const critical = escalation.severity === "CRITICAL";

  const runAction = async (action: (id: string) => Promise<void>) => {
    setBusy(true);
    try {
      await action(escalation.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article
      className={cn(
        "bg-surface-container-lowest rounded-xl ambient-shadow p-6 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1 duration-300",
        critical && "urgent-glow",
      )}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-error-container/40 rounded-bl-full -mr-4 -mt-4 z-0" />
      <div className="flex justify-between items-start mb-4 relative z-10 gap-2">
        <div className="flex flex-col gap-1">
          <PriorityTag severity={escalation.severity} />
          <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
            {TRIGGER_LABEL[escalation.triggerType]}
          </span>
        </div>
        <div className="text-right flex-shrink-0">
          <div
            className={cn(
              "font-headline-md font-bold flex items-center gap-1 justify-end",
              critical ? "text-error animate-pulse" : "text-secondary",
            )}
          >
            <Icon name="timer" className="!text-lg" />
            {formatElapsedSince(escalation.createdAt)}
          </div>
          <div className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Wait Time</div>
        </div>
      </div>

      <div className="mb-6 relative z-10 min-w-0">
        <Link
          href={`/patients/${escalation.patientId}`}
          className="font-headline-md text-headline-md text-primary mb-1 break-words hover:underline block"
        >
          {escalation.patientName ?? "Unknown Contact"}
        </Link>
        <p className="text-on-surface-variant text-sm flex items-center gap-2 mb-3 flex-wrap">
          <Icon name="call" className="!text-sm" /> {escalation.patientPhone}
          {escalation.afterHours && (
            <>
              <span className="w-1 h-1 rounded-full bg-outline" />
              <span className="text-secondary font-medium">After Hours</span>
            </>
          )}
        </p>
        <div
          className={cn(
            "p-3 bg-surface-container-low rounded-lg border-l-2",
            critical ? "border-error" : "border-secondary",
          )}
        >
          <p className="text-on-surface font-medium text-sm break-words">
            {escalation.sourceMessage ?? "No message details captured."}
          </p>
        </div>
      </div>

      <div className="mt-auto flex gap-3 relative z-10">
        {escalation.status === "OPEN" && (
          <button
            onClick={() => runAction(onAck)}
            disabled={busy}
            className="flex-1 font-button py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm border border-outline-variant text-on-surface hover:bg-surface-container-low disabled:opacity-50"
          >
            <Icon name="check_circle" />
            Acknowledge
          </button>
        )}
        <button
          onClick={() => runAction(onResolve)}
          disabled={busy}
          className={cn(
            "flex-1 font-button py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50",
            critical ? "bg-error text-on-error hover:bg-error/90" : "bg-secondary text-on-secondary hover:opacity-90",
          )}
        >
          <Icon name="task_alt" filled />
          Resolve
        </button>
      </div>
    </article>
  );
}
