"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Icon } from "@/components/ui/Icon";
import { triageSummary } from "@/lib/mockData";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  doctorOnly?: boolean;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/triage", label: "Triage", icon: "emergency", badge: triageSummary.critical + triageSummary.urgent },
  { href: "/patients", label: "Patient Records", icon: "groups" },
  { href: "/inbox", label: "Inbox", icon: "mail" },
  { href: "/calendar", label: "Calendar", icon: "calendar_month" },
  { href: "/pharmacy", label: "Pharmacy", icon: "medication", doctorOnly: true },
  { href: "/analytics", label: "Analytics", icon: "analytics" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role ?? "receptionist";

  return (
    <nav className="hidden md:flex bg-surface h-screen w-sidebar-width flex-col border-r border-outline-variant fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
            G
          </div>
          <div className="min-w-0">
            <h1 className="font-headline-md text-headline-md text-primary text-lg truncate">
              Gokavi Hospital
            </h1>
            <p
              className={cn(
                "text-sm truncate",
                role === "doctor" ? "text-secondary font-semibold" : "text-on-surface-variant",
              )}
            >
              {user?.title ?? "Receptionist"}
            </p>
          </div>
        </div>
        <button className="mt-6 w-full py-2.5 px-4 bg-secondary text-on-secondary rounded-lg font-button text-button flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(169,51,73,0.39)] hover:opacity-90 transition-opacity">
          <Icon name="add" className="!text-sm" />
          New Admission
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const locked = item.doctorOnly && role !== "doctor";

            if (locked) {
              return (
                <li key={item.href}>
                  <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-outline-variant cursor-not-allowed"
                    title="Doctor access only"
                  >
                    <Icon name={item.icon} />
                    <span className="flex-1">{item.label}</span>
                    <Icon name="lock" className="!text-[16px]" />
                  </div>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    active
                      ? "text-primary font-bold border-r-4 border-secondary bg-surface-container-low"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low",
                  )}
                >
                  <Icon name={item.icon} filled={active} />
                  <span className="flex-1">{item.label}</span>
                  {!!item.badge && (
                    <span className="bg-error text-on-error rounded-full px-2 py-0.5 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4 border-t border-outline-variant">
        <ul className="space-y-1 px-3 mb-3">
          <li>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors" href="#">
              <Icon name="settings" />
              <span>Settings</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors" href="#">
              <Icon name="help" />
              <span>Support</span>
            </a>
          </li>
        </ul>
        {user && (
          <div className="flex items-center gap-3 px-3 pt-3 border-t border-outline-variant/50">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
              <Icon name="person" className="!text-[18px]" filled />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-primary truncate">{user.name}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-label-caps text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                <Icon name="verified_user" className="!text-[12px]" />
                Authenticated
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
