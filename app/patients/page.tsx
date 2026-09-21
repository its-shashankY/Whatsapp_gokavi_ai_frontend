"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Avatar } from "@/components/ui/Avatar";
import { StatusTag } from "@/components/ui/StatusTag";
import { Icon } from "@/components/ui/Icon";
import { FollowUpStatusControl } from "@/components/patient/FollowUpStatusControl";
import { listPatients } from "@/lib/api";
import type { FollowUpStatus, Patient } from "@/types";

const FOLLOW_UP_FILTER_LABEL: Record<"ALL" | FollowUpStatus, string> = {
  ALL: "All follow-up states",
  NOT_TOUCHED: "Not touched",
  ON_HOLD: "On hold",
  COMPLETED: "Completed",
};

const FOLLOW_UP_VALUES = new Set(["NOT_TOUCHED", "ON_HOLD", "COMPLETED"]);

// Row background reflects who last spoke in the conversation — green means
// staff/the bot answered last, red means the customer's reply is the latest
// thing and still awaiting a response. No message yet stays neutral.
const ROW_TINT: Record<"IN" | "OUT", string> = {
  OUT: "bg-green-50 hover:bg-green-100",
  IN: "bg-red-50 hover:bg-red-100",
};

function readFiltersFromParams(params: URLSearchParams) {
  const followUp = params.get("followUp");
  return {
    query: params.get("q") ?? "",
    hasReportsOnly: params.get("hasReports") === "1",
    hasDiseaseOnly: params.get("hasDisease") === "1",
    followUpFilter: (followUp && FOLLOW_UP_VALUES.has(followUp) ? followUp : "ALL") as "ALL" | FollowUpStatus,
    hasRepliedOnly: params.get("hasReplied") === "1",
  };
}

export default function PatientRecordsPage() {
  return (
    <Suspense fallback={null}>
      <PatientRecordsPageInner />
    </Suspense>
  );
}

