"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Bell,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  User,
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

interface AdminHeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function AdminHeader({
  onMobileMenuToggle,
  isMobileMenuOpen,
}: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-card/95 px-4 backdrop-blur-md sm:px-6">
      {/* Right side (in RTL): Mobile toggle & Title / Quick Search */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background p-1.5 text-foreground hover:bg-secondary lg:hidden"
          aria-label="باز کردن منوی مدیریت"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Brand Chip on Header */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                پنل مدیریت پلتفرم
              </span>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-[10px] font-semibold text-primary"
              >
                SUPER_ADMIN
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              سامانه یکپارچه معاملات و کارخانجات سنگ
            </p>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="جستجوی شرکت، سنگ، سفارش، کاربر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full bg-secondary/60 pe-4 ps-9 text-xs placeholder:text-muted-foreground focus:bg-background"
          />
        </div>
      </div>

      {/* Left side (in RTL): Status pill, Portal Link, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* System Health Pill */}
        <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>سرور پایدار (۹۹.۹۸٪)</span>
        </div>

        {/* View Public Storefront Link */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">مشاهده فروشگاه عمومی</span>
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
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="sr-only">اعلان‌های سیستمی</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2">
            <DropdownMenuLabel className="flex items-center justify-between pb-2 text-xs font-semibold">
              <span>اعلان‌های مدیریت پلتفرم</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                ۳ مورد جدید
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 py-1 text-xs">
              <div className="rounded-lg bg-secondary/50 p-2.5 transition-colors hover:bg-secondary">
                <p className="font-semibold text-foreground">
                  درخواست عضویت شرکت سنگ جدید
                </p>
                <p className="text-muted-foreground">
                  کارخانه گرانیت مروارید مشهد مدارک خود را ارسال کرد.
                </p>
                <span className="mt-1 block text-[10px] text-muted-foreground/70">
                  ۱۰ دقیقه پیش
                </span>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2.5 transition-colors hover:bg-secondary">
                <p className="font-semibold text-foreground">
                  استعلام عمده سنگ پروژه
                </p>
                <p className="text-muted-foreground">
                  استعلام ۸۵۰ مترمربع تراورتن دره بخاری دریافت شد.
                </p>
                <span className="mt-1 block text-[10px] text-muted-foreground/70">
                  ۱ ساعت پیش
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <Link
              href="/superAdmin/security/logs"
              className="block rounded-md p-2 text-center text-xs font-medium text-primary hover:bg-secondary"
            >
              مشاهده همه لاگ‌ها و رویدادها
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Admin Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl border border-border/80 bg-background px-2.5 py-1.5 text-xs transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 font-bold text-primary">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden text-start sm:block">
                <p className="font-medium text-foreground leading-none">
                  {user?.name ?? "مدیر ارشد سیستم"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  مدیر کل پلتفرم
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5">
            <DropdownMenuLabel className="p-2">
              <p className="font-medium text-foreground text-xs">
                {user?.name ?? "مدیر کل پلتفرم"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {user?.phone ?? "admin@stoneplatform.com"}
              </p>
              <Badge variant="outline" className="mt-2 text-[10px] bg-secondary">
                سطح دسترسی: SUPER_ADMIN
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/superAdmin/settings" className="cursor-pointer text-xs">
                تنظیمات سیستم
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/superAdmin/security/logs" className="cursor-pointer text-xs">
                لاگ‌های امنیتی
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => void logout()}
              className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5 me-2" />
              خروج از حساب ادمین
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
