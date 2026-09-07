"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { createLabResult } from "@/lib/api";

const TEST_TYPES = [
  { value: "HORMONAL_PANEL", label: "Hormone Panel (FSH/LH/E2)" },
  { value: "BETA_HCG", label: "Beta hCG" },
  { value: "AMH", label: "AMH" },
  { value: "SEMEN_ANALYSIS", label: "Semen Analysis" },
  { value: "OTHER", label: "Other" },
];

export function LabUploadCard({ patientId }: { patientId: string }) {
  const [testType, setTestType] = useState(TEST_TYPES[0].value);
  const [reportUrl, setReportUrl] = useState("");
  const [doctorNote, setDoctorNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reportUrl.trim()) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      await createLabResult({ patientId, testType, reportFileUrl: reportUrl.trim(), doctorNote: doctorNote.trim() || null });
      setFeedback("Lab result recorded.");
      setReportUrl("");
      setDoctorNote("");
    } catch {
      setFeedback("Failed to record lab result. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="upload_file" className="text-tertiary" />
        <h3 className="font-headline-md text-headline-md text-base text-on-surface">Attach Lab Report</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-label-caps text-label-caps text-primary mb-2">DOCUMENT TYPE</label>
          <select
            className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-2 font-body-md text-body-md text-sm"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
          >
            {TEST_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-label-caps text-label-caps text-primary mb-2">REPORT FILE URL</label>
          <input
            className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-2 font-body-md text-body-md text-sm outline-none"
            placeholder="https://..."
            type="url"
            value={reportUrl}
            onChange={(e) => setReportUrl(e.target.value)}
          />
          <p className="text-xs text-on-surface-variant mt-1">
            No file storage is wired up yet — paste a link to an already-hosted report.
          </p>
        </div>

        <div>
          <label className="block font-label-caps text-label-caps text-primary mb-2">DOCTOR&apos;S NOTE (OPTIONAL)</label>
          <textarea
            className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-2 font-body-md text-body-md text-sm outline-none"
            rows={2}
            value={doctorNote}
            onChange={(e) => setDoctorNote(e.target.value)}
          />
        </div>

        {feedback && <p className="text-sm text-secondary">{feedback}</p>}

        <button
          className="w-full bg-secondary text-on-secondary font-button text-button py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          onClick={handleSubmit}
          disabled={submitting || !reportUrl.trim()}
        >
          <Icon name="cloud_upload" className="!text-[18px]" />
          {submitting ? "Saving..." : "Attach Report"}
        </button>
      </div>
    </div>
  );
}
