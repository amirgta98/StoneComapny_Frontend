"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Store,
  Search,
  RotateCcw,
  RefreshCw,
  Save,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Home,
  Layers,
  Images,
  Building,
  Info,
  PhoneCall,
  FileSpreadsheet,
  ShoppingBag,
  BookOpen,
  Award,
  FileText,
  Shield,
  HelpCircle,
  Sparkles,
  Boxes,
  Gem,
  Compass,
  Grid,
  User,
  Truck,
  Heart,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNavigationStore } from "../stores/navigation-store";
import { NAV_SECTIONS } from "../data/mock-navigation-pages";
import { NavigationStatsCards } from "./navigation-stats-cards";
import { NavigationTableSkeleton } from "./navigation-table-skeleton";
import { NavigationEmptyState } from "./navigation-empty-state";
import type { NavFilterSection, NavFilterVisibility, NavSortOption } from "../types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Layers,
  Images,
  Building,
  Info,
  PhoneCall,
  FileSpreadsheet,
  ShoppingBag,
  BookOpen,
  Award,
  FileText,
  Shield,
  HelpCircle,
  Sparkles,
  Boxes,
  Gem,
  Compass,
  Grid,
  User,
  Truck,
  Heart,
};

export function NavigationManagerView() {
  const {
    pages,
    autoSave,
    isLoading,
    isSaving,
    searchQuery,
    sectionFilter,
    visibilityFilter,
    sortBy,
    selectedIds,
    initFromStorage,
    simulateReload,
    resetToDefaults,
    setSearchQuery,
    setSectionFilter,
    setVisibilityFilter,
    setSortBy,
    clearFilters,
    toggleSelectPage,
    selectAllVisible,
    clearSelection,
    toggleAutoSave,
    togglePageVisibility,
    bulkSetVisibility,
    saveChanges,
    discardChanges,
    hasUnsavedChanges,
    getStats,
    getFilteredPages,
  } = useNavigationStore();

  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // Initialize storage state on client mount
  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  const stats = useMemo(() => getStats(), [getStats, pages]);
  const filteredPages = useMemo(() => getFilteredPages(), [getFilteredPages, pages, searchQuery, sectionFilter, visibilityFilter, sortBy]);
  const isDirty = hasUnsavedChanges();

  const handleCopyPath = (path: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(path);
      setCopiedPath(path);
      toast.info(`آدرس «${path}» در کلیپ‌بورد کپی شد.`);
      setTimeout(() => setCopiedPath(null), 2000);
    }
  };

  const handleResetConfirm = () => {
    if (window.confirm("آیا از بازنشانی کلیه منوها و دیده‌بانی صفحات به حالت پیش‌فرض کارخانه اطمینان دارید؟")) {
      resetToDefaults();
    }
  };

  const allFilteredSelected =
    filteredPages.length > 0 &&
    filteredPages.every((p) => selectedIds.includes(p.id));

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    sectionFilter !== "all" ||
    visibilityFilter !== "all";

  if (isLoading) {
    return <NavigationTableSkeleton />;
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Store className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              مدیریت دیده‌بانی و منوهای سایت کارخانه
            </h1>
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-[11px] font-bold text-primary"
            >
              {stats.total.toLocaleString("fa-IR")} صفحه
            </Badge>
          </div>
          <p className="mt-2 text-xs text-muted-foreground max-w-2xl leading-relaxed">
            صفحاتی که مایلید مشتریان و معماران در منوی ناوبری بالای سایت، فوتر و منوی موبایل مشاهده کنند را با کلیدهای زیر فعال یا مخفی نمایید.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Auto-Save Toggle Pill */}
          <div
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-colors ${
              autoSave
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "border-border/80 bg-secondary/50 text-muted-foreground"
            }`}
          >
            <span className="text-xs font-medium">ذخیره خودکار:</span>
            <Switch
              checked={autoSave}
              onCheckedChange={toggleAutoSave}
              aria-label="تغییر حالت ذخیره خودکار"
              className="scale-90"
            />
            <span className="text-[11px] font-bold">
              {autoSave ? "روشن" : "دستی"}
            </span>
          </div>

          {/* Reload / Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => simulateReload()}
            disabled={isLoading || isSaving}
            title="بارگذاری مجدد و بررسی آخرین وضعیت منوها"
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">بروزرسانی</span>
          </Button>

          {/* Reset Defaults */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetConfirm}
            title="بازنشانی به مقادیر اولیه"
            className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">پیش‌فرض</span>
          </Button>

          {/* Save Changes Button (Especially for manual mode) */}
          <Button
            size="sm"
            onClick={() => saveChanges()}
            disabled={isSaving || (!isDirty && !autoSave)}
            className={`h-9 gap-1.5 text-xs font-bold shadow-xs transition-all ${
              isDirty
                ? "bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse"
                : ""
            }`}
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
            {isDirty && (
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </Button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <NavigationStatsCards stats={stats} />

      {/* Section Quick Summary Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-primary" />
          <span className="font-semibold text-foreground">بخش‌های ناوبری وبگاه:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          {NAV_SECTIONS.map((sec) => {
            const count = pages.filter((p) => p.section === sec.id).length;
            const visibleCount = pages.filter(
              (p) => p.section === sec.id && p.isVisible
            ).length;
            return (
              <button
                key={sec.id}
                onClick={() =>
                  setSectionFilter(
                    sectionFilter === sec.id ? "all" : (sec.id as NavFilterSection)
                  )
                }
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 border transition-all ${
                  sec.badgeClass
                } ${
                  sectionFilter === sec.id
                    ? "ring-2 ring-primary ring-offset-1 font-bold"
                    : "opacity-85 hover:opacity-100"
                }`}
              >
                <span>{sec.label}</span>
                <span className="rounded-full bg-background/80 px-1.5 py-0.2 text-[10px] tabular-nums text-foreground font-semibold">
                  {visibleCount} از {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar: Search, Filters, Sorting & Bulk Actions */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی نام صفحه، آدرس URL، اسلاگ..."
              className="ps-9 pe-8 text-xs h-9 bg-card"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Sorting Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Section Filter */}
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value as NavFilterSection)}
              className="h-9 rounded-lg border border-border/80 bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">همه بخش‌ها ({pages.length})</option>
              <option value="header">منوی اصلی هدر ({stats.headerCount})</option>
              <option value="footer_main">فوتر - پیوندهای سریع</option>
              <option value="footer_stones">فوتر - دسته‌بندی سنگ‌ها</option>
              <option value="mobile_account">منوی موبایل و حساب کاربری ({stats.mobileCount})</option>
            </select>

            {/* Visibility Status Filter */}
            <select
              value={visibilityFilter}
              onChange={(e) =>
                setVisibilityFilter(e.target.value as NavFilterVisibility)
              }
              className="h-9 rounded-lg border border-border/80 bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">وضعیت: همه ({pages.length})</option>
              <option value="visible">فقط نمایان در منو ({stats.visibleCount})</option>
              <option value="hidden">فقط مخفی از منو ({stats.hiddenCount})</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as NavSortOption)}
              className="h-9 rounded-lg border border-border/80 bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="order">مرتب‌سازی: پیش‌فرض ساختار</option>
              <option value="title">مرتب‌سازی: بر اساس عنوان</option>
              <option value="path">مرتب‌سازی: بر اساس آدرس URL</option>
              <option value="section">مرتب‌سازی: تفکیک بخش‌ها</option>
            </select>

            {/* Clear Filters (if active) */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5 me-1" />
                <span>پاک‌کردن فیلترها</span>
              </Button>
            )}
          </div>
        </div>

        {/* Bulk Actions Bar (When items are selected) */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs">
                {selectedIds.length}
              </span>
              <span className="font-semibold text-foreground">
                صفحه از لیست انتخاب شده است.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkSetVisibility(true)}
                className="h-8 gap-1 text-xs border-emerald-500/40 bg-card hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>نمایش همه در منو</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkSetVisibility(false)}
                className="h-8 gap-1 text-xs border-amber-500/40 bg-card hover:bg-amber-500/10 text-amber-700 dark:text-amber-400"
              >
                <EyeOff className="h-3.5 w-3.5" />
                <span>مخفی کردن همه</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={clearSelection}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <span>لغو انتخاب</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Pages Table / List */}
      {filteredPages.length === 0 ? (
        <NavigationEmptyState
          searchQuery={searchQuery}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/50 text-[11px] font-semibold text-muted-foreground border-b border-border/70">
                <tr>
                  {/* Bulk Select Checkbox */}
                  <th className="py-3 px-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={() =>
                        selectAllVisible(filteredPages.map((p) => p.id))
                      }
                      aria-label="انتخاب همه صفحات فیلترشده"
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 text-start">عنوان صفحه و شناسنامه</th>
                  <th className="py-3 px-3 text-start">مسیر / آدرس (URL)</th>
                  <th className="py-3 px-3 text-start">بخش منو</th>
                  <th className="py-3 px-3 text-center">دیده‌بانی در ناوبری</th>
                  <th className="py-3 px-3 text-center">وضعیت انتشار</th>
                  <th className="py-3 px-3 text-center hidden md:table-cell">
                    اولویت چیدمان
                  </th>
                  <th className="py-3 px-4 text-end">پیش‌نمایش / عملیات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {filteredPages.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const IconComp = item.icon && ICON_MAP[item.icon]
                    ? ICON_MAP[item.icon]
                    : FileText;

                  const sectionMeta = NAV_SECTIONS.find(
                    (s) => s.id === item.section
                  );

                  return (
                    <tr
                      key={item.id}
                      className={`group transition-colors ${
                        isSelected
                          ? "bg-primary/5 hover:bg-primary/10"
                          : item.isVisible
                          ? "hover:bg-muted/40"
                          : "bg-muted/20 opacity-75 hover:opacity-100 hover:bg-muted/40"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectPage(item.id)}
                          aria-label={`انتخاب صفحه ${item.title}`}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>

                      {/* Title & Icon & Badges */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-xl border shrink-0 transition-colors ${
                              item.isVisible
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-muted text-muted-foreground border-border/80"
                            }`}
                          >
                            <IconComp className="h-4 w-4" />
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-foreground text-xs">
                                {item.title}
                              </span>

                              {item.badge && (
                                <Badge
                                  variant={item.badgeVariant || "outline"}
                                  className="text-[9px] px-1.5 py-0 font-bold"
                                >
                                  {item.badge}
                                </Badge>
                              )}

                              {item.isSystem ? (
                                <Badge
                                  variant="secondary"
                                  className="text-[9px] px-1 py-0 font-normal text-muted-foreground"
                                  title="صفحه اصلی سیستمی کارخانه"
                                >
                                  سیستمی
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1 py-0 font-normal border-dashed text-muted-foreground"
                                >
                                  سفارشی
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span dir="ltr" className="truncate font-mono">
                                {item.titleEn}
                              </span>
                              {item.description && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[280px] hidden xl:inline">
                                    {item.description}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Path / URL */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <code
                            dir="ltr"
                            className="rounded-md bg-secondary/80 px-2 py-0.5 font-mono text-[11px] text-foreground border border-border/50"
                          >
                            {item.path}
                          </code>
                          <button
                            onClick={() => handleCopyPath(item.path)}
                            title="کپی آدرس مسیر"
                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                          >
                            {copiedPath === item.path ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Section Badge */}
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold border ${
                            sectionMeta?.badgeClass ?? ""
                          }`}
                        >
                          {item.sectionLabel}
                        </Badge>
                      </td>

                      {/* Visibility Toggle Switch */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={item.isVisible}
                            onCheckedChange={() =>
                              togglePageVisibility(item.id)
                            }
                            aria-label={`تغییر وضعیت دیده‌بانی ${item.title}`}
                          />
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border transition-colors ${
                            item.isVisible
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                              : "bg-muted text-muted-foreground border-border/80"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.isVisible
                                ? "bg-emerald-500"
                                : "bg-muted-foreground"
                            }`}
                          />
                          <span>
                            {item.isVisible ? "نمایش در منو" : "مخفی از منو"}
                          </span>
                        </span>
                      </td>

                      {/* Order Priority */}
                      <td className="py-3 px-3 text-center hidden md:table-cell">
                        <span className="font-mono text-[11px] text-muted-foreground font-semibold tabular-nums">
                          #{item.order}
                        </span>
                      </td>

                      {/* Quick Actions / Link to Page */}
                      <td className="py-3 px-4 text-end">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            title="مشاهده زنده این صفحه در وبگاه"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Unsaved Changes Warning Bar (For Manual Mode) */}
      {!autoSave && isDirty && (
        <div className="fixed inset-x-4 bottom-4 z-40 sm:start-auto sm:end-8 sm:w-auto">
          <Card className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-amber-500/40 bg-card p-4 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600">
                <AlertCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">
                  تغییرات ذخیره‌نشده در منوها وجود دارد!
                </p>
                <p className="text-[11px] text-muted-foreground">
                  برای اعمال دائمی وضعیت‌های دیده‌بانی، دکمه ذخیره را بفشارید.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={discardChanges}
                disabled={isSaving}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                انصراف و بازنشانی
              </Button>

              <Button
                size="sm"
                onClick={() => saveChanges()}
                disabled={isSaving}
                className="h-8 gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isSaving ? "در حال ثبت..." : "ذخیره تغییرات"}</span>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
