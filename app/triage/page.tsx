import { DashboardShell } from "@/components/layout/DashboardShell";
import { TriageCard } from "@/components/triage/TriageCard";
import { Icon } from "@/components/ui/Icon";
import { triageCases, triageSummary } from "@/lib/mockData";

export default function TriagePage() {
  return (
    <DashboardShell title="Gokavi Admin" bare>
      <header className="px-container-padding-mobile md:px-container-padding-desktop py-8 md:py-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/20 bg-surface-lowest">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full font-label-caps text-label-caps flex items-center gap-1">
              <Icon name="warning" className="!text-[14px]" />
              HIGH PRIORITY
            </span>
            <span className="text-on-surface-variant font-body-md text-sm">Last updated: Just now</span>
          </div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Triage Escalation
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Urgent queue requiring immediate clinical attention. Patients listed have exceeded standard
            wait times or flagged concerning vitals.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/30 flex items-center gap-3">
            <span className="text-on-surface-variant text-sm">Critical:</span>
            <span className="text-error font-bold text-xl">{triageSummary.critical}</span>
          </div>
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/30 flex items-center gap-3">
            <span className="text-on-surface-variant text-sm">Urgent:</span>
            <span className="text-secondary font-bold text-xl">{triageSummary.urgent}</span>
          </div>
        </div>
      </header>

      <div className="p-container-padding-mobile md:p-container-padding-desktop flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {triageCases.map((triageCase) => (
            <TriageCard key={triageCase.id} triageCase={triageCase} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
