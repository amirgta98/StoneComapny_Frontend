/**
 * Reviews feature.
 *
 * Manages customer reviews, ratings, moderation workflows, and managerial responses
 * for the stone factory platform.
 */

// Types
export * from "./types";

// Data & Service Layer
export * from "./data/mock-reviews-data";
export * from "./data/reviews-service";

// Zustand Store
export * from "./stores/reviews-store";

// Components
export { StarRating } from "./components/star-rating";
export { ReviewsStatsCards } from "./components/reviews-stats-cards";
export { ReviewReplyDialog } from "./components/review-reply-dialog";
export { ReviewRejectDialog } from "./components/review-reject-dialog";
export { ReviewDeleteDialog } from "./components/review-delete-dialog";
export { ReviewDetailDialog } from "./components/review-detail-dialog";
export { ReviewsManagerView } from "./components/reviews-manager-view";