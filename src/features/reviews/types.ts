/**
 * Customer Reviews & Moderation Type Definitions.
 */

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ReviewFilterStatus = "ALL" | ReviewStatus;

export interface ReviewReply {
  id: string;
  author: string;
  authorRole?: string;
  comment: string;
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  tenantId?: string;
  customerName: string;
  customerRole?: string; // e.g. "معمار", "پیمانکار", "طراح داخلی", "خریدار شخصی"
  customerPhone?: string;
  customerEmail?: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  createdAtIso?: string; // ISO 8601 string for reliable chronological sorting
  reply?: ReviewReply | null;
  verifiedPurchase?: boolean;
  rejectionReason?: string;
  likesCount?: number;
}

export interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  averageRating: number;
}

export type ReviewSortOption =
  | "newest"
  | "oldest"
  | "rating_high"
  | "rating_low";
