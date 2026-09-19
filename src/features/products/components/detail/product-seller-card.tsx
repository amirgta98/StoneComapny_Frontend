import Image from "next/image";
import { BadgeCheck, MapPin, Phone } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import { EmptyState } from "@/components/data-listing";
import type { ProductSeller } from "../../types";

type ProductSellerCardProps = {
  /** Tenant (seller/factory) summary; optional until tenants resolve. */
  seller?: ProductSeller;
  className?: string;
};

/**
 * Seller / factory information card.
 *
 * Multi-tenant aware: everything (logo, name, location, phone,
 * verification) comes from the tenant-scoped data — no hard-coded
 * brand, color or logo. Falls back to the shared EmptyState when the
 * product carries no seller information.
 */
export function ProductSellerCard({ seller, className }: ProductSellerCardProps) {
  if (!seller) {
    return (
      <EmptyState
        title="اطلاعات فروشنده ثبت نشده است"
        description="به‌زودی اطلاعات کارخانه یا فروشنده این محصول در دسترس قرار می‌گیرد."
      />
    );
  }

  return (
    <div
      className={
        "flex flex-col gap-5 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:p-6 " +
        (className ?? "")
      }
    >
      {/* Logo (or fallback initial monogram) */}
      {seller.logo ? (
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
          <Image
            src={seller.logo}
            alt={`لوگوی ${seller.name}`}
            fill
            sizes="56px"
            className="object-contain p-1.5"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-secondary text-xl font-bold text-primary"
        >
          {seller.name.charAt(0)}
        </div>
      )}

      {/* Identity */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold">{seller.name}</h3>
          {seller.verified && (
            <Badge variant="secondary" className="gap-1">
              <BadgeCheck className="size-3.5 text-primary" aria-hidden="true" />
              فروشنده تاییدشده
            </Badge>
          )}
        </div>
        {seller.location && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            {seller.location}
          </p>
        )}
      </div>

      {/* Contact */}
      {seller.phone && (
        <Button variant="outline" asChild className="shrink-0">
          <a href={`tel:${seller.phone}`}>
            <Phone className="size-4" aria-hidden="true" />
            تماس با فروشنده
          </a>
        </Button>
      )}
    </div>
  );
}