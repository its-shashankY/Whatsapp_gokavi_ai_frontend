"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { createMedicationOrder } from "@/lib/api";

const ROUTES = [
  { value: "ORAL", label: "Oral (PO)" },
  { value: "SUBCUTANEOUS", label: "Subcutaneous (SC)" },
  { value: "INTRAMUSCULAR", label: "Intramuscular (IM)" },
  { value: "VAGINAL", label: "Vaginal" },
  { value: "NASAL", label: "Nasal" },
];

const EMPTY_FORM = {
  drugName: "",
  doseValue: "",
  doseUnit: "mg",
  route: "SUBCUTANEOUS",
  timeOfDay: "09:00",
  startDate: new Date().toISOString().slice(0, 10),
  durationDays: "",
  isCritical: false,
};

export function MedicationOrderForm({ patientId }: { patientId: string }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClear = () => {
    setForm(EMPTY_FORM);
    setFeedback(null);
  };

  const handleSubmit = async () => {
    if (!form.drugName.trim() || !form.doseValue) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const endDate = form.durationDays
        ? new Date(new Date(form.startDate).getTime() + Number(form.durationDays) * 86_400_000)
            .toISOString()
            .slice(0, 10)
        : null;
      await createMedicationOrder({
        patientId,
        drugName: form.drugName.trim(),
        doseValue: Number(form.doseValue),
        doseUnit: form.doseUnit,
        route: form.route,
        timeOfDay: `${form.timeOfDay}:00`,
        startDate: form.startDate,
        endDate,
        isCritical: form.isCritical,
      });
      setFeedback(`${form.drugName} order signed and submitted.`);
      setForm(EMPTY_FORM);
    } catch {
      setFeedback("Failed to submit medication order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 card-shadow">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <Icon name="prescriptions" className="text-tertiary" filled />
          <h3 className="font-headline-md text-headline-md text-on-surface">Medication Order</h3>
        </div>
        <Icon name="lock_person" className="text-error" />
      </div>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block font-label-caps text-label-caps text-primary mb-2">
            DRUG NAME (GENERIC/BRAND)
          </label>
          <div className="relative">
            <input
              className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 pl-10 font-body-md text-body-md outline-none"
              placeholder="e.g., Gonal-f RFF"
              type="text"
              value={form.drugName}
              onChange={(e) => update("drugName", e.target.value)}
            />
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-label-caps text-label-caps text-primary mb-2">DOSE</label>
            <input
              className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 font-body-md text-body-md outline-none"
              placeholder="e.g., 150"
              type="number"
              value={form.doseValue}
              onChange={(e) => update("doseValue", e.target.value)}
            />
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-primary mb-2">UNIT</label>
            <select
              className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 font-body-md text-body-md"
              value={form.doseUnit}
              onChange={(e) => update("doseUnit", e.target.value)}
            >
              <option value="mg">mg</option>
              <option value="mcg">mcg</option>
              <option value="mL">mL</option>
              <option value="IU">IU</option>
            </select>
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-primary mb-2">ROUTE</label>
            <select
              className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 font-body-md text-body-md"
              value={form.route}
              onChange={(e) => update("route", e.target.value)}
            >
              {ROUTES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-label-caps text-label-caps text-primary mb-2">TIME OF DAY</label>
            <input
              className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 font-body-md text-body-md outline-none"
              type="time"
              value={form.timeOfDay}
              onChange={(e) => update("timeOfDay", e.target.value)}
            />
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-primary mb-2">START DATE</label>
            <input
              className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 font-body-md text-body-md outline-none"
              type="date"
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
            />
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-primary mb-2">DURATION</label>
            <div className="flex items-center gap-2">
              <input
                className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 font-body-md text-body-md outline-none"
                placeholder="Days"
                type="number"
                value={form.durationDays}
                onChange={(e) => update("durationDays", e.target.value)}
              />
              <span className="text-on-surface-variant font-body-md">days</span>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer select-none">
          <input
            type="checkbox"
            className="accent-secondary"
            checked={form.isCritical}
            onChange={(e) => update("isCritical", e.target.checked)}
          />
          Critical dose (e.g. trigger shot) — missed doses escalate immediately
        </label>

        {feedback && <p className="text-sm text-secondary">{feedback}</p>}

        <div className="flex justify-end pt-4 border-t border-outline-variant/20 gap-3">
          <button
            className="px-6 py-2 rounded-lg border border-primary text-primary font-button text-button hover:bg-primary/5 transition-colors"
            type="button"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-secondary text-on-secondary font-button text-button hover:opacity-90 shadow-sm flex items-center gap-2 disabled:opacity-50"
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !form.drugName.trim() || !form.doseValue}
          >
            <Icon name="signature" className="!text-[20px]" />
            {submitting ? "Submitting..." : "Sign & Submit Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
