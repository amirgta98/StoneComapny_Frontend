"use client";

import { useState } from "react";
import {
  Building,
  Plus,
  Trash2,
  MapPin,
  RefreshCw,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryLocations, useDeleteLocation } from "../../hooks/use-inventory";
import { LocationTypeBadge } from "../common/inventory-badges";
import { NewLocationDialog } from "./new-location-dialog";

export function WarehouseLocationsView() {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const { data, isLoading, error, refetch } = useInventoryLocations();
  const { mutate: deleteLocation, isPending: isDeleting } = useDeleteLocation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const locations = data?.locations || [];

  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این موقعیت انبار اطمینان دارید؟")) {
      setDeletingId(id);
      deleteLocation(id, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <Building className="h-6 w-6 text-amber-600 shrink-0" />
            موقعیت‌ها و ساختار فیزیکی انبار سنگ
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            مدیریت سلسله‌مراتبی سوله‌ها، سالن‌های ساب، خرک‌های اسلب، پالت‌های تایل و دپوی روباز
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

          <Button
            size="sm"
            onClick={() => setIsNewOpen(true)}
            className="gap-1.5 text-xs bg-amber-700 hover:bg-amber-800 text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>افزودن موقعیت جدید</span>
          </Button>
        </div>
      </div>

      {/* Locations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-destructive/30 rounded-2xl bg-destructive/5 text-destructive">
          <p className="font-bold text-sm">خطا در دریافت موقعیت‌های انبار</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            تلاش مجدد
          </Button>
        </div>
      ) : locations.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <Building className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="font-bold text-sm text-foreground">موقعیتی در انبار تعریف نشده است</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => {
            const usagePct = loc.capacitySqm
              ? Math.min(100, Math.round((loc.currentUsageSqm / loc.capacitySqm) * 100))
              : 0;
            const isFull = usagePct >= 95;

            return (
              <Card
                key={loc.id}
                className="border border-border/80 bg-card shadow-2xs hover:border-border transition-all flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <LocationTypeBadge type={loc.type} />
                          <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                            {loc.code}
                          </span>
                        </div>
                        <CardTitle className="text-sm font-bold text-foreground">
                          {loc.name}
                        </CardTitle>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting && deletingId === loc.id}
                        onClick={() => handleDelete(loc.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                        title="حذف موقعیت"
                      >
                        {isDeleting && deletingId === loc.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    {loc.parentName && (
                      <p className="text-[11px] text-muted-foreground mt-1">
                        موقعیت والد: <strong className="text-foreground">{loc.parentName}</strong>
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Capacity Usage Progress */}
                    {loc.capacitySqm && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">میزان اشغال فضا:</span>
                          <span className="font-bold tabular-nums text-foreground">
                            {loc.currentUsageSqm.toLocaleString("fa-IR")} / {loc.capacitySqm.toLocaleString("fa-IR")} م² ({usagePct}٪)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                          <div
                            style={{ width: `${usagePct}%` }}
                            className={
                              isFull
                                ? "h-full bg-rose-500 transition-all"
                                : usagePct > 70
                                ? "h-full bg-amber-500 transition-all"
                                : "h-full bg-emerald-500 transition-all"
                            }
                          />
                        </div>
                      </div>
                    )}

                    {loc.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2 bg-secondary/30 p-2 rounded-lg border border-border/60">
                        {loc.description}
                      </p>
                    )}
                  </CardContent>
                </div>

                <div className="px-5 py-3 border-t border-border/60 bg-secondary/15 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>وضعیت دسترسی:</span>
                  {isFull ? (
                    <Badge variant="outline" className="border-rose-500/40 bg-rose-500/10 text-rose-700 text-[10px] font-semibold gap-1">
                      <AlertCircle className="h-2.5 w-2.5" />
                      تکمیل ظرفیت
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 text-[10px] font-semibold gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      فعال و آزاد
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Location Modal */}
      <NewLocationDialog open={isNewOpen} onOpenChange={setIsNewOpen} />
    </div>
  );
}
