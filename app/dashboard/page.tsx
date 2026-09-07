"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth";
import { listConversations, listEscalations, listPatients } from "@/lib/api";
import type { Conversation, Escalation, Patient } from "@/types";

const QUICK_LINKS = [
  { href: "/inbox", label: "Unified Inbox", icon: "mail", description: "Reply to WhatsApp leads and patients" },
  { href: "/triage", label: "Escalation Queue", icon: "emergency", description: "Review urgent and critical cases", doctorOnly: true },
  { href: "/calendar", label: "Calendar", icon: "calendar_month", description: "View this week's appointments" },
  { href: "/patients", label: "Patient Records", icon: "groups", description: "Search and open patient profiles" },
  { href: "/pharmacy", label: "Clinical Content", icon: "medication", description: "Medication orders & lab uploads", doctorOnly: true },
  { href: "/analytics", label: "Analytics", icon: "analytics", description: "Conversion funnel & engagement" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [escalations, setEscalations] = useState<Escalation[] | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listConversations(), listPatients()])
      .then(([convos, pats]) => {
        if (cancelled) return;
        setConversations(convos);
        setPatients(pats);
      })
      .finally(() => !cancelled && setLoading(false));

    // Escalations are restricted server-side to doctor/nurse/superadmin.
    if (isDoctor) {
      listEscalations().then((data) => !cancelled && setEscalations(data));
    }

    return () => {
      cancelled = true;
    };
  }, [isDoctor]);

  const warmLeads = conversations.filter((c) => c.status === "warm_lead").length;
  const bookedThisWeek = conversations.filter((c) => c.status === "booked").length;
  const openEscalations = escalations?.filter((e) => e.status === "OPEN").length ?? 0;

  return (
    <DashboardShell title="Gokavi Admin">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Welcome back
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
            Signed in as {user?.email} ({user?.title}).{" "}
            {isDoctor
              ? "Here's what needs clinical attention today."
              : "Here's what's happening at the front desk today."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
          <Card className="p-6">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
              Open Escalations
            </p>
            {isDoctor ? (
              <>
                <p className="font-headline-lg text-headline-lg text-error">
                  {loading || escalations === null ? "–" : openEscalations}
                </p>
                <p className="text-sm text-on-surface-variant mt-1">patients waiting in triage</p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Icon name="lock" className="!text-[18px]" />
                <span className="text-sm">Doctor/Nurse access</span>
              </div>
            )}
          </Card>
          <Card className="p-6">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
              Warm Leads
            </p>
            <p className="font-headline-lg text-headline-lg text-primary">{loading ? "–" : warmLeads}</p>
            <p className="text-sm text-on-surface-variant mt-1">conversations awaiting reply</p>
          </Card>
          <Card className="p-6">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
              Registered Patients
            </p>
            <p className="font-headline-lg text-headline-lg text-primary">{loading ? "–" : patients.length}</p>
            <p className="text-sm text-on-surface-variant mt-1">{bookedThisWeek} with a booked appointment</p>
          </Card>
        </div>

        <div>
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {QUICK_LINKS.filter((link) => !link.doctorOnly || isDoctor).map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="p-6 h-full hover:-translate-y-0.5 transition-transform hover:shadow-md">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed mb-4">
                    <Icon name={link.icon} />
                  </div>
                  <p className="font-button text-button text-primary mb-1">{link.label}</p>
                  <p className="text-sm text-on-surface-variant">{link.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
