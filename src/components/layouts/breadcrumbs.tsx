import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  /** Visible label of the crumb. */
  label: string;
  /** Destination; omit for the current (last) crumb. */
  href?: string;
};

type BreadcrumbsProps = {
  /** Ordered crumbs from root to the current page. */
  items: BreadcrumbItem[];
  /** Accessible name for the nav landmark. */
  "aria-label"?: string;
  className?: string;
};

/**
 * Reusable RTL breadcrumb navigation.
 *
 * Renders a semantic `nav > ol` list; the last item is the current page
 * (`aria-current="page"`) and is rendered as plain emphasized text while
 * the rest are links. Separators use `ChevronLeft`, which points toward
 * the end side in RTL — consistent with the rest of the storefront.
 */
export function Breadcrumbs({
  items,
  "aria-label": ariaLabel = "breadcrumb",
  className,
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {!isLast && item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(isLast && "font-medium text-foreground")}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <ChevronLeft className="size-3.5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}