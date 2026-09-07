import { Icon } from "@/components/ui/Icon";
import type { FunnelStage } from "@/types";

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  return (
    <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 card-shadow border border-outline-variant/30 flex flex-col">
      <h3 className="font-headline-md text-headline-md text-primary mb-6">Patient Conversion Funnel</h3>
      <div className="flex-1 flex flex-col justify-center gap-4 py-8 relative">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="relative flex items-center justify-center h-16 rounded-lg transition-all hover:scale-[1.01] hover:brightness-95 mx-auto"
            style={{
              width: `${stage.widthPercent}%`,
              background: stage.gradient,
            }}
          >
            <div className={`absolute left-6 font-button text-button flex items-center gap-2 ${stage.textClass}`}>
              <Icon name={stage.icon} className="!text-sm" />
              {stage.label}
            </div>
            <div className={`absolute right-6 font-headline-md ${stage.textClass}`}>
              {stage.value.toLocaleString()}
            </div>
            {stage.conversionLabel && (
              <div className="absolute -top-3 right-8 bg-surface-container-lowest text-on-surface-variant text-xs font-bold px-2 py-1 rounded-full shadow border border-outline-variant/20">
                {stage.conversionLabel}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
