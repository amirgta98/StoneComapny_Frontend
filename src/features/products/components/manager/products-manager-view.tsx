"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Copy,
  TrendingUp,
  Package,
  AlertCircle,
  CheckCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/auth";
import { useAdminProductsStore } from "../../stores/admin-products-store";
import { ProductDeleteDialog } from "./product-delete-dialog";
import { ProductQuickViewDialog } from "./product-quick-view-dialog";
import type { Product, ProductStatus } from "@/types";
import { STONE_TYPES, STONE_FORMS } from "@/constants";
import {
  STONE_TYPE_LABELS,
  STONE_COLOR_LABELS,
  STONE_FINISH_LABELS,
  STONE_FORM_LABELS,
  PRICING_UNIT_LABELS,
} from "../../constants";

export function ProductsManagerView() {
  const { user } = useAuth();
  const activeTenantId = user?.tenantId ?? "tenant-001";

  const {
    products,
    deleteProduct,
    duplicateProduct,
    toggleStatus,
    getStats,
  } = useAdminProductsStore();

  // Dialog states
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedForm, setSelectedForm] = useState<string>("all");

  const stats = getStats(activeTenantId);

  // Filter products scoped to tenant
  const tenantProducts = useMemo(() => {
    return products.filter((p) => p.tenantId === activeTenantId || p.tenantId === "tenant-001");
  }, [products, activeTenantId]);

  const filteredProducts = useMemo(() => {
    return tenantProducts.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchSlug = product.slug.toLowerCase().includes(q);
        const matchOrigin = product.origin?.toLowerCase().includes(q);
        const matchQuarry = product.quarry?.toLowerCase().includes(q);
        if (!matchName && !matchSlug && !matchOrigin && !matchQuarry) {
          return false;
        }
      }

      // Stone Type
      if (selectedType !== "all" && product.stoneType !== selectedType) {
        return false;
      }

      // Status
      if (selectedStatus !== "all" && product.status !== selectedStatus) {
        return false;
      }

      // Form
      if (selectedForm !== "all" && product.form !== selectedForm) {
        return false;
      }

      return true;
    });
  }, [tenantProducts, searchQuery, selectedType, selectedStatus, selectedForm]);

  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
    }
  };

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleDuplicate = (product: Product) => {
    duplicateProduct(product.id);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedForm("all");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedType !== "all" ||
    selectedStatus !== "all" ||
    selectedForm !== "all";

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-amber-950/10 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600/15 text-amber-700 border border-amber-500/25">
              <Layers className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              مدیریت کاتالوگ سنگ‌ها و اسلب‌ها
            </h1>
            <Badge
              variant="outline"
              className="border-amber-600/30 bg-amber-500/10 text-[10px] font-bold text-amber-700"
            >
              {tenantProducts.length} محصول
            </Badge>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-2xl leading-relaxed">
            تعریف و مدیریت انواع اسلب‌های صادراتی، تایل‌های کالیبره، قیمت‌گذاری و دپوی انبار سنگ کارخانه.
          </p>
        </div>

        <Button asChild size="sm" className="gap-1.5 text-xs font-semibold shadow-xs shrink-0">
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4" />
            <span>ثبت سنگ جدید</span>
          </Link>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-muted-foreground">
            کل سنگ‌های کاتالوگ
          </span>
          <p className="mt-1 text-xl font-bold text-foreground tabular-nums">
            {stats.total.toLocaleString("fa-IR")}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>{stats.published} منتشرشده</span>
            <span>·</span>
            <span>{stats.draft} پیش‌نویس</span>
          </div>
        </Card>

        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-muted-foreground">
            منتشرشده در شوروم
          </span>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {stats.published.toLocaleString("fa-IR")}
            </p>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
              فعال آنلاین
            </Badge>
          </div>
        </Card>

        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-muted-foreground">
            ارزش ریالی کل دپوی انبار
          </span>
          <p className="mt-1 text-xl font-bold text-foreground tabular-nums truncate">
            {stats.totalStockValue > 0
              ? `${(stats.totalStockValue / 1_000_000).toFixed(0).toLocaleString()} م. تومان`
              : "۰"}
          </p>
          <span className="mt-1 block text-[10px] text-muted-foreground">
            محاسبه بر اساس موجودی و قیمت پایه
          </span>
        </Card>

        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-muted-foreground">
            سنگ‌های در آستانه اتمام
          </span>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">
              {stats.outOfStockCount.toLocaleString("fa-IR")}
            </p>
            {stats.outOfStockCount > 0 ? (
              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 border-amber-500/30">
                نیازمند برش کوپ
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
                موجودی کامل
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام سنگ، معدن، اسلاگ..."
            className="ps-9 text-xs h-9 bg-secondary/40"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Stone Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs ring-offset-background"
          >
            <option value="all">همه انواع سنگ</option>
            {STONE_TYPES.map((type) => (
              <option key={type} value={type}>
                {STONE_TYPE_LABELS[type]}
              </option>
            ))}
          </select>

          {/* Form Filter */}
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs ring-offset-background"
          >
            <option value="all">همه قواره‌ها (اسلب/تایل)</option>
            {STONE_FORMS.map((f) => (
              <option key={f} value={f}>
                {STONE_FORM_LABELS[f]}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs ring-offset-background"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="published">منتشرشده</option>
            <option value="draft">پیش‌نویس</option>
            <option value="archived">بایگانی شده</option>
          </select>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5 me-1" />
              پاکسازی فیلترها
            </Button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <Card className="border border-border/80 bg-card shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/30 text-muted-foreground">
                <th className="py-3 pe-4 text-start font-medium">سنگ و اسلب</th>
                <th className="py-3 px-3 text-start font-medium">نوع و رنگ</th>
                <th className="py-3 px-3 text-start font-medium">ابعاد و فینیش</th>
                <th className="py-3 px-3 text-start font-medium">قیمت واحد</th>
                <th className="py-3 px-3 text-start font-medium">موجودی دپو</th>
                <th className="py-3 px-3 text-start font-medium">وضعیت</th>
                <th className="py-3 ps-3 text-end font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredProducts.map((product) => {
                const primaryImage =
                  product.images.find((img) => img.isPrimary)?.url ||
                  product.images[0]?.url ||
                  "/test_images/stones/test_1.jpg";

                const totalInventory = product.variants.reduce(
                  (acc, v) => acc + (v.inventory || 0),
                  0
                );
                const isOutOfStock = totalInventory <= 0;

                return (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-secondary/40 group"
                  >
                    {/* Stone Name & Thumbnail */}
                    <td className="py-3 pe-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={primaryImage}
                          alt={product.name}
                          className="h-12 w-12 shrink-0 rounded-lg border border-border/70 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-foreground truncate max-w-52 sm:max-w-64">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                            <span className="font-mono" dir="ltr">
                              /{product.slug}
                            </span>
                            {product.grade && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0 bg-secondary/50">
                                {product.grade}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Stone Type & Color */}
                    <td className="py-3 px-3">
                      <p className="font-semibold text-foreground">
                        {product.stoneType ? STONE_TYPE_LABELS[product.stoneType] : "—"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        رنگ: {product.color ? STONE_COLOR_LABELS[product.color] : "—"}
                      </p>
                    </td>

                    {/* Dimensions, Form & Finish */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                          {product.form ? STONE_FORM_LABELS[product.form] : "اسلب"}
                        </Badge>
                        <span className="text-[11px] text-foreground font-medium">
                          {product.dimensions || "۲۸۰ × ۱۶۰"}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        فینیش: {product.finish ? STONE_FINISH_LABELS[product.finish] : "ساب صیقلی"}
                        {product.thickness && ` · ${product.thickness} سانت`}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3">
                      <p className="font-bold text-foreground tabular-nums">
                        {product.price ? `${product.price.toLocaleString("fa-IR")} ت` : "استعلامی"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        هر {product.pricingUnit ? PRICING_UNIT_LABELS[product.pricingUnit] : "م²"}
                      </p>
                    </td>

                    {/* Inventory */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold tabular-nums ${
                            isOutOfStock
                              ? "text-destructive"
                              : totalInventory < 200
                              ? "text-amber-600"
                              : "text-foreground"
                          }`}
                        >
                          {totalInventory.toLocaleString("fa-IR")}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {product.inventoryUnit ?? "م²"}
                        </span>
                      </div>
                      {isOutOfStock ? (
                        <span className="text-[9px] text-destructive font-semibold block">
                          ناموجود در دپو
                        </span>
                      ) : totalInventory < 200 ? (
                        <span className="text-[9px] text-amber-700 font-semibold block">
                          آستانه کسری
                        </span>
                      ) : null}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(product.id)}
                        className="transition-opacity hover:opacity-80"
                        title="کلیک برای تغییر وضعیت (منتشرشده / پیش‌نویس / بایگانی)"
                      >
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold cursor-pointer ${
                            product.status === "published"
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                              : product.status === "draft"
                              ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                              : "bg-secondary text-secondary-foreground border-border"
                          }`}
                        >
                          {product.status === "published"
                            ? "منتشرشده"
                            : product.status === "draft"
                            ? "پیش‌نویس"
                            : "بایگانی"}
                        </Badge>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 ps-3 text-end">
                      <div className="flex items-center justify-end gap-1">
                        {/* Quick View */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenQuickView(product)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                          title="مشاهده مشخصات فنی و گالری"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>

                        {/* Edit */}
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                          title="ویرایش کامل سنگ"
                        >
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>
                        </Button>

                        {/* Duplicate */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(product)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                          title="ایجاد نسخه رونوشت (کپی)"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>

                        {/* Delete */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(product)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          title="حذف سنگ از کاتالوگ"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Layers className="h-10 w-10 mx-auto text-muted-foreground/40" />
                      <p className="font-semibold text-xs text-foreground">
                        سنگی با این مشخصات یافت نشد
                      </p>
                      <p className="text-[11px]">
                        لطفاً عبارت جستجو یا فیلترهای اعمال‌شده را تغییر دهید.
                      </p>
                      {hasActiveFilters && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="mt-2 text-xs"
                        >
                          پاکسازی همه فیلترها
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ProductDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        product={deletingProduct}
        onConfirm={handleConfirmDelete}
      />

      {/* Quick View Technical Specs Modal */}
      <ProductQuickViewDialog
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        product={quickViewProduct}
      />
    </div>
  );
}
