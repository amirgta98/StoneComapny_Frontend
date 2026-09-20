"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  CustomerReview,
  ReviewFilterStatus,
  ReviewReply,
  ReviewSortOption,
  ReviewStats,
  ReviewStatus,
} from "../types";
import { MOCK_REVIEWS } from "../data/mock-reviews-data";
import { reviewsService } from "../data/reviews-service";

interface ReviewsState {
  reviews: CustomerReview[];
  statusFilter: ReviewFilterStatus;
  searchQuery: string;
  ratingFilter: number | "ALL";
  sortBy: ReviewSortOption;
  currentPage: number;
  itemsPerPage: number;

  // Modal dialog states
  isReplyOpen: boolean;
  replyReview: CustomerReview | null;

  isDeleteOpen: boolean;
  deleteReview: CustomerReview | null;

  isDetailOpen: boolean;
  detailReview: CustomerReview | null;

  isRejectOpen: boolean;
  rejectReviewItem: CustomerReview | null;

  // Filter and pagination actions
  setStatusFilter: (status: ReviewFilterStatus) => void;
  setSearchQuery: (query: string) => void;
  setRatingFilter: (rating: number | "ALL") => void;
  setSortBy: (sort: ReviewSortOption) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  clearFilters: () => void;

  // Dialog triggers
  openReplyDialog: (review: CustomerReview) => void;
  closeReplyDialog: () => void;

  openDeleteDialog: (review: CustomerReview) => void;
  closeDeleteDialog: () => void;

  openDetailDialog: (review: CustomerReview) => void;
  closeDetailDialog: () => void;

  openRejectDialog: (review: CustomerReview) => void;
  closeRejectDialog: () => void;

  // Moderation CRUD actions
  approveReview: (id: string) => void;
  rejectReview: (id: string, reason?: string) => void;
  submitReply: (
    id: string,
    comment: string,
    author?: string,
    authorRole?: string
  ) => void;
  deleteReviewItem: (id: string) => void;

  // Stats & Utilities
  getStats: (tenantId?: string) => ReviewStats;
  resetToMock: () => void;
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: MOCK_REVIEWS,
      statusFilter: "ALL",
      searchQuery: "",
      ratingFilter: "ALL",
      sortBy: "newest",
      currentPage: 1,
      itemsPerPage: 6,

      isReplyOpen: false,
      replyReview: null,

      isDeleteOpen: false,
      deleteReview: null,

      isDetailOpen: false,
      detailReview: null,

      isRejectOpen: false,
      rejectReviewItem: null,

      setStatusFilter: (status) =>
        set({ statusFilter: status, currentPage: 1 }),

      setSearchQuery: (query) =>
        set({ searchQuery: query, currentPage: 1 }),

      setRatingFilter: (rating) =>
        set({ ratingFilter: rating, currentPage: 1 }),

      setSortBy: (sort) =>
        set({ sortBy: sort, currentPage: 1 }),

      setCurrentPage: (page) =>
        set({ currentPage: page }),

      setItemsPerPage: (count) =>
        set({ itemsPerPage: count, currentPage: 1 }),

      clearFilters: () =>
        set({
          statusFilter: "ALL",
          searchQuery: "",
          ratingFilter: "ALL",
          sortBy: "newest",
          currentPage: 1,
        }),

      openReplyDialog: (review) =>
        set({ isReplyOpen: true, replyReview: review }),

      closeReplyDialog: () =>
        set({ isReplyOpen: false, replyReview: null }),

      openDeleteDialog: (review) =>
        set({ isDeleteOpen: true, deleteReview: review }),

      closeDeleteDialog: () =>
        set({ isDeleteOpen: false, deleteReview: null }),

      openDetailDialog: (review) =>
        set({ isDetailOpen: true, detailReview: review }),

      closeDetailDialog: () =>
        set({ isDetailOpen: false, detailReview: null }),

      openRejectDialog: (review) =>
        set({ isRejectOpen: true, rejectReviewItem: review }),

      closeRejectDialog: () =>
        set({ isRejectOpen: false, rejectReviewItem: null }),

      approveReview: (id: string) => {
        set((state) => {
          const updated = state.reviews.map((r) => {
            if (r.id === id) {
              return {
                ...r,
                status: "APPROVED" as ReviewStatus,
                rejectionReason: undefined,
              };
            }
            return r;
          });

          return {
            reviews: updated,
            detailReview:
              state.detailReview?.id === id
                ? { ...state.detailReview, status: "APPROVED", rejectionReason: undefined }
                : state.detailReview,
          };
        });
      },

