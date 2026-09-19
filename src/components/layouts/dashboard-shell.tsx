import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BottomNav } from "./bottom-nav";
import type { NavSection } from "@/config";

type DashboardShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
  navSections?: NavSection[];
};

export function DashboardShell({ sidebar, children, className, navSections }: DashboardShellProps) {
  return (
    <>
      <div className={cn("flex min-h-screen flex-1", className)}>
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-e border-border bg-card p-4 overflow-y-auto lg:block">
          {sidebar}
        </aside>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">{children}</main>
      </div>
      {navSections && <BottomNav sections={navSections} />}
    </>
  );
}