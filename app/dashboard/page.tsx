"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth";
import { conversations, patients, triageSummary } from "@/lib/mockData";

const QUICK_LINKS = [
  { href: "/inbox", label: "Unified Inbox", icon: "mail", description: "Reply to WhatsApp leads and patients" },
  { href: "/triage", label: "Escalation Queue", icon: "emergency", description: "Review urgent and critical cases" },
  { href: "/calendar", label: "Calendar", icon: "calendar_month", description: "View this week's appointments" },
  { href: "/patients", label: "Patient Records", icon: "groups", description: "Search and open patient profiles" },
  { href: "/pharmacy", label: "Clinical Content", icon: "medication", description: "Medication orders & lab uploads", doctorOnly: true },
  { href: "/analytics", label: "Analytics", icon: "analytics", description: "Conversion funnel & engagement" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";
  const bookedToday = conversations.filter((c) => c.status === "booked").length;
  const warmLeads = conversations.filter((c) => c.status === "warm_lead").length;

  return (
    <DashboardShell title="Gokavi Admin">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Welcome back, {user?.name ?? "there"}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
            {isDoctor
              ? "Here's what needs clinical attention today."
              : "Here's what's happening at the front desk today."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
          <Card className="p-6">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
              Critical + Urgent
            </p>
            <p className="font-headline-lg text-headline-lg text-error">
              {triageSummary.critical + triageSummary.urgent}
            </p>
            <p className="text-sm text-on-surface-variant mt-1">patients waiting in triage</p>
          </Card>
          <Card className="p-6">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
              Warm Leads
            </p>
            <p className="font-headline-lg text-headline-lg text-primary">{warmLeads}</p>
            <p className="text-sm text-on-surface-variant mt-1">conversations awaiting reply</p>
          </Card>
          <Card className="p-6">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
              Registered Patients
            </p>
            <p className="font-headline-lg text-headline-lg text-primary">{patients.length}</p>
            <p className="text-sm text-on-surface-variant mt-1">{bookedToday} booked this week</p>
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