function PatientRecordsPageInner() {
  const searchParams = useSearchParams();
  const initial = readFiltersFromParams(searchParams);

  const [query, setQuery] = useState(initial.query);
  const [hasReportsOnly, setHasReportsOnly] = useState(initial.hasReportsOnly);
  const [hasDiseaseOnly, setHasDiseaseOnly] = useState(initial.hasDiseaseOnly);
  const [followUpFilter, setFollowUpFilter] = useState<"ALL" | FollowUpStatus>(initial.followUpFilter);
  const [hasRepliedOnly, setHasRepliedOnly] = useState(initial.hasRepliedOnly);
  const [patients, setPatients] = useState<Patient[]>([]);
  // Only true before the very first load ever completes — a filter change
  // afterwards just refetches quietly, keeping the current rows on screen
  // instead of blanking the list while the new page loads.
  const [initialLoading, setInitialLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  // Keep the URL in sync with the active filters so navigating away (e.g.
  // into a patient's record) and back restores the exact same filtered view.
  // Deliberately NOT next/navigation's router.replace: calling that on every
  // filter toggle re-triggers the useSearchParams() Suspense boundary above,
  // which remounts this whole component and wipes patients/loading state —
  // showing a full reload flash on every click. history.replaceState updates
  // the address bar without touching Next's router at all, so nothing remounts.
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (hasReportsOnly) params.set("hasReports", "1");
    if (hasDiseaseOnly) params.set("hasDisease", "1");
    if (followUpFilter !== "ALL") params.set("followUp", followUpFilter);
    if (hasRepliedOnly) params.set("hasReplied", "1");
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/patients?${qs}` : "/patients");
  }, [query, hasReportsOnly, hasDiseaseOnly, followUpFilter, hasRepliedOnly]);

  useEffect(() => {
    let cancelled = false;
    const options: {
      hasReports?: boolean;
      hasDisease?: boolean;
      followUpStatus?: FollowUpStatus;
      hasReplied?: boolean;
    } = {};
    if (hasReportsOnly) options.hasReports = true;
    if (hasDiseaseOnly) options.hasDisease = true;
    if (followUpFilter !== "ALL") options.followUpStatus = followUpFilter;
    if (hasRepliedOnly) options.hasReplied = true;
    listPatients(Object.keys(options).length ? options : undefined)
      .then((data) => {
        if (cancelled) return;
        setPatients(data);
        hasLoadedOnce.current = true;
      })
      .finally(() => !cancelled && setInitialLoading(false));
    return () => {
      cancelled = true;
    };
  }, [hasReportsOnly, hasDiseaseOnly, followUpFilter, hasRepliedOnly]);

  function handleFollowUpChanged(patientId: string, newStatus: FollowUpStatus) {
    setPatients((prev) => {
      // Currently filtered to a specific state and this patient no longer
      // matches it — drop it from view immediately rather than waiting for
      // a refetch, so working through a queue (e.g. "Not touched") shows
      // real progress as each one gets marked.
      if (followUpFilter !== "ALL" && newStatus !== followUpFilter) {
        return prev.filter((p) => p.id !== patientId);
      }
      return prev.map((p) => (p.id === patientId ? { ...p, followUpStatus: newStatus } : p));
    });
  }

  const filtered = patients.filter(
    (p) =>
      (p.name ?? "").toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query) ||
      p.id.toLowerCase().includes(query.toLowerCase()),
  );

  const showEmptyLoadingState = initialLoading && !hasLoadedOnce.current;

  return (
    <DashboardShell title="Gokavi Admin">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Patient Records</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Search and open a patient's full clinical profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-md flex-1 min-w-[240px]">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Search by name or phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => setHasReportsOnly((v) => !v)}
            aria-pressed={hasReportsOnly}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              hasReportsOnly
                ? "bg-secondary/10 border-secondary text-secondary"
                : "bg-surface-container-low border-outline-variant text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Icon name="description" className="!text-[18px]" />
            Has reports
          </button>
          <button
            type="button"
            onClick={() => setHasDiseaseOnly((v) => !v)}
            aria-pressed={hasDiseaseOnly}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              hasDiseaseOnly
                ? "bg-secondary/10 border-secondary text-secondary"
                : "bg-surface-container-low border-outline-variant text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Icon name="medical_information" className="!text-[18px]" />
            Has disease mentioned
          </button>
          <select
            value={followUpFilter}
            onChange={(e) => setFollowUpFilter(e.target.value as "ALL" | FollowUpStatus)}
            className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-sm font-medium text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {(Object.keys(FOLLOW_UP_FILTER_LABEL) as ("ALL" | FollowUpStatus)[]).map((value) => (
              <option key={value} value={value}>
                {FOLLOW_UP_FILTER_LABEL[value]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setHasRepliedOnly((v) => !v)}
            aria-pressed={hasRepliedOnly}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              hasRepliedOnly
                ? "bg-secondary/10 border-secondary text-secondary"
                : "bg-surface-container-low border-outline-variant text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Icon name="reply" className="!text-[18px]" />
            Replied
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant card-shadow divide-y divide-surface-variant overflow-hidden">
          {showEmptyLoadingState && <p className="p-6 text-center text-on-surface-variant text-sm">Loading patients...</p>}
          {!showEmptyLoadingState &&
            filtered.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className={`flex items-center gap-4 p-4 transition-colors ${
                  patient.lastMessageDirection ? ROW_TINT[patient.lastMessageDirection] : "hover:bg-surface-container-low"
                }`}
              >
                <Avatar name={patient.name ?? "?"} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="font-button text-button text-primary truncate">
                    {patient.name ?? "Unknown Contact"}
                  </p>
                  <p className="text-sm text-on-surface-variant truncate">{patient.phone}</p>
                </div>
                {patient.hasReports && (
                  <Icon
                    name="description"
                    className="!text-[18px] text-secondary flex-shrink-0"
                    aria-label="Has submitted reports"
                  />
                )}
                {patient.hasDiseaseMentioned && patient.detectedCondition && (
                  <span
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-medium flex-shrink-0 max-w-[160px]"
                    title={patient.detectedCondition}
                  >
                    <Icon name="medical_information" className="!text-[14px] flex-shrink-0" />
                    <span className="truncate">{patient.detectedCondition}</span>
                  </span>
                )}
                {patient.hasReplied && (
                  <span
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium flex-shrink-0"
                    title="Patient has replied since staff last messaged them"
                  >
                    <Icon name="reply" className="!text-[14px]" />
                    Replied
                  </span>
                )}
                <FollowUpStatusControl
                  patientId={patient.id}
                  status={patient.followUpStatus}
                  onChanged={(next) => handleFollowUpChanged(patient.id, next)}
                />
                <StatusTag status={patient.status} />
                <Icon name="chevron_right" className="text-on-surface-variant flex-shrink-0" />
              </Link>
            ))}
          {!showEmptyLoadingState && filtered.length === 0 && (
            <p className="p-6 text-center text-on-surface-variant text-sm">No patients match your search.</p>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
