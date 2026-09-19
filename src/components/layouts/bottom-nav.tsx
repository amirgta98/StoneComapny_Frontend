"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getIcon } from "@/config/icons";
import type { NavSection } from "@/config";

type BottomNavProps = {
  sections: NavSection[];
};

export function BottomNav({ sections }: BottomNavProps) {
  const pathname = usePathname();

  // Flatten all items from sections
  const allItems = sections.flatMap((section) => section.items);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card p-0 lg:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="flex items-center justify-around">
        {allItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon ? getIcon(item.icon as any) : null;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 px-2 text-xs font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span className="line-clamp-1">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
