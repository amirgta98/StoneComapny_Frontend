"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryItem } from "../../hooks/use-inventory";
import { InventoryStatusBadge, MovementTypeBadge } from "../common/inventory-badges";
import {
  Layers,
  MapPin,
  Barcode,
  Coins,
  ShieldCheck,
  Package,
  History,
  Bookmark,
} from "lucide-react";

interface InventoryDetailDialogProps {
  itemId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryDetailDialog({
  itemId,
  open,
  onOpenChange,
}: InventoryDetailDialogProps) {
  const { data, isLoading } = useInventoryItem(itemId || undefined);

  if (!open || !itemId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-base font-bold text-foreground">
              شناسنامه و وضعیت دپوی سنگ
            </DialogTitle>
            {data?.item && <InventoryStatusBadge status={data.item.status} />}
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            مشخصات فیزیکی، موقعیت انبار، تفکیک متراژ آزاد/رزرو و سابقه گردش در کاردکس
          </DialogDescription>
        </DialogHeader>

        {isLoading || !data ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Top Stone Spec Header */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border/80 bg-secondary/20">
              {data.item.primaryImage && (
                <img
                  src={data.item.primaryImage}
                  alt={data.item.productName}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg object-cover border border-border/80 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0 space-y-1.5">
                <h3 className="font-bold text-sm text-foreground">{data.item.productName}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>نوع: <strong className="text-foreground">{data.item.stoneType}</strong></span>
                  <span>·</span>
                  <span>فینیش: <strong className="text-foreground">{data.item.finish}</strong></span>
                  <span>·</span>
                  <span>ابعاد: <strong className="text-foreground">{data.item.dimensions}</strong></span>
                  <span>·</span>
                  <span>ضخامت: <strong className="text-foreground">{data.item.thickness} سانتی‌متر</strong></span>
                </div>
                {data.item.grade && (
                  <div className="text-xs text-muted-foreground">
                    درجه کیفی: <Badge variant="secondary" className="text-[11px] font-semibold">{data.item.grade}</Badge>
                  </div>
                )}
                {data.item.notes && (
                  <p className="text-[11px] text-muted-foreground line-clamp-2 bg-card p-2 rounded-md border border-border/60">
                    {data.item.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Inventory Metrics Quad */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl border border-border/80 bg-card text-center">
                <p className="text-[11px] text-muted-foreground font-medium">موجودی فیزیکی</p>
                <p className="text-lg font-black text-foreground tabular-nums mt-1">
                  {data.item.onHand.toLocaleString("fa-IR")} <span className="text-xs font-normal text-muted-foreground">{data.item.unit}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-center">
                <p className="text-[11px] text-emerald-700 font-medium">قابل فروش (آزاد)</p>
                <p className="text-lg font-black text-emerald-600 tabular-nums mt-1">
                  {data.item.available.toLocaleString("fa-IR")} <span className="text-xs font-normal text-emerald-600">{data.item.unit}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-center">
                <p className="text-[11px] text-amber-700 font-medium">رزرو شده</p>
                <p className="text-lg font-black text-amber-600 tabular-nums mt-1">
                  {data.item.reserved.toLocaleString("fa-IR")} <span className="text-xs font-normal text-amber-600">{data.item.unit}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border/80 bg-card text-center">
                <p className="text-[11px] text-muted-foreground font-medium">معیوب / ضایعات</p>
                <p className="text-lg font-black text-rose-600 tabular-nums mt-1">
                  {(data.item.damaged + data.item.scrap).toLocaleString("fa-IR")} <span className="text-xs font-normal text-muted-foreground">{data.item.unit}</span>
                </p>
              </div>
            </div>

            {/* Warehouse Location & Batch identifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-border/70 bg-secondary/10 text-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-amber-600 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-[11px]">موقعیت در انبار:</p>
                  <p className="font-semibold text-foreground">{data.item.locationName} ({data.item.locationCode})</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Barcode className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-muted-foreground text-[11px]">شناسه بچ / اسلب:</p>
                  <p className="font-semibold text-foreground">
                    بچ: {data.item.batchNumber || "—"} {data.item.slabId ? `| اسلب: ${data.item.slabId}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Reservations */}
            {data.reservations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5 text-amber-600" />
                  رزروهای فعال متعهد به این کالا
                </h4>
                <div className="space-y-1.5">
                  {data.reservations.map((res) => (
                    <div
                      key={res.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-card text-xs"
                    >
                      <div>
                        <span className="font-semibold text-foreground">{res.reservationNumber}</span>
                        <span className="text-muted-foreground mr-2">({res.customerName || "سفارش آنلاین"})</span>
                      </div>
                      <div className="font-bold text-amber-600 tabular-nums">
                        {res.quantity.toLocaleString("fa-IR")} {res.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Kardex History for this Item */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-primary" />
                گردش‌های اخیر کاردکس برای این کالا
              </h4>
              <div className="rounded-xl border border-border/70 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-secondary/40 text-muted-foreground font-semibold">
                    <tr>
                      <th className="px-3 py-2 text-start">نوع گردش</th>
                      <th className="px-3 py-2 text-center">مقدار</th>
                      <th className="px-3 py-2 text-center">موجودی پس از گردش</th>
                      <th className="px-3 py-2 text-start">علت</th>
                      <th className="px-3 py-2 text-end">تاریخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {data.movements.slice(0, 5).map((mov) => (
                      <tr key={mov.id} className="hover:bg-secondary/10">
                        <td className="px-3 py-2 whitespace-nowrap">
                          <MovementTypeBadge type={mov.type} />
                        </td>
                        <td className="px-3 py-2 text-center font-bold tabular-nums">
                          {mov.quantity.toLocaleString("fa-IR")} {mov.unit}
                        </td>
                        <td className="px-3 py-2 text-center tabular-nums text-muted-foreground">
                          {mov.balanceAfter.toLocaleString("fa-IR")} {mov.unit}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground max-w-[150px] truncate">
                          {mov.reason || mov.referenceNumber || "—"}
                        </td>
                        <td className="px-3 py-2 text-end text-[11px] text-muted-foreground whitespace-nowrap">
                          {mov.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
