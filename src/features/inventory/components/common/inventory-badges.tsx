"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  INVENTORY_STATUS_LABELS,
  INVENTORY_UNIT_LABELS,
  MOVEMENT_TYPE_LABELS,
  LOCATION_TYPE_LABELS,
  type InventoryItemStatus,
  type InventoryUnit,
  type MovementType,
  type LocationType,
} from "@/modules/inventory/domain/value-objects/inventory-status.vo";

export function InventoryStatusBadge({ status }: { status: InventoryItemStatus }) {
  const label = INVENTORY_STATUS_LABELS[status] || status;

  switch (status) {
    case "AVAILABLE":
      return (
        <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {label}
        </Badge>
      );
    case "RESERVED":
      return (
        <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 text-[11px] font-semibold gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {label}
        </Badge>
      );
    case "QUALITY_CHECK":
      return (
        <Badge variant="outline" className="border-sky-500/40 bg-sky-500/10 text-sky-700 text-[11px] font-semibold gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          {label}
        </Badge>
      );
    case "DAMAGED":
      return (
        <Badge variant="outline" className="border-rose-500/40 bg-rose-500/10 text-rose-700 text-[11px] font-semibold gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          {label}
        </Badge>
      );
    case "SCRAPPED":
      return (
        <Badge variant="outline" className="border-zinc-500/40 bg-zinc-500/10 text-zinc-700 text-[11px] font-semibold gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
          {label}
        </Badge>
      );
    default:
      return <Badge variant="secondary" className="text-[11px]">{label}</Badge>;
  }
}

export function MovementTypeBadge({ type }: { type: MovementType }) {
  const label = MOVEMENT_TYPE_LABELS[type] || type;
  const isInflow = type === "RECEIPT" || type === "TRANSFER_IN" || type === "ADJUSTMENT_IN" || type === "INITIAL";
  const isOutflow = type === "ISSUE" || type === "TRANSFER_OUT" || type === "ADJUSTMENT_OUT";

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-medium gap-1",
        isInflow && "border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
        isOutflow && "border-rose-500/40 bg-rose-500/10 text-rose-700",
        !isInflow && !isOutflow && "border-amber-500/40 bg-amber-500/10 text-amber-700"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isInflow && "bg-emerald-500",
          isOutflow && "bg-rose-500",
          !isInflow && !isOutflow && "bg-amber-500"
        )}
      />
      {label}
    </Badge>
  );
}

export function LocationTypeBadge({ type }: { type: LocationType }) {
  const label = LOCATION_TYPE_LABELS[type] || type;
  return (
    <Badge variant="secondary" className="text-[10px] font-normal border border-border/80">
      {label}
    </Badge>
  );
}

export function StoneUnitBadge({ unit }: { unit: InventoryUnit }) {
  const label = INVENTORY_UNIT_LABELS[unit] || unit;
  return (
    <span className="inline-flex items-center rounded-md bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      {label}
    </span>
  );
}
