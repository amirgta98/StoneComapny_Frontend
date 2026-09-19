"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/config";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  slogan?: string;
};

export function MobileNav({ open, onClose, items, slogan }: MobileNavProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, pathname]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="منوی پیمایش"
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] transform flex flex-col shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div className="flex items-center justify-between border-b px-4 py-4" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-medium text-muted-foreground">{slogan || "پیمایش"}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن منو"
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center rounded-md px-4 py-3 text-base font-medium transition-colors",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}