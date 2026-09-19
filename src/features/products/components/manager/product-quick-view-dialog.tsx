"use client";

import {
  Layers,
  MapPin,
  Ruler,
  Tag,
  ShieldCheck,
  ExternalLink,
  Package,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import {
  STONE_TYPE_LABELS,
  STONE_COLOR_LABELS,
  STONE_FINISH_LABELS,
  STONE_FORM_LABELS,
  STONE_APPLICATION_LABELS,
  PRICING_UNIT_LABELS,
} from "../../constants";

interface ProductQuickViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductQuickViewDialog({
  open,
  onOpenChange,
  product,
}: ProductQuickViewDialogProps) {
  if (!product) return null;

  const totalInventory = product.variants.reduce((acc, v) => acc + (v.inventory || 0), 0);
  const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-start pb-2 border-b border-border/60">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {product.name}
                </DialogTitle>
                <p className="text-[11px] text-muted-foreground font-mono" dir="ltr">
                  /{product.slug}
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className={
                product.status === "published"
                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-[10px]"
                  : product.status === "draft"
                  ? "bg-amber-500/10 text-amber-700 border-amber-500/30 text-[10px]"
                  : "bg-secondary text-secondary-foreground text-[10px]"
              }
            >
              {product.status === "published"
                ? "منتشرشده در شوروم"
                : product.status === "draft"
                ? "پیش‌نویس"
                : "بایگانی شده"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Main Hero & Gallery Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative aspect-[16/10] overflow-hidden rounded-xl border border-border/80 bg-secondary/30">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  فاقد تصویر
                </div>
              )}
            </div>

            {/* Price & Stock Highlight Box */}
            <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-secondary/30 p-3.5">
              <div>
                <span className="text-[11px] text-muted-foreground">قیمت فروش کارخانه:</span>
                <p className="text-lg font-bold text-foreground mt-1 tabular-nums">
                  {product.price ? `${product.price.toLocaleString("fa-IR")} تومان` : "استعلامی"}
                </p>
                {product.pricingUnit && (
                  <p className="text-[10px] text-muted-foreground">
                    به ازای هر {PRICING_UNIT_LABELS[product.pricingUnit] ?? product.pricingUnit}
                  </p>
                )}

                {product.compareAtPrice && product.price && product.compareAtPrice > product.price && (
                  <p className="mt-1 text-[11px] text-muted-foreground line-through tabular-nums">
                    {product.compareAtPrice.toLocaleString("fa-IR")} تومان
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-border/50">
                <span className="text-[11px] text-muted-foreground">موجودی آماده بارگیری:</span>
                <div className="mt-1 flex items-center gap-1.5 font-bold text-foreground tabular-nums">
                  <Package className="h-4 w-4 text-primary" />
                  <span>
                    {totalInventory.toLocaleString("fa-IR")} {product.inventoryUnit ?? "واحد"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="rounded-xl border border-border/60 bg-card p-3">
              <p className="font-semibold text-xs text-foreground mb-1">
                توضیحات و کاربرد:
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-lg border border-border/50 bg-card p-2.5">
              <span className="text-[10px] text-muted-foreground">نوع سنگ</span>
              <p className="font-bold text-xs text-foreground mt-0.5">
                {product.stoneType ? STONE_TYPE_LABELS[product.stoneType] : "نامشخص"}
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-2.5">
              <span className="text-[10px] text-muted-foreground">رنگ و تم</span>
              <p className="font-bold text-xs text-foreground mt-0.5">
                {product.color ? STONE_COLOR_LABELS[product.color] : "نامشخص"}
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-2.5">
              <span className="text-[10px] text-muted-foreground">نوع فرآوری و فینیش</span>
              <p className="font-bold text-xs text-foreground mt-0.5">
                {product.finish ? STONE_FINISH_LABELS[product.finish] : "ساب صیقلی"}
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-2.5">
              <span className="text-[10px] text-muted-foreground">فرم و قواره</span>
              <p className="font-bold text-xs text-foreground mt-0.5">
                {product.form ? STONE_FORM_LABELS[product.form] : "اسلب"}
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-2.5">
              <span className="text-[10px] text-muted-foreground">ابعاد</span>
              <p className="font-bold text-xs text-foreground mt-0.5">
                {product.dimensions || "—"}
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-2.5">
              <span className="text-[10px] text-muted-foreground">ضخامت</span>
              <p className="font-bold text-xs text-foreground mt-0.5">
                {product.thickness ? `${product.thickness} سانتی‌متر` : "—"}
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-2.5">
              <span className="text-[10px] text-muted-foreground">خاستگاه و معدن</span>
              <p className="font-bold text-xs text-foreground mt-0.5 truncate">
                {product.origin || product.quarry || "—"}
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-2.5">
              <span className="text-[10px] text-muted-foreground">سورت و درجه</span>
              <p className="font-bold text-xs text-foreground mt-0.5">
                {product.grade || "سوپر ممتاز"}
              </p>
            </div>
          </div>

          {/* Technical Specs Attributes */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-card p-3 space-y-2">
              <p className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>آنالیز آزمایشگاهی و ویژگی‌های فنی:</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.attributes.map((att) => (
                  <div key={att.id} className="flex items-center justify-between rounded bg-secondary/50 px-2.5 py-1 text-[11px]">
                    <span className="text-muted-foreground">{att.name}:</span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {att.value} {att.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Gallery images */}
          {product.images.length > 1 && (
            <div>
              <p className="font-semibold text-xs text-foreground mb-1.5">
                سایر تصاویر و زوایای اسلب:
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={img.alt || product.name}
                    className="h-16 w-24 shrink-0 rounded-lg border border-border/70 object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Link to Edit */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <Button asChild size="sm" variant="outline" className="text-xs gap-1.5">
            <Link href={`/dashboard/products/${product.id}/edit`}>
              ویرایش کامل محصول
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            بستن
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
