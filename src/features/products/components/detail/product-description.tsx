import { CheckCircle2 } from "lucide-react";

import type { ProductDetail } from "../../types";

type ProductDescriptionProps = {
  product: ProductDetail;
  className?: string;
};

/**
 * Product description section.
 *
 * Renders the paragraph-by-paragraph `descriptionParagraphs` content
 * plus the `descriptionNotes` bullet list. Falls back to the base
 * `description` field when structured paragraphs are absent, and hides
 * itself entirely when there is no content at all.
 */
export function ProductDescription({
  product,
  className,
}: ProductDescriptionProps) {
  const paragraphs =
    product.descriptionParagraphs ??
    (product.description ? [product.description] : []);
  const notes = product.descriptionNotes ?? [];

  if (paragraphs.length === 0 && notes.length === 0) return null;

  return (
    <div className={className}>
      {paragraphs.length > 0 && (
        <div className="max-w-3xl space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-sm leading-7 text-foreground/90 sm:text-base sm:leading-8"
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {notes.length > 0 && (
        <ul className="mt-6 max-w-3xl space-y-2.5 rounded-lg border border-border bg-muted/40 p-5">
          {notes.map((note, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className="leading-6 text-foreground/90">{note}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}