import type { ReactNode } from "react";

type SectionProps = {
  /** Small label shown above the title (optional) — text or custom nodes. */
  eyebrow?: ReactNode;
  /** Section heading (optional) — text or custom nodes (e.g. with badges). */
  title?: ReactNode;
  /** Supporting text below the title (optional). */
  description?: string;
  /**
   * Slot rendered at the end of the header row
   * (e.g., navigation arrows, "view all" link).
   */
  action?: ReactNode;
  /** Accessible name for the section landmark (optional). */
  "aria-label"?: string;
  /** Section content. */
  children: ReactNode;
  className?: string;
};

/**
 * Reusable section divider for storefront pages.
 *
 * Compact editorial layout:
 * - Slim header row: eyebrow + title (+ description) on the start side,
 *   optional action slot on the end side.
 * - Content is rendered below the header.
 *
 * Use this component to divide sections on storefront pages instead of
 * hand-writing section headers inline. Keep page files thin by composing
 * sections from this primitive.
 *
 * Note: Persian text must not use letter-spacing (`tracking-*`), as it
 * breaks Persian letter connections — intentionally omitted here.
 */
export function Section({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
  ...rest
}: SectionProps) {
  const hasHeader = Boolean(eyebrow || title || description || action);

  return (
    <section className={className} {...rest}>
      {hasHeader && (
        <div
          data-slot="section-header"
          className="mb-5 flex items-end justify-between gap-4 md:mb-6"
        >
          {(eyebrow || title || description) && (
            <div className="space-y-1">
              {eyebrow && (
                <p className="text-xs font-medium text-muted-foreground">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}

          {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </div>
      )}

      {children}
    </section>
  );
}