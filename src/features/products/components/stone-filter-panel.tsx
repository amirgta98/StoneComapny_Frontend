"use client";

import { Check } from "lucide-react";

import type { StoneColor } from "@/constants";
import { cn } from "@/lib/utils";

import {
  STONE_APPLICATION_LABELS,
  STONE_COLOR_LABELS,
  STONE_COLOR_SWATCHES,
  STONE_FINISH_LABELS,
  STONE_FORM_LABELS,
  STONE_TYPE_LABELS,
  stoneLabel,
} from "../constants";
import type { ProductFilters } from "../types";

/**
 * Facet keys backed by a single-select field on `Product`.
 * Derived from the actual (tenant) product data at render time, so the
 * panel is data-driven and free of tenant-specific assumptions.
 */
export type StoneFacetKey =
  | "stoneType"
  | "color"
  | "form"
  | "application"
  | "finish";

export const FACET_KEYS: StoneFacetKey[] = [
  "stoneType",
  "color",
  "form",
  "application",
  "finish",
];

/** Persian section titles per facet. */
export const FACET_LABELS: Record<StoneFacetKey, string> = {
  stoneType: "نوع سنگ",
  color: "رنگ",
  form: "نوع محصول",
  application: "کاربرد",
  finish: "پرداخت سطح",
};

/** Persian value labels per facet (reused by active-filter chips). */
export const FACET_LABEL_MAPS: Record<StoneFacetKey, Record<string, string>> = {
  stoneType: STONE_TYPE_LABELS,
  color: STONE_COLOR_LABELS,
  form: STONE_FORM_LABELS,
  application: STONE_APPLICATION_LABELS,
  finish: STONE_FINISH_LABELS,
};

type StoneFilterPanelProps = {
  /** Available values per facet, derived from the product list. */
  facets: Record<StoneFacetKey, string[]>;
  filters: ProductFilters;
  /** Set/clear a single-select facet value. */
  onFacetChange: (key: StoneFacetKey, value: string | undefined) => void;
  /** Toggle the in-stock-only criterion. */
  onInStockChange: (value: boolean) => void;
  className?: string;
};

function FilterOption({
  label,
  active,
  swatch,
  onClick,
}: {
  label: string;
  active: boolean;
  swatch?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        active ? "bg-secondary font-medium" : "hover:bg-accent"
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {swatch && (
          <span
            aria-hidden="true"
            className="size-4 shrink-0 rounded-full border border-border shadow-sm"
            style={{ background: swatch }}
          />
        )}
        <span className="truncate">{label}</span>
      </span>
      {active && <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />}
    </button>
  );
}

/**
 * Stone filter groups: stone type, color (with visual swatches), product
 * form, application, finish and availability.
 *
 * Facet sections render only when the data actually contains values for
 * them, so tenants with a narrower catalog never see empty groups.
 * The same panel renders inside the desktop sidebar and the mobile
 * drawer, keeping both interfaces identical.
 */
export function StoneFilterPanel({
  facets,
  filters,
  onFacetChange,
  onInStockChange,
  className,
}: StoneFilterPanelProps) {
  return (
    <div className={cn("space-y-5", className)}>
      {FACET_KEYS.map((facet) => {
        const values = facets[facet];
        if (values.length === 0) return null;

        const activeValue = filters[facet];

        return (
          <section key={facet}>
            <h3 className="mb-1.5 text-sm font-semibold">{FACET_LABELS[facet]}</h3>
            <div className="space-y-0.5">
              {values.map((value) => {
                const active = activeValue === value;
                return (
                  <FilterOption
                    key={value}
                    label={stoneLabel(FACET_LABEL_MAPS[facet], value) ?? value}
                    active={active}
                    swatch={
                      facet === "color"
                        ? STONE_COLOR_SWATCHES[value as StoneColor]
                        : undefined
                    }
                    onClick={() => onFacetChange(facet, active ? undefined : value)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      <section>
        <h3 className="mb-1.5 text-sm font-semibold">موجودی</h3>
        <FilterOption
          label="فقط کالاهای موجود"
          active={Boolean(filters.inStockOnly)}
          onClick={() => onInStockChange(!filters.inStockOnly)}
        />
      </section>
    </div>
  );
}