"use client";

import { useState, useMemo } from "react";
import {
  Tags,
  Plus,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  Microscope,
  Ruler,
  Award,
  Building,
  Box,
  CheckCircle2,
  XCircle,
  Copy,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Filter,
  RotateCcw,
  Info,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/auth";
import { toast } from "sonner";
import { useAttributesStore } from "../../stores/attributes-store";
import { ATTRIBUTE_GROUPS } from "../../data/mock-attributes";
import { AttributeFormDialog } from "./attribute-form-dialog";
import { AttributeDeleteDialog } from "./attribute-delete-dialog";
import { AttributePresetsDialog } from "./attribute-presets-dialog";
import type {
  AttributeDefinition,
  AttributeGroup,
  AttributeDataType,
  AttributeFormData,
} from "../../types";

const GROUP_ICONS: Record<AttributeGroup, React.ComponentType<{ className?: string }>> = {
  finishes: Sparkles,
  physical: Microscope,
  dimensions: Ruler,
  grading: Award,
  application: Building,
  commercial: Box,
};

const DATA_TYPE_LABELS: Record<AttributeDataType, string> = {
  select: "گزینه‌ای (تک)",
  multiselect: "چندگزینه‌ای",
  number: "عددی",
  text: "متنی",
  boolean: "بله / خیر",
  range: "بازه عددی",
};

export function AttributesManagerView() {
  const { user } = useAuth();
  const activeTenantId = user?.tenantId ?? "tenant-001";

  const {
    attributes,
    searchQuery,
    setSearchQuery,
    selectedGroup,
    setSelectedGroup,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    viewMode,
    setViewMode,
    addAttribute,
    updateAttribute,
    deleteAttribute,
    toggleStatus,
    duplicateAttribute,
    resetToFactoryDefaults,
    getStats,
  } = useAttributesStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<AttributeDefinition | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingAttribute, setDeletingAttribute] = useState<AttributeDefinition | null>(null);

  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  const stats = getStats();

  // Filter attributes based on search, group, status, and type
  const filteredAttributes = useMemo(() => {
    return attributes.filter((attr) => {
      // Group filter
      if (selectedGroup !== "all" && attr.group !== selectedGroup) return false;

      // Status filter
      if (statusFilter === "active" && !attr.isActive) return false;
      if (statusFilter === "inactive" && attr.isActive) return false;

      // Type filter
      if (typeFilter !== "all" && attr.dataType !== typeFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = attr.name.toLowerCase().includes(q);
        const matchesNameEn = attr.nameEn.toLowerCase().includes(q);
        const matchesCode = attr.code.toLowerCase().includes(q);
        const matchesDesc = attr.description?.toLowerCase().includes(q) ?? false;
        const matchesOption = attr.options?.some(
          (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
        ) ?? false;

        if (!matchesName && !matchesNameEn && !matchesCode && !matchesDesc && !matchesOption) {
          return false;
        }
      }

      return true;
    });
  }, [attributes, selectedGroup, statusFilter, typeFilter, searchQuery]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingAttribute(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (attr: AttributeDefinition) => {
    setEditingAttribute(attr);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (attr: AttributeDefinition) => {
    setDeletingAttribute(attr);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data: AttributeFormData) => {
    if (editingAttribute) {
      const res = updateAttribute(editingAttribute.id, data);
      if (res.success) {
        toast.success(`ویژگی «${data.name}» با موفقیت به‌روزرسانی شد.`);
      }
      return res;
    } else {
      const res = addAttribute(data, activeTenantId);
      if (res.success) {
        toast.success(`ویژگی جدید «${data.name}» با موفقیت ایجاد شد.`);
      }
      return res;
    }
  };

  const handleConfirmDelete = () => {
    if (deletingAttribute) {
      const res = deleteAttribute(deletingAttribute.id);
      if (res.success) {
        toast.success(`ویژگی «${deletingAttribute.name}» حذف شد.`);
      } else {
        toast.error(res.error || "خطا در حذف ویژگی.");
      }
    }
  };

  const handleDuplicate = (id: string, name: string) => {
    const res = duplicateAttribute(id);
    if (res.success) {
      toast.success(`یک نسخه رونوشت از «${name}» ایجاد شد.`);
    } else {
      toast.error(res.error || "خطا در کپی ویژگی.");
    }
  };

  const handleToggleStatus = (attr: AttributeDefinition) => {
    toggleStatus(attr.id);
    toast.info(`وضعیت ویژگی «${attr.name}» تغییر کرد.`);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-amber-950/10 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600/15 text-amber-700 border border-amber-500/25">
              <Tags className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ویژگی‌ها و فینیش‌های کاتالوگ سنگ
            </h1>
            <Badge
              variant="outline"
              className="border-amber-600/30 bg-amber-500/10 text-[10px] font-bold text-amber-700"
            >
              استانداردهای مهندسی
            </Badge>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-2xl leading-relaxed">
            مدیریت فینیش‌های سطحی، پرداخت‌های کارخانه، مشخصات فیزیکی و مکانیکی استاندارد ASTM سنگ، متغیرهای قیمت‌گذاری و فیلترهای جستجو.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPresetsOpen(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>الگوهای صنعتی سنگ</span>
          </Button>

          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>افزودن ویژگی جدید</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground">
            کل مشخصات فنی و فینیش‌ها
          </p>
          <p className="mt-1.5 text-xl font-bold text-foreground tabular-nums">
            {stats.totalAttributes.toLocaleString("fa-IR")}
          </p>
        </Card>

        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-muted-foreground">
              تنوع‌ساز قیمت و انبار
            </p>
            <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-700 border-amber-500/30">
              Variant Driver
            </Badge>
          </div>
          <p className="mt-1.5 text-xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">
            {stats.variantDrivers.toLocaleString("fa-IR")} ویژگی
          </p>
        </Card>

        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground">
            فیلترهای فعال در وبگاه
          </p>
          <p className="mt-1.5 text-xl font-bold text-sky-700 dark:text-sky-400 tabular-nums">
            {stats.filterableCount.toLocaleString("fa-IR")} فیلد
          </p>
        </Card>

        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground">
            سنگ‌های منتسب به ویژگی‌ها
          </p>
          <p className="mt-1.5 text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
            {stats.totalProductsAssigned.toLocaleString("fa-IR")} انتساب
          </p>
        </Card>
      </div>

      {/* Group Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setSelectedGroup("all")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
            selectedGroup === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border/70 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
          }`}
        >
          <span>همه ویژگی‌ها</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] tabular-nums font-bold ${
              selectedGroup === "all"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {stats.totalAttributes.toLocaleString("fa-IR")}
          </span>
        </button>

        {ATTRIBUTE_GROUPS.map((g) => {
          const isSelected = selectedGroup === g.id;
          const Icon = GROUP_ICONS[g.id];
          const count = stats.groupCounts[g.id] ?? 0;

          return (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card border border-border/70 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{g.title}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] tabular-nums font-bold ${
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count.toLocaleString("fa-IR")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and View Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی عنوان، کد انگلیسی، آزمایش..."
            className="ps-9 text-xs h-9 bg-card"
          />
        </div>

        {/* Dropdown Filters & View Switcher */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-9 rounded-lg border border-border/80 bg-card px-2.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">وضعیت: همه</option>
            <option value="active">فقط فعال</option>
            <option value="inactive">فقط غیرفعال</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="h-9 rounded-lg border border-border/80 bg-card px-2.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">نوع داده: همه</option>
            <option value="select">گزینه‌ای (تک)</option>
            <option value="multiselect">چندگزینه‌ای</option>
            <option value="number">عددی با واحد</option>
            <option value="boolean">بله / خیر</option>
            <option value="text">متنی</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5">
            <button
              onClick={() => setViewMode("table")}
              title="نمای جدولی"
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                viewMode === "table"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              title="نمای کارتی"
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredAttributes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
            <Tags className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">هیچ مشخصه یا ویژگی یافت نشد</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
            با فیلترها یا عبارت جستجوی فعلی نتیجه‌ای پیدا نشد. می‌توانید فیلترها را ریست کنید یا ویژگی جدیدی ایجاد نمایید.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedGroup("all");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="text-xs"
            >
              پاک‌کردن فیلترها
            </Button>
            <Button size="sm" onClick={handleOpenCreate} className="text-xs">
              افزودن ویژگی جدید
            </Button>
          </div>
        </Card>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/50 text-[11px] font-semibold text-muted-foreground border-b border-border/70">
                <tr>
                  <th className="py-3 px-4 text-start">نام ویژگی و شناسه سیستمی</th>
                  <th className="py-3 px-3 text-start">گروه تخصصی</th>
                  <th className="py-3 px-3 text-start">نوع فیلد / واحد</th>
                  <th className="py-3 px-3 text-start">گزینه‌ها / مقادیر مجاز</th>
                  <th className="py-3 px-3 text-center">اثرگذاری در کاتالوگ</th>
                  <th className="py-3 px-3 text-center">محصولات متصل</th>
                  <th className="py-3 px-3 text-center">وضعیت</th>
                  <th className="py-3 px-4 text-end">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredAttributes.map((attr) => {
                  const groupMeta = ATTRIBUTE_GROUPS.find((g) => g.id === attr.group);
                  const Icon = GROUP_ICONS[attr.group];

                  return (
                    <tr
                      key={attr.id}
                      className="hover:bg-secondary/30 transition-colors group"
                    >
                      {/* Name & Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-foreground block text-xs">
                              {attr.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <code
                                className="font-mono text-[10px] text-muted-foreground bg-muted/80 px-1 rounded"
                                dir="ltr"
                              >
                                {attr.code}
                              </code>
                              <span className="text-[10px] text-muted-foreground truncate max-w-[140px]" dir="ltr">
                                {attr.nameEn}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Group */}
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${groupMeta?.badgeClass ?? ""}`}
                        >
                          {groupMeta?.title ?? attr.group}
                        </Badge>
                      </td>

                      {/* Data Type & Unit */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <span className="font-medium text-foreground block">
                            {DATA_TYPE_LABELS[attr.dataType]}
                          </span>
                          {attr.unit && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] font-bold text-muted-foreground"
                            >
                              {attr.unit}
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Options / Values preview */}
                      <td className="py-3 px-3 max-w-[200px]">
                        {attr.options && attr.options.length > 0 ? (
                          <div className="flex flex-wrap gap-1 items-center">
                            {attr.options.slice(0, 3).map((opt) => (
                              <span
                                key={opt.id}
                                className="inline-flex items-center gap-1 rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] text-foreground border border-border/50"
                              >
                                {opt.colorHex && (
                                  <span
                                    className="h-2 w-2 rounded-full border border-border/40"
                                    style={{ backgroundColor: opt.colorHex }}
                                  />
                                )}
                                <span className="truncate max-w-[70px]">{opt.label}</span>
                              </span>
                            ))}
                            {attr.options.length > 3 && (
                              <span className="text-[10px] text-muted-foreground font-semibold">
                                +{(attr.options.length - 3).toLocaleString("fa-IR")} دیگر
                              </span>
                            )}
                          </div>
                        ) : attr.dataType === "boolean" ? (
                          <span className="text-[10px] text-muted-foreground">دو وضعیتی (فعال / غیرفعال)</span>
                        ) : attr.unit ? (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            مقدار عددی [{attr.unit}]
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">متن باز</span>
                        )}
                      </td>

                      {/* Flags / Behavior Badges */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-1">
                          {attr.isVariantDriver && (
                            <Badge
                              variant="outline"
                              className="text-[9px] bg-amber-500/10 text-amber-700 border-amber-500/30"
                              title="تنوع‌ساز قیمت و انبار"
                            >
                              تنوع‌ساز
                            </Badge>
                          )}
                          {attr.isFilterable && (
                            <Badge
                              variant="outline"
                              className="text-[9px] bg-sky-500/10 text-sky-700 border-sky-500/30"
                              title="نمایش در فیلترهای وبگاه"
                            >
                              فیلتر وبگاه
                            </Badge>
                          )}
                          {attr.isRequired && (
                            <Badge
                              variant="outline"
                              className="text-[9px] bg-rose-500/10 text-rose-700 border-rose-500/30"
                              title="تکمیل این مشخصه اجباری است"
                            >
                              الزامی
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Product Usage */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold tabular-nums text-foreground">
                          {attr.productCount.toLocaleString("fa-IR")}
                        </span>
                        <span className="text-[10px] text-muted-foreground ms-1">سنگ</span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleStatus(attr)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border transition-colors ${
                            attr.isActive
                              ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/25"
                              : "bg-muted text-muted-foreground border-border/80 hover:bg-muted/80"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              attr.isActive ? "bg-emerald-500" : "bg-muted-foreground"
                            }`}
                          />
                          <span>{attr.isActive ? "فعال" : "غیرفعال"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-end">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(attr)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            title="ویرایش ویژگی"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(attr.id, attr.name)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            title="تکثیر / کپی ویژگی"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenDelete(attr)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="حذف ویژگی"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID / CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredAttributes.map((attr) => {
            const groupMeta = ATTRIBUTE_GROUPS.find((g) => g.id === attr.group);
            const Icon = GROUP_ICONS[attr.group];

            return (
              <Card
                key={attr.id}
                className="flex flex-col justify-between border border-border/70 bg-card p-4 hover:border-amber-500/40 hover:shadow-xs transition-all"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground leading-tight">
                          {attr.name}
                        </h4>
                        <span className="text-[10px] text-muted-foreground font-mono" dir="ltr">
                          {attr.code}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[9px] font-semibold shrink-0 ${groupMeta?.badgeClass ?? ""}`}
                    >
                      {groupMeta?.title ?? attr.group}
                    </Badge>
                  </div>

                  {/* Description */}
                  {attr.description && (
                    <p className="mt-2.5 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {attr.description}
                    </p>
                  )}

                  {/* Options chips if any */}
                  {attr.options && attr.options.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        گزینه‌های تعریف‌شده ({attr.options.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {attr.options.slice(0, 4).map((opt) => (
                          <span
                            key={opt.id}
                            className="inline-flex items-center gap-1 rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] text-foreground border border-border/50"
                          >
                            {opt.colorHex && (
                              <span
                                className="h-2 w-2 rounded-full border border-border/40"
                                style={{ backgroundColor: opt.colorHex }}
                              />
                            )}
                            <span className="truncate max-w-[90px]">{opt.label}</span>
                          </span>
                        ))}
                        {attr.options.length > 4 && (
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            +{(attr.options.length - 4).toLocaleString("fa-IR")}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Spec pills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      نوع: {DATA_TYPE_LABELS[attr.dataType]}
                    </span>
                    {attr.unit && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-foreground">
                        واحد: {attr.unit}
                      </span>
                    )}
                    {attr.isVariantDriver && (
                      <span className="rounded bg-amber-500/10 text-amber-700 border border-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold">
                        تنوع‌ساز قیمت
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom Footer */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <span className="font-bold text-foreground">
                      {attr.productCount.toLocaleString("fa-IR")}
                    </span>
                    <span>سنگ متصل</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleStatus(attr)}
                      className={`h-6 px-2 rounded text-[10px] font-bold transition-colors ${
                        attr.isActive
                          ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {attr.isActive ? "فعال" : "غیرفعال"}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(attr)}
                      className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                      title="ویرایش"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenDelete(attr)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <AttributeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingAttribute={editingAttribute}
        onSubmit={handleFormSubmit}
      />

      <AttributeDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        attribute={deletingAttribute}
        onConfirm={handleConfirmDelete}
      />

      <AttributePresetsDialog
        open={isPresetsOpen}
        onOpenChange={setIsPresetsOpen}
        onResetToDefaults={() => resetToFactoryDefaults(activeTenantId)}
      />
    </div>
  );
}
