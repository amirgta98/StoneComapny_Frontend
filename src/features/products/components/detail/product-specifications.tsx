import type { ProductDetail } from "../../types";

type ProductSpecificationsProps = {
  product: ProductDetail;
  className?: string;
};

/**
 * Structured technical-specifications table.
 *
 * Combines the explicit `specifications` rows with the product's
 * open-ended `attributes` (label/value/unit pairs). Values may mix
 * Persian text with Latin units (%, MPa, g/cm³) — `dir="auto"` keeps
 * bidirectional values readable in the RTL layout.
 *
 * Visually distinct from `ProductFeatures`: this is a clean definition
 * list, not icon cards, keeping selling points and technical data apart.
 */
export function ProductSpecifications({
  product,
  className,
}: ProductSpecificationsProps) {
  const rows = [
    ...product.specifications,
    ...product.attributes.map((attribute) => ({
      label: attribute.name,
      value: attribute.unit
        ? `${attribute.value} ${attribute.unit}`
        : attribute.value,
    })),
  ];

  if (rows.length === 0) return null;

  return (
    <dl className={"grid gap-x-10 sm:grid-cols-2 " + (className ?? "")}>
      {rows.map((row, index) => (
        <div
          key={`${row.label}-${index}`}
          className="flex items-baseline justify-between gap-4 border-b border-border/70 py-3"
        >
          <dt className="shrink-0 text-sm text-muted-foreground">
            {row.label}
          </dt>
          <dd dir="auto" className="text-end text-sm font-medium">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}