"use client";

import { useState } from "react";
import { ManagerSidebar } from "./manager-sidebar";
import { ManagerHeader } from "./manager-header";
import { managerNav } from "@/config/navigation";
import { useAuth } from "@/auth";
import { getManagerDashboardData } from "../../data/mock-manager-data";
import type { ManagerDashboardData } from "../../types";

interface ManagerShellProps {
  children: React.ReactNode;
  data?: ManagerDashboardData;
}

export function ManagerShell({ children, data: propData }: ManagerShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const activeTenantId = user?.tenantId ?? "tenant-001";
  const data = propData ?? getManagerDashboardData(activeTenantId);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground" dir="rtl">
      {/* Top Header */}
      <ManagerHeader
        data={data}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sticky Sidebar */}
        <div className="hidden lg:block lg:w-72 shrink-0">
          <div className="sticky top-16 h-[calc(100vh-4rem)]">
            <ManagerSidebar sections={managerNav} data={data} />
          </div>
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <div className="fixed inset-y-0 start-0 z-50 flex w-72 flex-col bg-card shadow-xl animate-in slide-in-from-start duration-300">
              <ManagerSidebar
                sections={managerNav}
                data={data}
                onItemClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
