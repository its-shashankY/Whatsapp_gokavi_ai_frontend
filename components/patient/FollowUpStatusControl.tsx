"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { updateFollowUpStatus } from "@/lib/api";
import type { FollowUpStatus } from "@/types";

const LABEL: Record<FollowUpStatus, string> = {
  NOT_TOUCHED: "Not touched",
  ON_HOLD: "On hold",
  COMPLETED: "Completed",
};

// Own fixed color per state, same convention as StatusTag, so staff can
// scan a list and immediately see which patients still need a look.
const STYLES: Record<FollowUpStatus, string> = {
  NOT_TOUCHED: "bg-gray-200 text-gray-700",
  ON_HOLD: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-green-100 text-green-800",
};

export function FollowUpStatusControl({
  patientId,
  status,
  onChanged,
}: {
  patientId: string;
  status: FollowUpStatus;
  onChanged?: (status: FollowUpStatus) => void;
}) {
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: FollowUpStatus) {
    const previous = current;
    setCurrent(next);
    setSaving(true);
    try {
      await updateFollowUpStatus(patientId, next);
      onChanged?.(next);
    } catch {
      // Revert on failure — staff should never see a status "stick" that
      // wasn't actually saved.
      setCurrent(previous);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={current}
      disabled={saving}
      onClick={(e) => {
        // Rows this sits in are often wrapped in a Link — a click on the
        // select must never trigger that row's navigation.
        e.preventDefault();
        e.stopPropagation();
      }}
      onChange={(e) => handleChange(e.target.value as FollowUpStatus)}
      className={cn(
        "text-xs font-semibold px-2 py-1 rounded-md border-0 cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-secondary",
        saving && "opacity-60 cursor-wait",
        STYLES[current],
      )}
      aria-label="Follow-up status"
    >
      {(Object.keys(LABEL) as FollowUpStatus[]).map((value) => (
        <option key={value} value={value}>
          {LABEL[value]}
        </option>
      ))}
    </select>
  );
}