      rejectReview: (id: string, reason?: string) => {
        set((state) => {
          const updated = state.reviews.map((r) => {
            if (r.id === id) {
              return {
                ...r,
                status: "REJECTED" as ReviewStatus,
                rejectionReason: reason || "عدم تطابق با ضوابط انتشار بازخورد مشتریان کارخانه",
              };
            }
            return r;
          });

          return {
            reviews: updated,
            isRejectOpen: false,
            rejectReviewItem: null,
            detailReview:
              state.detailReview?.id === id
                ? {
                    ...state.detailReview,
                    status: "REJECTED",
                    rejectionReason: reason || "عدم تطابق با ضوابط انتشار بازخورد مشتریان کارخانه",
                  }
                : state.detailReview,
          };
        });
      },

      submitReply: (id, comment, author, authorRole) => {
        const now = new Date();
        const dateStr = new Intl.DateTimeFormat("fa-IR", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(now);

        const replyObj: ReviewReply = {
          id: `rep-${Date.now()}`,
          author: author?.trim() || "مدیریت کارخانه سنگ",
          authorRole: authorRole?.trim() || "پاسخ رسمی کارخانه",
          comment: comment.trim(),
          createdAt: `امروز، ${dateStr}`,
        };

        set((state) => {
          const updated = state.reviews.map((r) => {
            if (r.id === id) {
              return {
                ...r,
                reply: replyObj,
              };
            }
            return r;
          });

          return {
            reviews: updated,
            isReplyOpen: false,
            replyReview: null,
            detailReview:
              state.detailReview?.id === id
                ? { ...state.detailReview, reply: replyObj }
                : state.detailReview,
          };
        });
      },

      deleteReviewItem: (id: string) => {
        set((state) => {
          const updated = state.reviews.filter((r) => r.id !== id);
          const maxPage = Math.max(1, Math.ceil(updated.length / state.itemsPerPage));
          return {
            reviews: updated,
            currentPage: Math.min(state.currentPage, maxPage),
            isDeleteOpen: false,
            deleteReview: null,
            isDetailOpen:
              state.detailReview?.id === id ? false : state.isDetailOpen,
            detailReview:
              state.detailReview?.id === id ? null : state.detailReview,
            isReplyOpen:
              state.replyReview?.id === id ? false : state.isReplyOpen,
            replyReview:
              state.replyReview?.id === id ? null : state.replyReview,
            isRejectOpen:
              state.rejectReviewItem?.id === id ? false : state.isRejectOpen,
            rejectReviewItem:
              state.rejectReviewItem?.id === id ? null : state.rejectReviewItem,
          };
        });
      },

      getStats: (tenantId) => {
        const allReviews = get().reviews;
        const tenantScoped = tenantId
          ? allReviews.filter(
              (r) =>
                r.tenantId === tenantId ||
                (!r.tenantId && tenantId === "tenant-001")
            )
          : allReviews;

        return reviewsService.calculateStats(tenantScoped);
      },

      resetToMock: () => {
        set({
          reviews: MOCK_REVIEWS,
          statusFilter: "ALL",
          searchQuery: "",
          ratingFilter: "ALL",
          sortBy: "newest",
          currentPage: 1,
          isReplyOpen: false,
          replyReview: null,
          isDeleteOpen: false,
          deleteReview: null,
          isDetailOpen: false,
          detailReview: null,
          isRejectOpen: false,
          rejectReviewItem: null,
        });
      },
    }),
    {
      name: "stone-factory-reviews-store",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        try {
          const testKey = "__stone_storage_test__";
          window.localStorage.setItem(testKey, testKey);
          window.localStorage.removeItem(testKey);
          return window.localStorage;
        } catch {
          // Fallback in-memory storage if localStorage is blocked by privacy settings
          const memoryMap = new Map<string, string>();
          return {
            getItem: (key: string) => memoryMap.get(key) ?? null,
            setItem: (key: string, val: string) => {
              memoryMap.set(key, val);
            },
            removeItem: (key: string) => {
              memoryMap.delete(key);
            },
          };
        }
      }),
      partialize: (state) => ({
        reviews: state.reviews,
        itemsPerPage: state.itemsPerPage,
      }),
    }
  )
);
