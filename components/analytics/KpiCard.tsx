import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

interface KpiCardProps {
  label: string;
  value: string;
  suffix?: string;
  icon: string;
  accent: string;
  iconBg: string;
  iconColor: string;
}

export function KpiCard({ label, value, suffix, icon, accent, iconBg, iconColor }: KpiCardProps) {
  return (
    <div className={cn("bg-surface-container-lowest rounded-xl p-6 card-shadow border-t-4", accent)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          {label}
        </h3>
        <div className={cn("p-2 rounded-lg", iconBg, iconColor)}>
          <Icon name={icon} />
        </div>
      </div>
      <div className="font-headline-lg text-headline-lg text-primary">
        {value}
        {suffix && <span className="text-body-lg text-on-surface-variant ml-1">{suffix}</span>}
      </div>
    </div>
  );
}
