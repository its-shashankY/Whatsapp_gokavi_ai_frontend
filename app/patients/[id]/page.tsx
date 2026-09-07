import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { ConsentStatusCard } from "@/components/patient/ConsentStatusCard";
import { CycleProgressCard } from "@/components/patient/CycleProgressCard";
import { MedicationsCard } from "@/components/patient/MedicationsCard";
import { PatientCommsPanel } from "@/components/patient/PatientCommsPanel";
import { getPatientById } from "@/lib/mockData";

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = getPatientById(params.id);

  if (!patient) {
    notFound();
  }

  return (
    <DashboardShell title="Gokavi Admin" searchPlaceholder="Search patients, records...">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 flex flex-col gap-stack-gap">
          <PatientHeader patient={patient} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-gap">
            <ConsentStatusCard consents={patient.consents} />
            <CycleProgressCard steps={patient.cycle} />
          </div>
          <MedicationsCard medications={patient.medications} />
        </div>
        <PatientCommsPanel
          patientName={patient.name}
          avatarUrl={patient.avatarUrl}
          messages={patient.comms}
        />
      </div>
    </DashboardShell>
  );
}
