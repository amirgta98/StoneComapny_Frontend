"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Bell,
  ExternalLink,
  Building2,
  Menu,
  X,
  LogOut,
  User,
  Plus,
  Store,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/auth";
import type { ManagerDashboardData } from "../../types";

interface ManagerHeaderProps {
  data: ManagerDashboardData;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function ManagerHeader({
  data,
  onMobileMenuToggle,
  isMobileMenuOpen,
}: ManagerHeaderProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const publicUrl = data.domain ? `https://${data.domain}` : "/";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-card/95 px-4 backdrop-blur-md sm:px-6">
      {/* Right side (RTL start): Mobile toggle & Factory Identity / Search */}
      <div className="flex items-center gap-3 lg:gap-4 min-w-0">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background p-1.5 text-foreground hover:bg-secondary lg:hidden"
          aria-label="باز کردن منوی مدیریت کارخانه"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Factory Brand Header Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-600/15 text-amber-700 border border-amber-500/25 font-bold shadow-xs">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground truncate">
                {data.tenantName}
              </span>
              <Badge
                variant="outline"
                className="hidden sm:inline-flex border-amber-600/30 bg-amber-500/10 text-[10px] font-semibold text-amber-700"
              >
                صاحب کارخانه (MANAGER)
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate hidden xs:block" dir="ltr">
              {data.subdomain ?? "factory.stoneplatform.ir"}
            </p>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative hidden md:block w-52 lg:w-72 ms-2">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="جستجوی اسلب، سفارش، استعلام..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full bg-secondary/60 pe-4 ps-9 text-xs placeholder:text-muted-foreground focus:bg-background"
          />
        </div>
      </div>

      {/* Left side (RTL end): Actions, Storefront link, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Add Product CTA */}
        <Button
          asChild
          size="sm"
          className="hidden sm:inline-flex h-9 gap-1.5 text-xs font-semibold shadow-xs"
        >
          <Link href="/dashboard/products/new">
            <Plus className="h-3.5 w-3.5" />
            <span>ثبت سنگ جدید</span>
          </Link>
        </Button>

        {/* Live Factory Storefront Link */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link href={publicUrl} target="_blank" rel="noopener noreferrer">
            <Store className="h-3.5 w-3.5" />
            <span className="hidden md:inline">مشاهده شوروم کارخانه</span>
            <ExternalLink className="h-3 w-3 hidden sm:inline opacity-70" />
          </Link>
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-lg hover:bg-secondary"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1.5 end-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-600 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-600" />
              </span>
              <span className="sr-only">اعلان‌های کارخانه</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2">
            <DropdownMenuLabel className="flex items-center justify-between pb-2 text-xs font-semibold">
              <span>اعلان‌های سفارش و تولید</span>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                {data.pendingInquiries.length} استعلام جدید
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 py-1 text-xs">
              <div className="rounded-lg bg-secondary/50 p-2.5 transition-colors hover:bg-secondary">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">
                    استعلام متراژ پروژه جدید
                  </p>
                  <span className="text-[10px] text-amber-700 font-medium">فوری</span>
                </div>
                <p className="text-muted-foreground mt-0.5">
                  مهندس شفیعی برای ۴۵۰ متر اسلب لاشتر بوش‌همر استعلام قیمت ثبت کرد.
                </p>
                <span className="mt-1 block text-[10px] text-muted-foreground/70">
                  ۳۰ دقیقه پیش
                </span>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2.5 transition-colors hover:bg-secondary">
                <p className="font-semibold text-foreground">
                  تأیید سفارش برش اسلب
                </p>
                <p className="text-muted-foreground mt-0.5">
                  سفارش شماره ORD-SC-1021 آماده ورود به مرحله ساب و اپوکسی است.
                </p>
                <span className="mt-1 block text-[10px] text-muted-foreground/70">
                  ۲ ساعت پیش
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <Link
              href="/dashboard/inquiries"
              className="block rounded-md p-2 text-center text-xs font-medium text-primary hover:bg-secondary"
            >
              مشاهده همه استعلام‌ها و سفارش‌ها
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Manager Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl border border-border/80 bg-background px-2.5 py-1.5 text-xs transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600/15 font-bold text-amber-800">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden text-start sm:block">
                <p className="font-medium text-foreground leading-none">
                  {user?.name ?? "مدیر کارخانه"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  صاحب کارخانه سنگ
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 p-1.5">
            <DropdownMenuLabel className="p-2">
              <p className="font-medium text-foreground text-xs">
                {user?.name ?? "مدیر کارخانه"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {user?.phone ?? "۰۹۱۲۰۰۰۰۰۰۲"}
              </p>
              <div className="mt-2 flex flex-col gap-1">
                <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-800 border-amber-500/30">
                  نقش: MANAGER (صاحب کارخانه)
                </Badge>
                <span className="text-[10px] text-muted-foreground font-mono" dir="ltr">
                  tenantId: {data.tenantId}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer text-xs">
                مشخصات و تنظیمات کارخانه
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/theme" className="cursor-pointer text-xs">
                تنظیمات قالب و هویت بصری
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => void logout()}
              className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5 me-2" />
              خروج از حساب کارخانه
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
