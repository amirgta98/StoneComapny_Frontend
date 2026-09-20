"use client";

import { Suspense } from "react";
import { ReviewsManagerView } from "@/features/reviews";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard/reviews — Factory Owner & Tenant Manager Reviews & Feedback Moderation.
 *
 * Dedicated to managing customer reviews on stone catalog items, moderating feedback,
 * issuing managerial responses, and tracking overall customer satisfaction metrics.
 */
function ReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری بخش مدیریت نظرات و بازخوردها...
        </div>
      }
    >
      <ReviewsManagerView />
    </Suspense>
  );
}

export const GuardedReviewsPage = withAuthGuard(ReviewsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedReviewsPage;
