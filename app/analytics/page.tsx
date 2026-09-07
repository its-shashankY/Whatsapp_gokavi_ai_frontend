import { DashboardShell } from "@/components/layout/DashboardShell";
import { KpiCard } from "@/components/analytics/KpiCard";
import { FunnelChart } from "@/components/analytics/FunnelChart";
import { ChannelBreakdown } from "@/components/analytics/ChannelBreakdown";
import { Icon } from "@/components/ui/Icon";
import { acquisitionChannels, analyticsKpis, funnelStages } from "@/lib/mockData";

export default function AnalyticsPage() {
  return (
    <DashboardShell title="Gokavi Admin">
      <div className="max-w-[1280px] w-full mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              Conversion Analytics
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              Patient acquisition and engagement metrics.
            </p>
          </div>
          <div className="flex gap-3">
            <select className="bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg py-2 pl-4 pr-10 focus:ring-primary focus:border-primary font-body-md text-body-md shadow-sm">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
            <button className="bg-surface-container-lowest border border-outline-variant text-primary rounded-lg py-2 px-4 hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-2">
              <Icon name="download" className="!text-sm" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-gutter">
            {analyticsKpis.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          <FunnelChart stages={funnelStages} />

          <div className="md:col-span-4 flex flex-col gap-stack-gap">
            <div className="bg-secondary-fixed/50 rounded-xl p-6 border border-secondary-fixed-dim">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-surface-container-lowest rounded-full shadow-sm text-secondary flex-shrink-0">
                  <Icon name="lightbulb" />
                </div>
                <div>
                  <h4 className="font-button text-button text-on-secondary-container mb-2">
                    High Dropoff Warning
                  </h4>
                  <p className="text-sm text-on-surface-variant mb-4">
                    You are losing 40% of leads between &quot;Warm&quot; and &quot;Booked&quot;. Consider
                    implementing automated SMS reminders.
                  </p>
                  <button className="text-secondary font-button text-sm hover:underline flex items-center gap-1">
                    View Campaign Setup <Icon name="arrow_forward" className="!text-[16px]" />
                  </button>
                </div>
              </div>
            </div>

            <ChannelBreakdown channels={acquisitionChannels} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
