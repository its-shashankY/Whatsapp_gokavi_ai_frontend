"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ApiError, getCallBookingHistory, getCurrentCallBookings, setCallAvailability } from "@/lib/api";
import type { CallAvailabilitySummary, CallBooking } from "@/types";

// Fixed per the client spec — every slot is exactly 15 minutes; staff only
// choose the date and the start/end of the window, not the slot length.
const SLOT_DURATION_MIN = 15;

function formatTime(hhmmss: string): string {
  const [h, m] = hhmmss.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function BookingTable({ rows, loading, emptyLabel }: { rows: CallBooking[]; loading: boolean; emptyLabel: string }) {
  if (loading) {
    return <p className="p-6 text-center text-on-surface-variant text-sm">Loading…</p>;
  }
  if (rows.length === 0) {
    return <p className="p-6 text-center text-on-surface-variant text-sm">{emptyLabel}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-variant text-left text-on-surface-variant">
            <th className="px-4 py-3 font-medium">S.No</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Slot</th>
            <th className="px-4 py-3 font-medium">Time Elapsed</th>
            <th className="px-4 py-3 font-medium">Reminder Sent</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant">
          {rows.map((row, i) => (
            <tr key={row.id}>
              <td className="px-4 py-3 text-on-surface-variant">{i + 1}</td>
              <td className="px-4 py-3">{row.phone}</td>
              <td className="px-4 py-3">{row.name ?? "Unknown Contact"}</td>
              <td className="px-4 py-3">{formatDate(row.date)}</td>
              <td className="px-4 py-3">{formatTime(row.startTime)} – {formatTime(row.endTime)}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    row.isTimeElapsed ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-800"
                  }`}
                >
                  {row.isTimeElapsed ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    row.isReminderSent ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {row.isReminderSent ? "Yes" : "No"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BookingPage() {
  const [tab, setTab] = useState<"current" | "history">("current");
  const [current, setCurrent] = useState<CallBooking[]>([]);
  const [history, setHistory] = useState<CallBooking[]>([]);
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [summary, setSummary] = useState<CallAvailabilitySummary | null>(null);

  const loadCurrent = useCallback(() => {
    setLoadingCurrent(true);
    getCurrentCallBookings()
      .then(setCurrent)
      .finally(() => setLoadingCurrent(false));
  }, []);

  const loadHistory = useCallback(() => {
    setLoadingHistory(true);
    getCallBookingHistory()
      .then(setHistory)
      .finally(() => setLoadingHistory(false));
  }, []);

  useEffect(() => {
    loadCurrent();
    loadHistory();
  }, [loadCurrent, loadHistory]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSummary(null);
    if (!date || !startTime || !endTime) {
      setFormError("Please fill in date, start time, and end time.");
      return;
    }
    if (startTime >= endTime) {
      setFormError("Start time must be before end time.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await setCallAvailability({ date, startTime, endTime });
      setSummary(result);
      loadCurrent();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? `Failed to open availability (${err.status}). Please retry.` : "Failed to open availability — check your connection and retry.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell title="Gokavi Admin">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Booking</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Open doctor availability for report-review calls, and track who's booked.
          </p>
        </div>

        <Card className="p-6">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-1">Doctor Availability</h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Choose a date and time window — it's automatically split into {SLOT_DURATION_MIN}-minute slots, and
            every eligible patient (sent a report, never booked before) gets a WhatsApp invite right away.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-on-surface-variant" htmlFor="booking-date">Date</label>
              <input
                id="booking-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-on-surface-variant" htmlFor="booking-start">Start time</label>
              <input
                id="booking-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-on-surface-variant" htmlFor="booking-end">End time</label>
              <input
                id="booking-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <Button type="submit" disabled={submitting}>
              <Icon name="call" className="!text-[18px]" />
              {submitting ? "Opening…" : "Open availability"}
            </Button>
          </form>
          {formError && <p className="text-sm text-error mt-3">{formError}</p>}
          {summary && (
            <p className="text-sm text-green-800 bg-green-50 rounded-lg px-3 py-2 mt-3">
              Created {summary.slotsCreated} slot{summary.slotsCreated === 1 ? "" : "s"}. Invited{" "}
              {summary.eligiblePatients} eligible patient{summary.eligiblePatients === 1 ? "" : "s"}
              {summary.invitesFailed > 0 && ` (${summary.invitesFailed} invite${summary.invitesFailed === 1 ? "" : "s"} failed to send)`}.
            </p>
          )}
        </Card>

        <div className="flex items-center gap-2 border-b border-outline-variant">
          <button
            type="button"
            onClick={() => setTab("current")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === "current" ? "border-secondary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            Bookings
          </button>
          <button
            type="button"
            onClick={() => setTab("history")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === "history" ? "border-secondary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            History
          </button>
        </div>

        <Card className="overflow-hidden">
          {tab === "current" ? (
            <BookingTable rows={current} loading={loadingCurrent} emptyLabel="No upcoming bookings." />
          ) : (
            <BookingTable rows={history} loading={loadingHistory} emptyLabel="No completed bookings yet." />
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
