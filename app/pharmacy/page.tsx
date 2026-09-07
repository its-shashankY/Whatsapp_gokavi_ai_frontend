"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { MedicationOrderForm } from "@/components/clinical/MedicationOrderForm";
import { LabUploadCard } from "@/components/clinical/LabUploadCard";
import { AuditLogCard } from "@/components/clinical/AuditLogCard";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth";
import { auditLog, clinicalPatient } from "@/lib/mockData";

export default function ClinicalContentPanelPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";

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
                You&apos;re signed in as <strong>{user?.title ?? "Receptionist"}</strong>. Ask a doctor to
                sign in on this device to access this panel.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-secondary" />
              <div className="flex items-center gap-4 pl-2 min-w-0">
                <Avatar
                  name={clinicalPatient.name}
                  size={64}
                  className="border-2 border-surface-container-lowest shadow-sm"
                />
                <div className="min-w-0">
                  <h3 className="font-headline-md text-headline-md text-primary truncate">
                    {clinicalPatient.name}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant truncate">
                    DOB: {clinicalPatient.dob} • MRN: {clinicalPatient.mrn}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-label-caps text-label-caps whitespace-nowrap">
                  {clinicalPatient.cycleDay}
                </span>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-label-caps text-label-caps whitespace-nowrap">
                  {clinicalPatient.allergies}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
              <div className="lg:col-span-2 space-y-stack-gap">
                <MedicationOrderForm />
              </div>
              <div className="space-y-stack-gap">
                <LabUploadCard />
                <AuditLogCard entries={auditLog} />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
