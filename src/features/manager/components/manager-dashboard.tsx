"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  Plus,
  Store,
  Layers,
  Sparkles,
  ShieldCheck,
  PackagePlus,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { canAccessTenantResource, useAuth } from "@/auth";
import { getManagerDashboardData } from "../data/mock-manager-data";
import { FactoryKpiCards } from "./factory-kpi-cards";
import { FactoryProductionPipeline } from "./factory-production-pipeline";
import { FactoryOrdersTable } from "./factory-orders-table";
import { FactoryInquiriesCard } from "./factory-inquiries-card";
import { FactoryInventoryOverview } from "./factory-inventory-overview";
import { FactorySalesChart } from "./factory-sales-chart";

export function ManagerDashboard() {
  const { user } = useAuth();

  // If user is not logged in or doesn't have a role, fallback gracefully
  if (!user) return null;

  // Resolve tenant: MANAGER is strictly tied to user.tenantId.
  // SUPER_ADMIN (when visiting manager dashboard) defaults to tenant-001.
  const targetTenantId = user.tenantId ?? "tenant-001";

  // Enforce Tenant Scoping check (access-control skill §6 & §9.2)
  const hasAccess = canAccessTenantResource(user, targetTenantId);
  if (!hasAccess) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center" dir="rtl">
        <h2 className="text-lg font-bold text-destructive">عدم دسترسی به این کارخانه</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          حساب کاربری شما مجاز به مشاهده داده‌های این واحد صنعتی نیست (ایزولاسیون تننت).
        </p>
      </div>
    );
  }

  const data = getManagerDashboardData(targetTenantId);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Welcome / Factory Identity Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-amber-950/10 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600/15 text-amber-700">
                <Building2 className="h-4 w-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                مرکز فرماندهی {data.tenantName}
              </h1>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 text-xs font-semibold"
              >
                کارخانه فعال و متصل
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              مدیریت جامع خط تولید و برش اسلب، دپوی انبار سنگ، سفارش‌های در حال فرآوری و پاسخ به استعلام‌های معماران.
            </p>

            {/* Quick Metadata tags */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                حوزه دسترسی: <strong className="text-foreground">مدیر واحد صنعتی ({user.role})</strong>
              </span>
              <span>·</span>
              <span className="font-mono text-[11px]" dir="ltr">
                شناسه کارخانه: {data.tenantId}
              </span>
              <span>·</span>
              <span>
                مجموع متراژ دپو: <strong className="text-foreground">{data.summary.totalStockSqm.toLocaleString("fa-IR")} م²</strong>
              </span>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button asChild size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
              <Link href="/dashboard/products/new">
                <Plus className="h-4 w-4" />
                <span>افزودن محصول جدید</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <Link href="/dashboard/inventory">
                <PackagePlus className="h-3.5 w-3.5" />
                <span>مدیریت دپو و انبار</span>
              </Link>
            </Button>
            {data.domain && (
              <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <Link href={`https://${data.domain}`} target="_blank" rel="noopener noreferrer">
                  <Store className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">مشاهده شوروم</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute end-0 top-0 -me-12 -mt-12 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards (۴ شاخص کلیدی کارخانه سنگ) */}
      <FactoryKpiCards kpis={data.kpis} />

      {/* Production Pipeline Tracker (خط تولید و فرآوری سنگ) */}
      <FactoryProductionPipeline stages={data.productionStages} />

      {/* Grid: Sales Trend Chart (2 cols) & Architectural Inquiries RFQs (1 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2">
          <FactorySalesChart data={data.salesTrend} />
        </div>
        <div className="lg:col-span-1">
          <FactoryInquiriesCard inquiries={data.pendingInquiries} />
        </div>
      </div>

      {/* Grid: Recent Orders (2 cols) & Stone Inventory Overview (1 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2">
          <FactoryOrdersTable orders={data.recentOrders} />
        </div>
        <div className="lg:col-span-1">
          <FactoryInventoryOverview items={data.inventoryStatus} />
        </div>
      </div>
    </div>
  );
}
