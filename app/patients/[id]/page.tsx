"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { ConsentStatusCard } from "@/components/patient/ConsentStatusCard";
import { CycleProgressCard } from "@/components/patient/CycleProgressCard";
import { MedicationsCard } from "@/components/patient/MedicationsCard";
import { PatientCommsPanel } from "@/components/patient/PatientCommsPanel";
import { ApiError, getConversationThread, getPatientDetail, sendMessage } from "@/lib/api";
import type { Message, Patient } from "@/types";

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

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

  if (notFound) {
    return (
      <DashboardShell title="Gokavi Admin">
        <div className="flex items-center justify-center h-full text-on-surface-variant">
          Patient not found.
        </div>
      </DashboardShell>
    );
  }

  if (loadingPatient || !patient) {
    return (
      <DashboardShell title="Gokavi Admin">
        <div className="flex items-center justify-center h-full text-on-surface-variant">
          Loading patient...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Gokavi Admin" searchPlaceholder="Search patients, records...">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 flex flex-col gap-stack-gap">
          <PatientHeader patient={patient} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-gap">
            <ConsentStatusCard consents={patient.consents} />
            {patient.cycle && <CycleProgressCard steps={patient.cycle} />}
          </div>
          {patient.medications && <MedicationsCard medications={patient.medications} />}
        </div>
        <PatientCommsPanel
          patientName={patient.name ?? "Unknown Contact"}
          messages={messages}
          loading={loadingThread}
          onSend={handleSend}
        />
      </div>
    </DashboardShell>
  );
}
