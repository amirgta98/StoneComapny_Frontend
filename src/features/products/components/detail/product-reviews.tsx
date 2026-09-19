import { format } from "date-fns";
import { faIR } from "date-fns/locale";

import { EmptyState } from "@/components/data-listing";
import { Stars } from "../product-card";
import type { ProductDetail, ProductReview } from "../../types";

type ProductReviewsProps = {
  product: ProductDetail;
  className?: string;
};

/** One review entry (avatar monogram, author, date, rating, body). */
function ReviewItem({ review }: { review: ProductReview }) {
  return (
    <li className="border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary"
        >
          {review.author.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm font-bold">{review.author}</span>
            <Stars value={review.rating} />
            <time
              dateTime={review.date}
              className="ms-auto text-xs tabular-nums text-muted-foreground"
            >
              {format(new Date(review.date), "d MMMM yyyy", { locale: faIR })}
            </time>
          </div>
          {review.title && (
            <h4 className="mt-2 text-sm font-medium">{review.title}</h4>
          )}
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {review.content}
          </p>
        </div>
      </div>
    </li>
  );
}

/**
 * Reviews section (server-rendered).
 *
 * Average rating + per-star breakdown (computed from the review list)
 * alongside the reviews themselves; shared EmptyState when no reviews
 * exist yet. If `product.rating` is provided without reviews, the
 * summary still renders using the aggregate value.
 */
export function ProductReviews({ product, className }: ProductReviewsProps) {
  const { reviews } = product;

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating;
  const total = product.reviewCount ?? reviews.length;

  /* Per-star counts (5 → 1) for the breakdown bars. */
  const counts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => Math.round(r.rating) === star).length
  );

  if (reviews.length === 0 && average === undefined) {
    return (
      <div className={className}>
        <EmptyState
          title="هنوز دیدگاهی ثبت نشده است"
          description="پس از خرید این محصول، می‌توانید اولین دیدگاه را ثبت کنید."
        />
      </div>
    );
  }

  return (
    <div
      className={
        "grid gap-8 md:grid-cols-[240px_minmax(0,1fr)] " + (className ?? "")
      }
    >
      {/* Summary */}
      <div className="rounded-lg border border-border bg-card p-5">
        {average !== undefined && (
          <>
            <p
              className="text-4xl font-bold tabular-nums"
              aria-label={`میانگین امتیاز ${average.toLocaleString("fa-IR")} از ۵`}
            >
              {average.toLocaleString("fa-IR", {
                maximumFractionDigits: 1,
              })}
            </p>
            <div className="mt-2">
              <Stars value={average} />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              از مجموع {total.toLocaleString("fa-IR")} دیدگاه
            </p>
          </>
        )}

        {reviews.length > 0 && (
          <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
            {counts.map((count, index) => {
              const star = 5 - index;
              const percent = reviews.length
                ? (count / reviews.length) * 100
                : 0;
              return (
                <li key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 shrink-0 tabular-nums text-muted-foreground">
                    {star.toLocaleString("fa-IR")}
                  </span>
                  <div
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                    role="presentation"
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-5 shrink-0 text-end tabular-nums text-muted-foreground">
                    {count.toLocaleString("fa-IR")}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Review list */}
      {reviews.length > 0 ? (
        <ul className="rounded-lg border border-border bg-card px-5 py-1 sm:px-6">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </ul>
      ) : (
        <EmptyState
          title="هنوز دیدگاهی ثبت نشده است"
          description="پس از خرید این محصول، می‌توانید اولین دیدگاه را ثبت کنید."
        />
      )}
    </div>
  );
}