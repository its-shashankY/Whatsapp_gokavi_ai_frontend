"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TriageCard } from "@/components/triage/TriageCard";
import { Icon } from "@/components/ui/Icon";
import { ackEscalation, listEscalations, resolveEscalation } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Escalation } from "@/types";

export default function TriagePage() {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    return listEscalations().then(setEscalations);
  }, []);

  useEffect(() => {
    if (!isDoctor) {
      setLoading(false);
      return;
    }
    refresh().finally(() => setLoading(false));
  }, [refresh, isDoctor]);

  const handleAck = useCallback(async (id: string) => {
    const updated = await ackEscalation(id);
    setEscalations((prev) => prev.map((e) => (e.id === id ? updated : e)));
  }, []);

  const handleResolve = useCallback(async (id: string) => {
    await resolveEscalation(id);
    setEscalations((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const critical = escalations.filter((e) => e.severity === "CRITICAL").length;
  const high = escalations.filter((e) => e.severity === "HIGH").length;

  if (!isDoctor) {
    return (
      <DashboardShell title="Gokavi Admin">
        <div className="max-w-xl mx-auto bg-surface-container-lowest rounded-xl p-10 border border-outline-variant/30 card-shadow flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center">
            <Icon name="lock_person" className="text-on-error-container !text-3xl" />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-primary mb-2">Doctor/Nurse Access Required</h2>
            <p className="text-on-surface-variant">
              The escalation queue surfaces red-flag symptoms and safety-critical WhatsApp messages — it's
              restricted to clinical staff. You&apos;re signed in as <strong>{user?.title}</strong>.
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Gokavi Admin" bare>
      <header className="px-container-padding-mobile md:px-container-padding-desktop py-8 md:py-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/20 bg-surface-lowest">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full font-label-caps text-label-caps flex items-center gap-1">
              <Icon name="warning" className="!text-[14px]" />
              LIVE QUEUE
            </span>
          </div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Triage Escalation
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Every WhatsApp conversation flagged by a red-flag symptom, a missed critical dose, an explicit
            request for a human, distress sentiment, or a cycle cancellation lands here.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/30 flex items-center gap-3">
            <span className="text-on-surface-variant text-sm">Critical:</span>
            <span className="text-error font-bold text-xl">{critical}</span>
          </div>
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/30 flex items-center gap-3">
            <span className="text-on-surface-variant text-sm">High:</span>
            <span className="text-secondary font-bold text-xl">{high}</span>
          </div>
        </div>
      </header>

      <div className="p-container-padding-mobile md:p-container-padding-desktop flex-1">
        {loading ? (
          <div className="text-center text-on-surface-variant py-20">Loading escalation queue...</div>
        ) : escalations.length === 0 ? (
          <div className="text-center text-on-surface-variant py-20">
            No open escalations right now — the queue is clear.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
            {escalations.map((escalation) => (
              <TriageCard
                key={escalation.id}
                escalation={escalation}
                onAck={handleAck}
                onResolve={handleResolve}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
