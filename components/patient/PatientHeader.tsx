import { Avatar } from "@/components/ui/Avatar";
import { StatusTag } from "@/components/ui/StatusTag";
import { Icon } from "@/components/ui/Icon";
import type { Patient } from "@/types";

export function PatientHeader({ patient }: { patient: Patient }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(7,2,53,0.04)] border border-surface-variant flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-secondary-fixed" />
      <Avatar name={patient.name} src={patient.avatarUrl} size={96} className="border-4 border-white shadow-sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h2 className="font-headline-md text-headline-md text-primary break-words">{patient.name}</h2>
          <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-caps text-label-caps px-2 py-1 rounded-full whitespace-nowrap">
            ID: {patient.id}
          </span>
          <StatusTag status={patient.status} />
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-4">
          {patient.age > 0 ? `${patient.age} yrs • ${patient.bloodGroup} • ` : ""}
          {patient.cycleLabel}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Icon name="mail" className="!text-base" />
            {patient.email}
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Icon name="call" className="!text-base" />
            {patient.phone}
          </div>
        </div>
      </div>
      <div className="md:text-right flex-shrink-0">
        <button className="bg-surface-container-low text-primary font-button text-button px-4 py-2 rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
