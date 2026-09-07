import { Icon } from "@/components/ui/Icon";
import type { AuditLogEntry } from "@/types";

export function AuditLogCard({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline-md text-headline-md text-base text-on-surface">Session Audit Log</h3>
        <Icon name="info" className="text-outline-variant !text-sm" />
      </div>
      <ul className="space-y-3">
        {entries.map((entry) => (
          <li key={entry.id} className="flex gap-3 items-start">
            <Icon name={entry.icon} className="text-tertiary !text-[16px] mt-0.5" />
            <div className="min-w-0">
              <p className="font-body-md text-body-md text-sm text-on-surface break-words">{entry.text}</p>
              <p className="font-body-md text-body-md text-xs text-on-surface-variant break-words">
                {entry.meta}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
