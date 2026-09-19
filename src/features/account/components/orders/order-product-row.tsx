"use client";

import Link from "next/link";
import Image from "next/image";
import { Layers, Sparkles, Ruler, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OrderItem } from "../../data/mock-data";

interface OrderProductRowProps {
  item: OrderItem;
}

export function OrderProductRow({ item }: OrderProductRowProps) {
  const content = (
    <div className="group relative flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-border hover:shadow-xs sm:flex-row sm:items-center">
      {/* Product Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-secondary sm:h-20 sm:w-20">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 96px, 80px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Main Details */}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {item.name}
          </h4>
          {item.grade && (
            <Badge
              variant="outline"
              className="border-border/80 bg-secondary/60 text-[11px] font-medium text-foreground"
            >
              <ShieldCheck className="me-1 h-3 w-3 text-primary" />
              {item.grade}
            </Badge>
          )}
          {item.sku && (
            <span className="text-[11px] text-muted-foreground">
              کد: {item.sku}
            </span>
          )}
        </div>

        {/* Stone Specifications Grid / Badges */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {item.stoneType && (
            <div className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              <span>جنس:</span>
              <span className="font-medium text-foreground">{item.stoneType}</span>
            </div>
          )}

          {item.stoneColor && (
            <div className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full border border-border bg-muted-foreground/30" />
              <span>رنگ:</span>
              <span className="font-medium text-foreground">{item.stoneColor}</span>
            </div>
          )}

          {item.dimensions && (
            <div className="flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
              <span>ابعاد:</span>
              <span className="font-medium text-foreground">{item.dimensions}</span>
            </div>
          )}

          {item.thickness && (
            <div className="flex items-center gap-1">
              <span>ضخامت:</span>
              <span className="font-medium text-foreground">{item.thickness}</span>
            </div>
          )}

          {item.finish && (
            <div className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              <span>فرآوری:</span>
              <span className="font-medium text-foreground">{item.finish}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quantity & Pricing */}
      <div className="flex flex-row items-center justify-between border-t border-border/60 pt-3 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0">
        <div className="text-start sm:text-end">
          <div className="text-xs text-muted-foreground">تعداد / متراژ</div>
          <div className="text-sm font-semibold tabular-nums text-foreground">
            {item.quantity.toLocaleString("fa-IR")} {item.unit}
          </div>
          {item.unitPrice > 0 && (
            <div className="text-[11px] text-muted-foreground tabular-nums">
              فی: {item.unitPrice.toLocaleString("fa-IR")} تومان
            </div>
          )}
        </div>

        <div className="text-end">
          <div className="text-xs text-muted-foreground sm:hidden">مبلغ کل</div>
          <div className="text-sm font-bold tabular-nums text-foreground sm:text-base">
            {item.totalPrice.toLocaleString("fa-IR")} تومان
          </div>
        </div>
      </div>
    </div>
  );

  if (item.productId) {
    return (
      <Link href={`/products/${item.productId}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
