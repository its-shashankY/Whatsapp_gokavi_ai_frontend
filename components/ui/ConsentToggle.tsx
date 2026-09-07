import { cn } from "@/lib/utils";
import type { ConsentItem } from "@/types";

interface ConsentToggleProps {
  consent: ConsentItem;
}

// Each consent renders as its own row with an explicit Granted / Not Granted
// pill in addition to the switch, so the three consent types never read as
// a single merged status.
export function ConsentToggle({ consent }: ConsentToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-body-md text-body-md text-on-surface">{consent.label}</p>
        <p className="text-xs text-on-surface-variant">{consent.description}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap",
            consent.granted
              ? "bg-green-100 text-green-800"
              : "bg-gray-200 text-gray-600",
          )}
        >
          {consent.granted ? "Granted" : "Not Granted"}
        </span>
        <span
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            consent.granted ? "bg-secondary" : "bg-surface-variant",
          )}
          role="img"
          aria-label={`${consent.label}: ${consent.granted ? "granted" : "not granted"}`}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
              consent.granted ? "translate-x-[22px]" : "translate-x-[2px]",
            )}
          />
        </span>
      </div>
    </div>
  );
}
