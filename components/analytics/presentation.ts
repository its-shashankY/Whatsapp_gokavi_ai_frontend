import type { AcquisitionChannel, FunnelStage } from "@/types";

// The backend sends the real numbers only ({id,label,value} / {source,count,
// percent}) — icon/gradient/color are presentation choices that belong here,
// not in the API.

export interface EnrichedFunnelStage {
  id: string;
  label: string;
  value: number;
  icon: string;
  widthPercent: number;
  conversionLabel?: string;
  gradient: string;
  textClass: string;
}

const FUNNEL_STYLE: Record<string, { icon: string; gradient: string; textClass: string }> = {
  cold: { icon: "public", gradient: "linear-gradient(90deg, #1e1b4b 0%, #28006e 100%)", textClass: "text-on-primary" },
  warm: { icon: "waving_hand", gradient: "linear-gradient(90deg, #444173 0%, #4f319c 100%)", textClass: "text-on-primary" },
  booked: { icon: "event_available", gradient: "linear-gradient(90deg, #8683ba 0%, #9377e4 100%)", textClass: "text-on-primary-fixed-variant" },
  converted: { icon: "favorite", gradient: "#a93349", textClass: "text-on-secondary" },
};

const DEFAULT_FUNNEL_STYLE = { icon: "insights", gradient: "#5b598c", textClass: "text-on-primary" };

export function enrichFunnel(stages: FunnelStage[]): EnrichedFunnelStage[] {
  const baseline = stages[0]?.value || 1;
  return stages.map((stage, i) => {
    const style = FUNNEL_STYLE[stage.id] ?? DEFAULT_FUNNEL_STYLE;
    const prev = stages[i - 1];
    return {
      ...stage,
      ...style,
      widthPercent: Math.max(20, Math.round((stage.value / baseline) * 100)),
      conversionLabel: prev && prev.value > 0 ? `${Math.round((stage.value / prev.value) * 100)}%` : undefined,
    };
  });
}

export interface EnrichedChannel {
  source: string;
  label: string;
  count: number;
  percent: number;
  icon: string;
  colorClass: string;
}

const CHANNEL_STYLE: Record<string, { label: string; icon: string; colorClass: string }> = {
  organic_search: { label: "Organic Search", icon: "search", colorClass: "bg-tertiary-container" },
  social_referral: { label: "Social Referral", icon: "share", colorClass: "bg-primary-container" },
  paid_ads: { label: "Paid Ads", icon: "campaign", colorClass: "bg-secondary" },
  referral: { label: "Referral", icon: "diversity_3", colorClass: "bg-green-600" },
};

function titleize(source: string): string {
  return source.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function enrichChannels(channels: AcquisitionChannel[]): EnrichedChannel[] {
  return channels.map((channel) => {
    const style = CHANNEL_STYLE[channel.source] ?? {
      label: titleize(channel.source),
      icon: "insights",
      colorClass: "bg-outline-variant",
    };
    return { ...channel, ...style };
  });
}

export interface DropoffInsight {
  fromLabel: string;
  toLabel: string;
  percent: number;
}

export function biggestDropoff(stages: FunnelStage[]): DropoffInsight | null {
  let worst: DropoffInsight | null = null;
  for (let i = 0; i < stages.length - 1; i++) {
    const current = stages[i];
    const next = stages[i + 1];
    if (current.value === 0) continue;
    const percent = Math.round((1 - next.value / current.value) * 100);
    if (percent > 0 && (!worst || percent > worst.percent)) {
      worst = { fromLabel: current.label, toLabel: next.label, percent };
    }
  }
  return worst;
}
