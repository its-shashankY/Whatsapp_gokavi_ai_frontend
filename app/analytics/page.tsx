"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { KpiCard } from "@/components/analytics/KpiCard";
import { FunnelChart } from "@/components/analytics/FunnelChart";
import { ChannelBreakdown } from "@/components/analytics/ChannelBreakdown";
import { biggestDropoff, enrichChannels, enrichFunnel } from "@/components/analytics/presentation";
import { Icon } from "@/components/ui/Icon";
import { getAnalyticsOverview } from "@/lib/api";
import type { AnalyticsOverview } from "@/types";

const RANGE_OPTIONS = [
  { label: "Last 30 Days", days: 30 },
  { label: "Last Quarter", days: 90 },
  { label: "Year to Date", days: 365 },
];

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAnalyticsOverview(days)
      .then((data) => !cancelled && setOverview(data))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [days]);

  const dropoff = overview ? biggestDropoff(overview.funnel) : null;

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
          <select
            className="bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg py-2 pl-4 pr-10 focus:ring-primary focus:border-primary font-body-md text-body-md shadow-sm"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            {RANGE_OPTIONS.map((opt) => (
              <option key={opt.days} value={opt.days}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {loading || !overview ? (
          <div className="text-center text-on-surface-variant py-20">Loading analytics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-gutter">
              <KpiCard
                label="Total Leads"
                value={overview.kpis.totalLeads.toLocaleString()}
                icon="person_add"
                accent="border-secondary-container"
                iconBg="bg-secondary-fixed"
                iconColor="text-on-secondary-container"
              />
              <KpiCard
                label="Avg Response Time"
                value={overview.kpis.avgResponseMinutes !== null ? overview.kpis.avgResponseMinutes.toString() : "—"}
                suffix={overview.kpis.avgResponseMinutes !== null ? "mins" : undefined}
                icon="timer"
                accent="border-primary-fixed-dim"
                iconBg="bg-primary-fixed"
                iconColor="text-on-primary-fixed"
              />
              <KpiCard
                label="No-Show Rate"
                value={`${overview.kpis.noShowRatePercent}%`}
                icon="event_busy"
                accent="border-error-container"
                iconBg="bg-error-container"
                iconColor="text-on-error-container"
              />
            </div>

            <FunnelChart stages={enrichFunnel(overview.funnel)} />

            <div className="md:col-span-4 flex flex-col gap-stack-gap">
              {dropoff && (
                <div className="bg-secondary-fixed/50 rounded-xl p-6 border border-secondary-fixed-dim">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-surface-container-lowest rounded-full shadow-sm text-secondary flex-shrink-0">
                      <Icon name="lightbulb" />
                    </div>
                    <div>
                      <h4 className="font-button text-button text-on-secondary-container mb-2">
                        Biggest Dropoff
                      </h4>
                      <p className="text-sm text-on-surface-variant">
                        You are losing {dropoff.percent}% of leads between &quot;{dropoff.fromLabel}&quot; and
                        &quot;{dropoff.toLabel}&quot;.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <ChannelBreakdown channels={enrichChannels(overview.channels)} />
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
