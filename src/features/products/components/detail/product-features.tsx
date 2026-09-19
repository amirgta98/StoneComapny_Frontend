import type { ProductFeatureItem } from "../../types";

type ProductFeatureCardProps = {
  feature: ProductFeatureItem;
  className?: string;
};

/**
 * A single seller-defined product feature card.
 *
 * Renders the data-provided Lucide icon, title and description.
 * Icon/color treatment is fixed by the design system (secondary surface
 * + primary icon color) — features never carry per-item hard-coded colors.
 */
export function ProductFeatureCard({ feature, className }: ProductFeatureCardProps) {
  const Icon = feature.icon;

  return (
    <li
      className={
        "rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30 " +
        (className ?? "")
      }
    >
      <div
        aria-hidden="true"
        className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary"
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </div>

      <h3 className="mt-4 text-sm font-bold leading-snug">{feature.title}</h3>
      {feature.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      )}
    </li>
  );
}

type ProductFeaturesProps = {
  /** Seller-defined features; any number, rendered in the given order. */
  features: ProductFeatureItem[];
  className?: string;
};

/**
 * Dynamic product-features section (data-driven).
 *
 * Maps over the seller-defined feature list — never a fixed number of
 * items and never hard-coded content. Deliberately kept separate from
 * the technical-specifications section: features are benefit-oriented
 * selling points; specifications are structured technical data.
 */
export function ProductFeatures({ features, className }: ProductFeaturesProps) {
  if (features.length === 0) return null;

  return (
    <ul
      className={
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 " + (className ?? "")
      }
    >
      {features.map((feature) => (
        <ProductFeatureCard key={feature.id} feature={feature} />
      ))}
    </ul>
  );
}