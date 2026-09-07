import { Icon } from "@/components/ui/Icon";
import type { EnrichedChannel } from "./presentation";

export function ChannelBreakdown({ channels }: { channels: EnrichedChannel[] }) {
  if (channels.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-6 card-shadow border border-outline-variant/30 flex-1">
        <h4 className="font-button text-button text-primary mb-6">Top Acquisition Channels</h4>
        <p className="text-sm text-on-surface-variant">No lead source data recorded for this period yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 card-shadow border border-outline-variant/30 flex-1">
      <h4 className="font-button text-button text-primary mb-6">Top Acquisition Channels</h4>
      <div className="flex flex-col gap-5">
        {channels.map((channel) => (
          <div key={channel.source}>
            <div className="flex justify-between text-sm mb-2 gap-2">
              <span className="text-on-surface-variant flex items-center gap-2 min-w-0">
                <Icon name={channel.icon} className="!text-[16px] text-tertiary-container flex-shrink-0" />
                <span className="truncate">{channel.label}</span>
              </span>
              <span className="font-medium text-primary flex-shrink-0">{channel.percent}%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2">
              <div
                className={`${channel.colorClass} h-2 rounded-full`}
                style={{ width: `${channel.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
