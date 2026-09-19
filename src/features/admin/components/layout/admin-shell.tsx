"use client";

import { useState } from "react";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { adminNav } from "@/config/navigation";
import type { NavSection } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
  navSections?: NavSection[];
  className?: string;
}

export function AdminShell({
  children,
  navSections = adminNav,
  className,
}: AdminShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground" dir="rtl">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:shrink-0">
        <AdminSidebar sections={navSections} />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 start-0 z-50 w-72 max-w-[85vw] shadow-2xl transition-transform duration-300">
            <AdminSidebar
              sections={navSections}
              onItemClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Dedicated Admin Header */}
        <AdminHeader
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Scrollable Page Body */}
        <main className={cn("flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
