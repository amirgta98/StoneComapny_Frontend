"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getIcon } from "@/config/icons";
import type { NavSection } from "@/config";

type SidebarNavProps = {
  sections: NavSection[];
  className?: string;
};

export function SidebarNav({ sections, className }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-6", className)} aria-label="Dashboard navigation">
      {sections.map((section) => (
        <div key={section.title} className="space-y-1.5">
          <p className="px-3 text-xs font-semibold text-muted-foreground/80">
            {section.title}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon ? getIcon(item.icon as any) : null;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                      active
                        ? "bg-secondary text-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}