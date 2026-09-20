import type { CustomerReview, ReviewStats } from "../types";
import { MOCK_REVIEWS } from "./mock-reviews-data";

/**
 * Reviews Data Service Layer.
 * Provides client-side and simulated API methods for customer reviews management.
 */
export const reviewsService = {
  /**
   * Fetch reviews, optionally scoped by tenantId.
   */
  async getReviews(tenantId?: string): Promise<CustomerReview[]> {
    // In demo / prototype mode, return mock reviews scoped by tenant if provided
    if (!tenantId) {
      return [...MOCK_REVIEWS];
    }
    return MOCK_REVIEWS.filter(
      (r) => r.tenantId === tenantId || (!r.tenantId && tenantId === "tenant-001")
    );
  },

  /**
   * Calculate summary statistics from reviews array.
   */
  calculateStats(reviews: CustomerReview[]): ReviewStats {
    const total = reviews.length;
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let totalScore = 0;

    reviews.forEach((r) => {
      if (r.status === "PENDING") pending += 1;
      else if (r.status === "APPROVED") approved += 1;
      else if (r.status === "REJECTED") rejected += 1;

      totalScore += r.rating;
    });

    const averageRating =
      total > 0 ? parseFloat((totalScore / total).toFixed(1)) : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      averageRating,
    };
  },
};
