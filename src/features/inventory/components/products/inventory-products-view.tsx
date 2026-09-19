"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Layers,
  MapPin,
  Eye,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryItems, useInventoryLocations } from "../../hooks/use-inventory";
import { InventoryStatusBadge, StoneUnitBadge } from "../common/inventory-badges";
import { InventoryDetailDialog } from "./inventory-detail-dialog";
import { STONE_TYPES, STONE_FORMS } from "@/constants/stone";
import { STONE_TYPE_LABELS, STONE_FORM_LABELS } from "@/features/products/constants";

export function InventoryProductsView() {
  const [query, setQuery] = useState("");
  const [stoneType, setStoneType] = useState<string>("all");
  const [form, setForm] = useState<string>("all");
  const [locationId, setLocationId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [lowStockOnly, setLowStockOnly] = useState<boolean>(false);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: locationsData } = useInventoryLocations();
  const { data, isLoading, error, refetch } = useInventoryItems({
    query,
    stoneType,
    form,
    locationId,
    status,
    lowStockOnly,
  });

  const locations = locationsData?.locations || [];
  const items = data?.items || [];

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <Layers className="h-6 w-6 text-amber-600 shrink-0" />
            فهرست موجودی سنگ‌ها، اسلب‌ها و تایل‌ها
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            مشاهده، فیلتر و ردیابی متراژ دقیق دپوی کارخانه به تفکیک خرک، پالت و سوله
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>بروزرسانی</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در نام سنگ، اسلب ID، کد بچ..."
              className="pe-9 text-xs"
            />
          </div>

          {/* Stone Type Filter */}
          <Select value={stoneType} onValueChange={setStoneType}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="نوع سنگ" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="all">همه انواع سنگ</SelectItem>
              {STONE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {STONE_TYPE_LABELS[t] || t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Form Filter */}
          <Select value={form} onValueChange={setForm}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="قالب سنگ" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="all">همه فرم‌ها</SelectItem>
              {STONE_FORMS.map((f) => (
                <SelectItem key={f} value={f}>
                  {STONE_FORM_LABELS[f] || f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Warehouse Location Filter */}
          <Select value={locationId} onValueChange={setLocationId}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="موقعیت انبار" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="all">همه موقعیت‌ها</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60">
          <div className="flex items-center gap-2">
            <Button
              variant={lowStockOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setLowStockOnly(!lowStockOnly)}
              className="text-[11px] gap-1.5 h-7 px-2.5"
            >
              <AlertTriangle className="h-3 w-3" />
              <span>فقط موارد کسری و آستانه هشدار</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground tabular-nums">
            نمایش <strong>{items.length.toLocaleString("fa-IR")}</strong> قلم کالا
          </p>
        </div>
      </div>

      {/* Main Inventory Data Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-destructive/30 rounded-2xl bg-destructive/5 text-destructive">
          <p className="font-bold text-sm">خطا در بارگذاری موجودی انبار</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            تلاش مجدد
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <Layers className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="font-bold text-sm text-foreground">کالایی با فیلترهای انتخابی یافت نشد</h3>
          <p className="text-xs text-muted-foreground">
            می‌توانید عبارت جستجو یا فیلترهای نوع سنگ و موقعیت را تغییر دهید.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">مشخصات سنگ / اسلب</th>
                  <th className="px-3 py-3 text-start">ابعاد و فینیش</th>
                  <th className="px-3 py-3 text-center">موجودی کل</th>
                  <th className="px-3 py-3 text-center">رزرو</th>
                  <th className="px-3 py-3 text-center">قابل فروش</th>
                  <th className="px-3 py-3 text-start">موقعیت دپو</th>
                  <th className="px-3 py-3 text-center">وضعیت</th>
                  <th className="px-4 py-3 text-end">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    {/* Stone Spec */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.primaryImage && (
                          <img
                            src={item.primaryImage}
                            alt={item.productName}
                            className="h-10 w-10 rounded-lg object-cover border border-border/70 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate max-w-[200px]">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                            <span>{item.stoneType}</span>
                            {item.slabId && <span>· اسلب: {item.slabId}</span>}
                            {item.batchNumber && <span>· بچ: {item.batchNumber}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Dimensions & Finish */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <p className="font-medium text-foreground">{item.dimensions}</p>
                      <p className="text-[11px] text-muted-foreground">{item.finish} · {item.thickness}cm</p>
                    </td>

                    {/* Total On-Hand */}
                    <td className="px-3 py-3 text-center whitespace-nowrap tabular-nums font-bold text-foreground">
                      {item.onHand.toLocaleString("fa-IR")}{" "}
                      <span className="text-[10px] text-muted-foreground font-normal">{item.unit}</span>
                    </td>

                    {/* Reserved */}
                    <td className="px-3 py-3 text-center whitespace-nowrap tabular-nums font-semibold text-amber-600">
                      {item.reserved.toLocaleString("fa-IR")}{" "}
                      <span className="text-[10px] font-normal">{item.unit}</span>
                    </td>

                    {/* Available */}
                    <td className="px-3 py-3 text-center whitespace-nowrap tabular-nums font-black text-emerald-600 text-sm">
                      {item.available.toLocaleString("fa-IR")}{" "}
                      <span className="text-[10px] font-normal">{item.unit}</span>
                    </td>

                    {/* Location */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3 text-amber-600 shrink-0" />
                        <span className="font-medium text-foreground max-w-[140px] truncate">{item.locationName}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <InventoryStatusBadge status={item.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-end whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => {
                          setSelectedItemId(item.id);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>شناسنامه</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Item Detail Modal Dialog */}
      <InventoryDetailDialog
        itemId={selectedItemId}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
