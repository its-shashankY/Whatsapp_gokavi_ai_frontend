import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { MedicationEntry } from "@/types";

const STATUS_STYLE: Record<MedicationEntry["status"], string> = {
  ACTIVE: "bg-secondary-fixed text-on-secondary-fixed",
  COMPLETED: "bg-surface-variant text-on-surface-variant",
  SUPERSEDED: "bg-orange-100 text-orange-800",
  CANCELLED: "bg-gray-200 text-gray-600 line-through",
};

const STATUS_LABEL: Record<MedicationEntry["status"], string> = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  SUPERSEDED: "Superseded",
  CANCELLED: "Cancelled",
};

export function MedicationsCard({ medications }: { medications: MedicationEntry[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(7,2,53,0.04)] border border-surface-variant">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-button text-button text-primary flex items-center gap-2">
          <Icon name="pill" className="text-secondary" />
          Medications
        </h3>
      </div>
      {medications.length === 0 ? (
        <p className="text-sm text-on-surface-variant">No medications on file.</p>
      ) : (
        <div className="space-y-3">
          {medications.map((med) => (
            <div
              key={med.id}
              className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-variant gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary-container flex-shrink-0">
                  <Icon name="medication_liquid" />
                </div>
                <div className="min-w-0">
                  <p className="font-body-md text-body-md text-on-surface font-semibold truncate">
                    {med.name}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">{med.dosage}</p>
                </div>
              </div>
              <span className={cn("px-2 py-1 rounded text-xs font-semibold flex-shrink-0", STATUS_STYLE[med.status])}>
                {STATUS_LABEL[med.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
