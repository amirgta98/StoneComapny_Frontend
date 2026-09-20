"use client";

import { useEffect, useMemo } from "react";
import {
  TrendingUp,
  Save,
  RotateCcw,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Globe,
  SlidersHorizontal,
  FileCode,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataListView, EmptyState } from "@/components/data-listing";

import { useSeoStore } from "../stores/seo-store";
import { SeoStatsCards } from "./seo-stats-cards";
import { PageSeoTable } from "./pages-tab/page-seo-table";
import { PageSeoCard } from "./pages-tab/page-seo-card";
import { PageSeoEditDialog } from "./pages-tab/page-seo-edit-dialog";
import { SerpPreviewDialog } from "./serp-preview/serp-preview-dialog";
import { GlobalSettingsTab } from "./global-tab/global-settings-tab";
import { SitemapRobotsTab } from "./sitemap-tab/sitemap-robots-tab";
import { SeoAuditTab } from "./audit-tab/seo-audit-tab";
import type { PageFilterCategory, PageFilterStatus, PageSortOption } from "../types";

export function SeoManagerView() {
  const {
    pages,
    activeTab,
    searchQuery,
    categoryFilter,
    statusFilter,
    sortBy,
    isSaving,
    initFromStorage,
    resetToDefaults,
    saveAllChanges,
    discardChanges,
    hasUnsavedChanges,
    setActiveTab,
    setSearchQuery,
    setCategoryFilter,
    setStatusFilter,
    setSortBy,
    clearFilters,
    getFilteredPages,
    getStats,
  } = useSeoStore();

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  const filteredPages = useMemo(() => getFilteredPages(), [
    getFilteredPages,
    pages,
    searchQuery,
    categoryFilter,
    statusFilter,
    sortBy,
  ]);

  const stats = useMemo(() => getStats(), [getStats, pages]);
  const isDirty = hasUnsavedChanges();

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              سئو و موتورهای جستجو
            </h1>
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 text-xs px-2.5 py-0.5"
            >
              Google & SERP Ready
            </Badge>
            {isDirty && (
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs px-2 py-0.5"
              >
                تغییرات ذخیره‌نشده
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            مدیریت متادیتای صفحات، پیش‌نمایش در نتایج گوگل (SERP)، نقشه سایت XML، راهنمای ربات‌ها (Robots.txt) و برچسب‌های اشتراک‌گذاری اسلب‌ها.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {isDirty && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5"
              onClick={discardChanges}
              disabled={isSaving}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>انصراف</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={resetToDefaults}
            disabled={isSaving}
            title="بازنشانی تمام داده‌های سئو به مقادیر اولیه کارخانه"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">بازنشانی پیش‌فرض</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            className="h-9 text-xs gap-1.5 font-medium shadow-xs"
            onClick={saveAllChanges}
            disabled={isSaving || !isDirty}
          >
            <Save className={`h-3.5 w-3.5 ${isSaving ? "animate-spin" : ""}`} />
            <span>{isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
          </Button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <SeoStatsCards />

      {/* 3. Main Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="w-full space-y-5"
      >
        <div className="border-b border-border/70 pb-1">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto h-10 p-1 bg-muted/60">
            <TabsTrigger value="pages" className="text-xs sm:text-sm gap-1.5">
              <FileText className="h-4 w-4" />
              <span>صفحات و کاتالوگ سنگ</span>
              <span className="text-[11px] opacity-70">({pages.length})</span>
            </TabsTrigger>
            <TabsTrigger value="global" className="text-xs sm:text-sm gap-1.5">
              <Globe className="h-4 w-4" />
              <span>تنظیمات سراسری و وبمستر</span>
            </TabsTrigger>
            <TabsTrigger value="sitemap" className="text-xs sm:text-sm gap-1.5">
              <FileCode className="h-4 w-4" />
              <span>نقشه سایت و Robots</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-xs sm:text-sm gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>آنالیز و چک‌لیست سئو</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Pages & Stone Catalog */}
        <TabsContent value="pages" className="space-y-4 mt-0">
          {/* Filters and Search Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-border/60 bg-card shadow-2xs">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در عنوان، مسیر، اسلب یا کلمات کلیدی..."
                className="pr-9 text-xs"
                aria-label="جستجوی صفحه یا محصول سنگ"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter */}
              <Select
                value={categoryFilter}
                onValueChange={(val) => setCategoryFilter(val as PageFilterCategory)}
              >
                <SelectTrigger className="w-full sm:w-36 text-xs h-9">
                  <SelectValue placeholder="دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه دسته‌ها</SelectItem>
                  <SelectItem value="main">صفحه اصلی</SelectItem>
                  <SelectItem value="stones">محصولات سنگ</SelectItem>
                  <SelectItem value="collections">کلکسیون‌ها</SelectItem>
                  <SelectItem value="showrooms">شوروم و نمایشگاه</SelectItem>
                  <SelectItem value="static">درباره و تماس</SelectItem>
                  <SelectItem value="system">صفحات سیستم</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val as PageFilterStatus)}
              >
                <SelectTrigger className="w-full sm:w-36 text-xs h-9">
                  <SelectValue placeholder="وضعیت ایندکس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="healthy">نمره عالی (۹۰+)</SelectItem>
                  <SelectItem value="warning">نیازمند بهینه‌سازی</SelectItem>
                  <SelectItem value="noindex">غیرفعال (NoIndex)</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select
                value={sortBy}
                onValueChange={(val) => setSortBy(val as PageSortOption)}
              >
                <SelectTrigger className="w-full sm:w-36 text-xs h-9">
                  <SelectValue placeholder="مرتب‌سازی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">بیشترین نمره سئو</SelectItem>
                  <SelectItem value="priority">اولویت نقشه سایت</SelectItem>
                  <SelectItem value="title">عنوان الفبایی</SelectItem>
                  <SelectItem value="slug">مسیر URL</SelectItem>
                  <SelectItem value="date">تاریخ آخرین ویرایش</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || categoryFilter !== "all" || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-muted-foreground hover:text-foreground"
                  onClick={clearFilters}
                >
                  پاکسازی فیلترها
                </Button>
              )}
            </div>
          </div>

          {/* Listing & Empty State */}
          {filteredPages.length === 0 ? (
            <EmptyState
              title="هیچ صفحه یا محصولی با فیلترهای انتخابی یافت نشد"
              description="می‌توانید عبارت جستجو را تغییر داده یا فیلترهای دسته‌بندی و وضعیت را بازنشانی کنید."
              action={
                <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">
                  بازنشانی فیلترها
                </Button>
              }
            />
          ) : (
            <DataListView
              cardView={
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {filteredPages.map((page) => (
                    <PageSeoCard key={page.id} page={page} />
                  ))}
                </div>
              }
              tableView={<PageSeoTable pages={filteredPages} />}
              footer={
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>نمایش {filteredPages.length} از {pages.length} صفحه کاتالوگ کارخانه البرز</span>
                  <span>{stats.totalIndexedPages} صفحه در نتایج جستجوی گوگل فعال هستند</span>
                </div>
              }
            />
          )}
        </TabsContent>

        {/* Tab 2: Global Settings */}
        <TabsContent value="global" className="mt-0">
          <GlobalSettingsTab />
        </TabsContent>

        {/* Tab 3: Sitemap & Robots.txt */}
        <TabsContent value="sitemap" className="mt-0">
          <SitemapRobotsTab />
        </TabsContent>

        {/* Tab 4: Audit & Recommendations */}
        <TabsContent value="audit" className="mt-0">
          <SeoAuditTab />
        </TabsContent>
      </Tabs>

      {/* 4. Embedded Dialogs */}
      <PageSeoEditDialog />
      <SerpPreviewDialog />
    </div>
  );
}
