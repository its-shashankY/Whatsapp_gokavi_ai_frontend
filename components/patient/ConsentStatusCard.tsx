import { Icon } from "@/components/ui/Icon";
import { ConsentToggle } from "@/components/ui/ConsentToggle";
import type { ConsentItem } from "@/types";

export function ConsentStatusCard({ consents }: { consents: ConsentItem[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(7,2,53,0.04)] border border-surface-variant">
      <h3 className="font-button text-button text-primary mb-4 flex items-center gap-2">
        <Icon name="verified_user" className="text-secondary" />
        Consent Status
      </h3>
      {/* Three independent consent types, each with its own toggle + status pill below */}
      <div className="space-y-4 divide-y divide-surface-variant [&>*:not(:first-child)]:pt-4">
        {consents.map((consent) => (
          <ConsentToggle key={consent.id} consent={consent} />
        ))}
      </div>
    </div>
  );
}
