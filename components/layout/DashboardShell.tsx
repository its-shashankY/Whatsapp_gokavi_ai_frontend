"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardShellProps {
  children: ReactNode;
  title?: string;
  searchPlaceholder?: string;
  /** Render children edge-to-edge instead of inside the default padded canvas. */
  bare?: boolean;
}

export function DashboardShell({
  children,
  title,
  searchPlaceholder,
  bare = false,
}: DashboardShellProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface-variant">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-sidebar-width flex flex-col min-h-screen">
        <Topbar title={title} searchPlaceholder={searchPlaceholder} />
        {bare ? (
          children
        ) : (
          <div className="flex-1 p-container-padding-mobile md:p-container-padding-desktop">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
