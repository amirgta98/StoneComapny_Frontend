import {
  Building2,
  ChefHat,
  Droplets,
  Flame,
  Footprints,
  Layers,
  LayoutGrid,
  Sparkles,
  Sprout,
  TreePine,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { StoneApplication } from "@/constants";

import { STONE_APPLICATION_LABELS, stoneLabel } from "../../constants";
import type { ProductDetail } from "../../types";

/** Visual icon per stone application (domain constant — not per-tenant). */
const APPLICATION_ICONS: Record<StoneApplication, LucideIcon> = {
  countertop: ChefHat,
  flooring: LayoutGrid,
  "wall-cladding": Layers,
  facade: Building2,
  bathroom: Droplets,
  kitchen: UtensilsCrossed,
  fireplace: Flame,
  outdoor: TreePine,
  landscaping: Sprout,
  staircase: Footprints,
  "feature-wall": Sparkles,
};

type ProductApplicationsProps = {
  product: ProductDetail;
  className?: string;
};

/**
 * Applications / use-cases section.
 *
 * Renders the stone's `applications` as icon chips, reusing the shared
 * application label map so the same naming appears in navigation,
 * filters and detail pages alike.
 */
export function ProductApplications({
  product,
  className,
}: ProductApplicationsProps) {
  if (product.applications.length === 0) return null;

  return (
    <ul className={"flex flex-wrap gap-2.5 " + (className ?? "")}>
      {product.applications.map((application) => {
        const Icon = APPLICATION_ICONS[application];
        const label = stoneLabel(STONE_APPLICATION_LABELS, application);

        return (
          <li
            key={application}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
          >
            {Icon && (
              <Icon
                className="size-4 shrink-0 text-primary"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            )}
            {label}
          </li>
        );
      })}
    </ul>
  );
}