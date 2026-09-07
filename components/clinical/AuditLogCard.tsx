import { Icon } from "@/components/ui/Icon";
import type { AuditLogEntry } from "@/types";

const ICON_BY_ACTION: Record<string, string> = {
  "patient.view": "visibility",
  "medication.create": "prescriptions",
  "lab_result.create": "upload_file",
  "conversation.view": "chat",
  "conversation.send": "send",
  "escalations.ack": "check_circle",
  "escalations.resolve": "task_alt",
};

function humanizeAction(action: string): string {
  const known: Record<string, string> = {
    "patient.view": "Accessed patient record",
    "medication.create": "Medication order created",
    "lab_result.create": "Lab result created",
    "conversation.view": "Opened conversation",
    "conversation.send": "Sent WhatsApp reply",
    "escalations.ack": "Acknowledged escalation",
    "escalations.resolve": "Resolved escalation",
  };
  return known[action] ?? action.replace(/[._]/g, " ");
}

export function AuditLogCard({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline-md text-headline-md text-base text-on-surface">Session Audit Log</h3>
        <Icon name="info" className="text-outline-variant !text-sm" />
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-on-surface-variant">No recorded activity for this patient yet.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="flex gap-3 items-start">
              <Icon name={ICON_BY_ACTION[entry.action] ?? "info"} className="text-tertiary !text-[16px] mt-0.5" />
              <div className="min-w-0">
                <p className="font-body-md text-body-md text-sm text-on-surface break-words">
                  {humanizeAction(entry.action)}
                </p>
                <p className="font-body-md text-body-md text-xs text-on-surface-variant break-words">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
