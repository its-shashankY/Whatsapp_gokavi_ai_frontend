"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { WeekGrid } from "@/components/calendar/WeekGrid";
import { Icon } from "@/components/ui/Icon";
import { getCalendarWeek } from "@/lib/api";
import type { CalendarWeek } from "@/types";

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function shiftDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Deliberately not toLocaleDateString: some sandboxed/minimal-ICU browser
// builds render partial {day,year} option combos as literal fallback text
// (e.g. "day: 13") instead of a real date — a fixed month table sidesteps
// that entirely and is just as correct for every real user's browser.
function formatWeekRange(weekStartISO: string, weekEndISO: string): string {
  const start = new Date(`${weekStartISO}T00:00:00`);
  const end = new Date(`${weekEndISO}T00:00:00`);
  return `${MONTHS[start.getMonth()]} ${start.getDate()} – ${MONTHS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
}

export default function CalendarPage() {
  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [week, setWeek] = useState<CalendarWeek | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCalendarWeek(toISODate(anchor))
      .then((data) => !cancelled && setWeek(data))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [anchor]);

  const todayISO = toISODate(new Date());
  const todayInThisWeek = week ? todayISO >= week.weekStart && todayISO <= week.weekEnd : false;
  const todayDate = todayInThisWeek ? new Date().getDate() : null;

  const rangeLabel = week ? formatWeekRange(week.weekStart, week.weekEnd) : "";

  return (
    <DashboardShell title="Gokavi Admin" searchPlaceholder="Search appointments...">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            {week ? `${week.doctorName}'s Calendar` : "Calendar"}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">{rangeLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAnchor(new Date())}
            className="px-4 py-2 border border-outline-variant rounded-full font-button text-button text-on-surface hover:bg-surface-container-low transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-surface-container-low rounded-full">
            <button
              onClick={() => setAnchor((d) => shiftDays(d, -7))}
              className="p-2 rounded-l-full hover:bg-surface-container-high transition-colors"
              aria-label="Previous week"
            >
              <Icon name="chevron_left" />
            </button>
            <button
              onClick={() => setAnchor((d) => shiftDays(d, 7))}
              className="p-2 rounded-r-full hover:bg-surface-container-high transition-colors"
              aria-label="Next week"
            >
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>

      {loading || !week ? (
        <div className="text-center text-on-surface-variant py-20">Loading calendar...</div>
      ) : (
        <WeekGrid week={week.days} todayDate={todayDate} />
      )}
    </DashboardShell>
  );
}
