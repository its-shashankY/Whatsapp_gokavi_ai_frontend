import { Icon } from "@/components/ui/Icon";
import type { PatientReportEntry } from "@/types";

function iconForMediaType(mediaType: PatientReportEntry["mediaType"]): string {
  if (mediaType === "image") return "image";
  if (mediaType === "video") return "videocam";
  if (mediaType === "audio") return "mic";
  return "description";
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReportsCard({ reports }: { reports: PatientReportEntry[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_24px_rgba(7,2,53,0.04)] border border-surface-variant">
      <h3 className="font-button text-button text-primary mb-4 flex items-center gap-2">
        <Icon name="description" className="text-secondary" />
        Reports Shared by Patient
      </h3>
      {reports.length === 0 && (
        <p className="text-sm text-on-surface-variant">No reports submitted during onboarding.</p>
      )}
      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant bg-surface-container-low"
          >
            <Icon name={iconForMediaType(report.mediaType)} className="text-on-surface-variant flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate">
                {report.filename ?? `${report.mediaType} report`}
              </p>
              <p className="text-xs text-on-surface-variant">{formatTimestamp(report.createdAt)}</p>
            </div>
            {report.downloadUrl ? (
              <a
                href={report.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary/10 text-secondary text-sm font-medium hover:bg-secondary/20 transition-colors flex-shrink-0"
              >
                <Icon name="download" className="!text-[16px]" />
                View
              </a>
            ) : (
              <span className="text-xs text-on-surface-variant italic flex-shrink-0" title="Check the WhatsApp conversation with this patient for the original file">
                Check WhatsApp
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
