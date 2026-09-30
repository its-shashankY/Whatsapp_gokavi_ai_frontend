"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { setPatientBlocked } from "@/lib/api";

export function BlockPatientControl({
  patientId,
  isBlocked,
  blockedReason,
  onChanged,
}: {
  patientId: string;
  isBlocked: boolean;
  blockedReason?: string | null;
  onChanged?: (isBlocked: boolean, reason: string | null) => void;
}) {
  const [blocked, setBlocked] = useState(isBlocked);
  const [reason, setReason] = useState(blockedReason ?? null);
  const [saving, setSaving] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [draftReason, setDraftReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleUnblock() {
    setSaving(true);
    try {
      const result = await setPatientBlocked(patientId, false);
      setBlocked(result);
      setReason(null);
      onChanged?.(result, null);
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmBlock() {
    if (!draftReason.trim()) {
      setError("A reason is required to block this number.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const result = await setPatientBlocked(patientId, true, draftReason.trim());
      setBlocked(result);
      setReason(draftReason.trim());
      onChanged?.(result, draftReason.trim());
      setShowPrompt(false);
      setDraftReason("");
    } catch {
      setError("Failed to block this patient — please retry.");
    } finally {
      setSaving(false);
    }
  }

  if (blocked) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="bg-red-100 text-red-700 font-label-caps text-label-caps px-2 py-1 rounded-full whitespace-nowrap flex items-center gap-1"
          title={reason ?? undefined}
        >
          <Icon name="block" className="!text-sm" />
          Blocked
        </span>
        <button
          type="button"
          disabled={saving}
          onClick={handleUnblock}
          className="text-xs font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-wait"
        >
          {saving ? "Unblocking…" : "Unblock"}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShowPrompt(true);
          setDraftReason("");
          setError(null);
        }}
        className="flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
      >
        <Icon name="block" className="!text-sm" />
        Block
      </button>

      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xl w-full max-w-sm flex flex-col gap-4">
            <h3 className="font-headline-sm text-headline-sm text-primary">Block this patient?</h3>
            <p className="text-sm text-on-surface-variant">
              Future messages from this number will be dropped and not stored. This can be undone later.
            </p>
            <textarea
              autoFocus
              value={draftReason}
              onChange={(e) => setDraftReason(e.target.value)}
              placeholder="Reason for blocking (required)"
              rows={3}
              className="border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" disabled={saving} onClick={() => setShowPrompt(false)}>
                Cancel
              </Button>
              <Button variant="secondary" disabled={saving} onClick={handleConfirmBlock}>
                {saving ? "Blocking…" : "Block patient"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
