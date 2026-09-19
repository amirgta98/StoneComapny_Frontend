"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Layers, Shield, Sparkles, LogOut, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/config/icons";
import type { NavSection, NavItem } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/auth";

interface AdminSidebarProps {
  sections: NavSection[];
  className?: string;
  onItemClick?: () => void;
}

export function AdminSidebar({
  sections,
  className,
  onItemClick,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isItemActive = (href: string) => {
    if (href === "/superAdmin" || href === "/admin") {
      return pathname === "/superAdmin" || pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getBadgeVariant = (variant?: NavItem["badgeVariant"]) => {
    switch (variant) {
      case "warning":
        return "bg-amber-500/15 text-amber-700 border-amber-500/30";
      case "destructive":
        return "bg-destructive/15 text-destructive border-destructive/30";
      case "secondary":
        return "bg-secondary text-secondary-foreground border-border";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <aside
      className={cn(
        "flex h-full w-72 flex-col justify-between border-e border-border/80 bg-card text-card-foreground select-none",
        className
      )}
      aria-label="منوی ناوبری مدیریت پلتفرم"
    >
      {/* Top Header / Platform Brand */}
      <div>
        <div className="flex items-center gap-3 border-b border-border/70 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-amber-800 text-primary-foreground shadow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-foreground truncate">
                پلتفرم تخصصی سنگ
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              داشبورد ارشد سوپر ادمین
            </p>
          </div>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="max-h-[calc(100vh-14rem)] overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1">
                <p className="text-[11px] font-semibold text-muted-foreground/80">
                  {section.title}
                </p>
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isItemActive(item.href);
                  const Icon = item.icon ? getIcon(item.icon) : null;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onItemClick}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 ease-out",
                          active
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                            : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground active:scale-[0.99]"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {Icon && (
                            <Icon
                              className={cn(
                                "h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105",
                                active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                              )}
                            />
                          )}
                          <span className="truncate">{item.title}</span>
                        </div>

                        {/* Badge / Count */}
                        {item.badge ? (
                          <span
                            className={cn(
                              "rounded-md border px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                              active
                                ? "bg-white/20 text-primary-foreground border-white/30"
                                : getBadgeVariant(item.badgeVariant)
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronLeft
                            className={cn(
                              "h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100",
                              active && "opacity-100"
                            )}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Pinned Bottom Area: User info & logout */}
      <div className="border-t border-border/70 p-3 bg-secondary/30">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-card p-2.5 border border-border/60 shadow-2xs">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.name ?? "مدیر ارشد پلتفرم"}
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
              دسترسی سراسری SUPER_ADMIN
            </p>
          </div>
          <button
            onClick={() => void logout()}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="خروج از حساب ادمین"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
