"use client";

import {
  MapPin,
  Phone,
  User,
  Hash,
  Building,
  Layers,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CustomerAddress, AddressCardMode } from "../../types/address";
import { DefaultAddressBadge } from "./default-address-badge";
import { AddressActions } from "./address-actions";

interface AddressCardProps {
  address: CustomerAddress;
  mode?: AddressCardMode;
  isSelected?: boolean;
  onSelect?: (address: CustomerAddress) => void;
  onDelete?: (address: CustomerAddress) => void;
  onSetDefaultShipping?: (id: string) => void;
  onSetDefaultBilling?: (id: string) => void;
  className?: string;
}

const deliveryTypeLabels: Record<string, string> = {
  curbside: "تحویل پیاده‌رو",
  crane: "تخلیه با جرثقیل",
  forklift: "تخلیه با لیفتراک",
};

export function AddressCard({
  address,
  mode = "account",
  isSelected = false,
  onSelect,
  onDelete,
  onSetDefaultShipping,
  onSetDefaultBilling,
  className,
}: AddressCardProps) {
  const isDefault = address.isDefaultShipping || address.isDefaultBilling;

  // Checkout selectable mode
  if (mode === "checkout") {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect?.(address)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.(address)}
        }}
        className={cn(
          "relative cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all text-start outline-none",
          isSelected
            ? "border-primary bg-primary/[0.03] shadow-xs ring-2 ring-primary/20"
            : "border-border bg-card hover:border-border/80 hover:bg-secondary/20",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 bg-background"
              )}
            >
              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
            <span className="font-bold text-sm sm:text-base text-foreground">
              {address.title}
            </span>
          </div>

          <DefaultAddressBadge
            isDefaultShipping={address.isDefaultShipping}
            isDefaultBilling={address.isDefaultBilling}
            size="sm"
          />
        </div>

        <div className="mt-3 space-y-1.5 ps-7 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              {address.firstName} {address.lastName}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              {address.phone}
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {address.province}، {address.city}، {address.address}، پلاک {address.plaque}
            {address.unit ? `، واحد ${address.unit}` : ""}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <Hash className="h-3 w-3" />
            <span>کد پستی: {address.postalCode}</span>
          </div>
        </div>
      </div>
    );
  }

  // Readonly mode for orders, invoices or receipts
  if (mode === "readonly") {
    return (
      <div className={cn("rounded-xl border border-border bg-card p-4 text-xs sm:text-sm space-y-2", className)}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">{address.title}</span>
          <span className="text-muted-foreground font-medium">
            {address.firstName} {address.lastName} ({address.phone})
          </span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {address.province}، {address.city}، {address.address}، پلاک {address.plaque}
          {address.unit ? `، واحد ${address.unit}` : ""}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          کد پستی: {address.postalCode}
        </p>
      </div>
    );
  }

  // Main Account Mode
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card transition-all duration-200",
        isDefault
          ? "border-primary/40 shadow-xs ring-1 ring-primary/10"
          : "border-border shadow-xs hover:border-border/90 hover:shadow-sm",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 p-4 pb-3 sm:p-5 sm:pb-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
              <MapPin className="h-4 w-4 stroke-[1.8] text-primary" />
            </div>
            <CardTitle className="text-base font-bold text-foreground">
              {address.title}
            </CardTitle>
          </div>

          <DefaultAddressBadge
            isDefaultShipping={address.isDefaultShipping}
            isDefaultBilling={address.isDefaultBilling}
            size="sm"
          />
        </div>

        {/* Actions Menu */}
        {onDelete && onSetDefaultShipping && onSetDefaultBilling && (
          <AddressActions
            address={address}
            onDelete={onDelete}
            onSetDefaultShipping={onSetDefaultShipping}
            onSetDefaultBilling={onSetDefaultBilling}
            variant="inline"
          />
        )}
      </CardHeader>

      <CardContent className="space-y-3.5 p-4 pt-1 sm:p-5 sm:pt-1 text-sm">
        {/* Recipient & Contact Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl bg-secondary/30 p-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span>تحویل‌گیرنده:</span>
            <span className="font-bold">{address.firstName} {address.lastName}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <span dir="ltr">{address.phone}</span>
          </div>
        </div>

        {/* Full Address Details */}
        <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">
              {address.province}، {address.city}
            </span>
            {" — "}
            <span>
              {address.address}، پلاک {address.plaque}
              {address.unit ? `، واحد ${address.unit}` : ""}
            </span>
          </div>

          <div className="flex items-center gap-1 pt-1 font-mono text-xs text-muted-foreground">
            <Hash className="h-3 w-3 text-muted-foreground" />
            <span>کد پستی:</span>
            <span className="text-foreground tracking-wider">{address.postalCode}</span>
          </div>
        </div>

        {/* Stone Logistics & Unloading specifications */}
        {(address.floor ||
          address.hasFreightElevator ||
          address.craneAccess ||
          address.deliveryType) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/60">
            {address.floor && (
              <Badge variant="outline" className="border-border bg-secondary/40 text-[11px] font-normal text-muted-foreground">
                <Building className="me-1 h-3 w-3" />
                طبقه: {address.floor}
              </Badge>
            )}
            {address.deliveryType && (
              <Badge variant="outline" className="border-border bg-secondary/40 text-[11px] font-normal text-muted-foreground">
                <Layers className="me-1 h-3 w-3" />
                {deliveryTypeLabels[address.deliveryType] || address.deliveryType}
              </Badge>
            )}
            {address.hasFreightElevator && (
              <Badge variant="outline" className="border-border bg-secondary/40 text-[11px] font-normal text-muted-foreground">
                آسانسور باربر
              </Badge>
            )}
            {address.craneAccess && (
              <Badge variant="outline" className="border-border bg-secondary/40 text-[11px] font-normal text-muted-foreground">
                دسترسی جرثقیل
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
