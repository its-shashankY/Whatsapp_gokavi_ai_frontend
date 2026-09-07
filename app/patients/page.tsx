"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Avatar } from "@/components/ui/Avatar";
import { StatusTag } from "@/components/ui/StatusTag";
import { Icon } from "@/components/ui/Icon";
import { listPatients } from "@/lib/api";
import type { Patient } from "@/types";

export default function PatientRecordsPage() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listPatients()
      .then((data) => !cancelled && setPatients(data))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = patients.filter(
    (p) =>
      (p.name ?? "").toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query) ||
      p.id.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <DashboardShell title="Gokavi Admin">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Patient Records</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Search and open a patient's full clinical profile.
          </p>
        </div>

        <div className="relative max-w-md">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            placeholder="Search by name or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant card-shadow divide-y divide-surface-variant overflow-hidden">
          {loading && <p className="p-6 text-center text-on-surface-variant text-sm">Loading patients...</p>}
          {!loading &&
            filtered.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors"
              >
                <Avatar name={patient.name ?? "?"} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="font-button text-button text-primary truncate">
                    {patient.name ?? "Unknown Contact"}
                  </p>
                  <p className="text-sm text-on-surface-variant truncate">{patient.phone}</p>
                </div>
                <StatusTag status={patient.status} />
                <Icon name="chevron_right" className="text-on-surface-variant flex-shrink-0" />
              </Link>
            ))}
          {!loading && filtered.length === 0 && (
            <p className="p-6 text-center text-on-surface-variant text-sm">No patients match your search.</p>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
