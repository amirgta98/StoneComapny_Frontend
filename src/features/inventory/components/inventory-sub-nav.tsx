"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Bookmark,
  Building,
  ArrowLeftRight,
  ClipboardCheck,
  Sliders,
  AlertTriangle,
  FileBarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard/inventory", label: "داشبورد انبار", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/inventory/products", label: "سنگ‌ها و اسلب‌ها", icon: Layers },
  { href: "/dashboard/inventory/receipts", label: "رسیدهای ورود", icon: ArrowDownLeft },
  { href: "/dashboard/inventory/issues", label: "حواله‌های خروج", icon: ArrowUpRight },
  { href: "/dashboard/inventory/movements", label: "کاردکس و گردش", icon: History },
  { href: "/dashboard/inventory/reservations", label: "رزروها", icon: Bookmark },
  { href: "/dashboard/inventory/locations", label: "موقعیت‌های انبار", icon: Building },
  { href: "/dashboard/inventory/transfers", label: "انتقال بین‌انبار", icon: ArrowLeftRight },
  { href: "/dashboard/inventory/counts", label: "انبارگردانی", icon: ClipboardCheck },
  { href: "/dashboard/inventory/adjustments", label: "تعدیلات", icon: Sliders },
  { href: "/dashboard/inventory/alerts", label: "هشدارها", icon: AlertTriangle },
  { href: "/dashboard/inventory/reports", label: "ارزش و گزارشات", icon: FileBarChart2 },
];

export function InventorySubNav() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-border/80 bg-card/60 backdrop-blur-md sticky top-0 z-20 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-1.5 px-4 py-2.5 min-w-max">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
