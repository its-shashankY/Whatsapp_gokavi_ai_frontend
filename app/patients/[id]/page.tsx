"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { ConsentStatusCard } from "@/components/patient/ConsentStatusCard";
import { CycleProgressCard } from "@/components/patient/CycleProgressCard";
import { MedicationsCard } from "@/components/patient/MedicationsCard";
import { ReportsCard } from "@/components/patient/ReportsCard";
import { DiseaseCard } from "@/components/patient/DiseaseCard";
import { PatientCommsPanel } from "@/components/patient/PatientCommsPanel";
import { ApiError, getConversationThread, getPatientDetail, sendMessage, sendVoiceNote } from "@/lib/api";
import type { Message, Patient } from "@/types";

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingThread, setLoadingThread] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getPatientDetail(id)
      .then((data) => !cancelled && setPatient(data))
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      })
      .finally(() => !cancelled && setLoadingPatient(false));

    getConversationThread(id)
      .then((data) => !cancelled && setMessages(data))
      .catch(() => {
        // No conversation history for this patient yet — thread just stays empty.
      })
      .finally(() => !cancelled && setLoadingThread(false));

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSend = useCallback(
    async (text: string) => {
      const message = await sendMessage(id, text);
      setMessages((prev) => [...prev, message]);
    },
    [id],
  );

  const handleSendVoiceNote = useCallback(
    async (blob: Blob) => {
      const message = await sendVoiceNote(id, blob);
      setMessages((prev) => [...prev, message]);
    },
    [id],
  );

  const backLink = (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-1 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
    >
      <Icon name="arrow_back" className="!text-[18px]" />
      Back to Patient Records
    </button>
  );

  if (notFound) {
    return (
      <DashboardShell title="Gokavi Admin">
        <div className="flex flex-col gap-4 h-full">
          {backLink}
          <div className="flex items-center justify-center flex-1 text-on-surface-variant">
            Patient not found.
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (loadingPatient || !patient) {
    return (
      <DashboardShell title="Gokavi Admin">
        <div className="flex flex-col gap-4 h-full">
          {backLink}
          <div className="flex items-center justify-center flex-1 text-on-surface-variant">
            Loading patient...
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Gokavi Admin" searchPlaceholder="Search patients, records...">
      <div className="flex flex-col gap-stack-gap">
        {backLink}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8 flex flex-col gap-stack-gap">
            <PatientHeader patient={patient} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-gap">
              <ConsentStatusCard consents={patient.consents} />
              {patient.cycle && <CycleProgressCard steps={patient.cycle} />}
            </div>
            {patient.medications && <MedicationsCard medications={patient.medications} />}
            {patient.hasReports && <ReportsCard reports={patient.reports ?? []} />}
            {patient.hasDiseaseMentioned && patient.detectedCondition && (
              <DiseaseCard condition={patient.detectedCondition} evidence={patient.conditionEvidence} />
            )}
          </div>
          <PatientCommsPanel
            patientName={patient.name ?? "Unknown Contact"}
            messages={messages}
            loading={loadingThread}
            onSend={handleSend}
            onSendVoiceNote={handleSendVoiceNote}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
