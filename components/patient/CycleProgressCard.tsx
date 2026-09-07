import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { CycleStep } from "@/types";

export function CycleProgressCard({ steps }: { steps: CycleStep[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(7,2,53,0.04)] border border-surface-variant">
      <h3 className="font-button text-button text-primary mb-4 flex items-center gap-2">
        <Icon name="timeline" className="text-secondary" />
        Cycle Progress
      </h3>
      {steps.length === 0 ? (
        <p className="text-sm text-on-surface-variant">No active treatment cycle.</p>
      ) : (
        <div className="relative">
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-surface-variant" />
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-4 relative">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex-shrink-0 z-10 flex items-center justify-center mt-1",
                    step.state === "completed" && "bg-secondary",
                    step.state === "current" && "bg-secondary-fixed border-2 border-secondary",
                    step.state === "upcoming" && "bg-surface-variant",
                  )}
                >
                  {step.state === "completed" && <Icon name="check" className="!text-[12px] text-white" />}
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "font-body-md text-body-md font-semibold break-words",
                      step.state === "upcoming" ? "text-on-surface-variant" : "text-on-surface",
                    )}
                  >
                    {step.label}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      step.state === "current" ? "text-secondary font-medium" : "text-on-surface-variant",
                    )}
                  >
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
