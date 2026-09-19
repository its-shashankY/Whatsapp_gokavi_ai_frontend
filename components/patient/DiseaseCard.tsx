import { Icon } from "@/components/ui/Icon";

export function DiseaseCard({
  condition,
  evidence,
}: {
  condition: string;
  evidence?: string | null;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(7,2,53,0.04)] border border-surface-variant">
      <h3 className="font-button text-button text-primary mb-4 flex items-center gap-2">
        <Icon name="medical_information" className="text-secondary" />
        Condition Mentioned in Chat
      </h3>
      <div className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant bg-surface-container-low">
        <Icon name="medical_information" className="text-on-surface-variant flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-on-surface">{condition}</p>
          {evidence && <p className="text-xs text-on-surface-variant italic mt-1">&ldquo;{evidence}&rdquo;</p>}
        </div>
      </div>
    </div>
  );
}
