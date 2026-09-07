"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MedicationOrderForm } from "@/components/clinical/MedicationOrderForm";
import { LabUploadCard } from "@/components/clinical/LabUploadCard";
import { AuditLogCard } from "@/components/clinical/AuditLogCard";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth";
import { getAuditLog, getPatientDetail, listPatients } from "@/lib/api";
import type { AuditLogEntry, Patient } from "@/types";

export default function ClinicalContentPanelPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isDoctor) return;
    let cancelled = false;
    listPatients()
      .then((data) => {
        if (cancelled) return;
        setPatients(data);
        setSelectedId((current) => current ?? data[0]?.id ?? null);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isDoctor]);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    getPatientDetail(selectedId).then((data) => !cancelled && setPatient(data));
    getAuditLog(selectedId).then((data) => !cancelled && setAuditLog(data));
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  return (
    <DashboardShell title="Clinical Content Panel" searchPlaceholder="Search records (MRN)...">
      <div className="max-w-5xl mx-auto space-y-gutter">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-2 bg-surface-container-highest px-3 py-1 rounded-full text-sm font-label-caps text-label-caps text-on-surface-variant">
            <Icon name="lock" className="!text-[16px] text-error" />
            SECURE SESSION
          </span>
        </div>

        {!isDoctor ? (
          <div className="bg-surface-container-lowest rounded-xl p-10 border border-outline-variant/30 card-shadow flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center">
              <Icon name="lock_person" className="text-on-error-container !text-3xl" />
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-primary mb-2">Doctor Authorization Required</h2>
              <p className="text-on-surface-variant max-w-md">
                Medication orders and clinical records are restricted to authenticated doctor accounts.
                You&apos;re signed in as <strong>{user?.title}</strong>. Ask a doctor to sign in on this
                device to access this panel.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center text-on-surface-variant py-20">Loading patients...</div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <label className="font-label-caps text-label-caps text-primary" htmlFor="patient-select">
                Patient
              </label>
              <select
                id="patient-select"
                className="flex-1 max-w-sm bg-surface-container-lowest border border-outline-variant rounded-lg p-2 text-body-md"
                value={selectedId ?? ""}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name ?? "Unknown Contact"} ({p.phone})
                  </option>
                ))}
              </select>
            </div>

            {patient && (
              <>
                <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-secondary" />
                  <div className="flex items-center gap-4 pl-2 min-w-0">
                    <Avatar
                      name={patient.name ?? "?"}
                      size={64}
                      className="border-2 border-surface-container-lowest shadow-sm"
                    />
                    <div className="min-w-0">
                      <h3 className="font-headline-md text-headline-md text-primary truncate">
                        {patient.name ?? "Unknown Contact"}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant truncate">
                        {patient.age !== null ? `Age ${patient.age} • ` : ""}
                        MRN: {patient.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {patient.cycleLabel && (
                      <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-label-caps text-label-caps whitespace-nowrap">
                        {patient.cycleLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                  <div className="lg:col-span-2 space-y-stack-gap">
                    <MedicationOrderForm patientId={patient.id} />
                  </div>
                  <div className="space-y-stack-gap">
                    <LabUploadCard patientId={patient.id} />
                    <AuditLogCard entries={auditLog} />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}
