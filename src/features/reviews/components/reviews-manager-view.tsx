"use client";

import { useMemo, useEffect } from "react";
import Image from "next/image";
import {
  MessageSquareText,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Eye,
  Trash2,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useReviewsStore } from "../stores/reviews-store";
import { useAuth, canAccessTenantResource } from "@/auth";
import type { ReviewFilterStatus, ReviewSortOption } from "../types";
import { ReviewsStatsCards } from "./reviews-stats-cards";
import { StarRating } from "./star-rating";
import { ReviewReplyDialog } from "./review-reply-dialog";
import { ReviewRejectDialog } from "./review-reject-dialog";
import { ReviewDeleteDialog } from "./review-delete-dialog";
import { ReviewDetailDialog } from "./review-detail-dialog";

export const normalizeSearchText = (text?: string | null): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/[آأإ]/g, "ا")
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const getPaginationRange = (current: number, total: number): (number | string)[] => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, "ellipsis-1", total];
  }
  if (current >= total - 2) {
    return [1, "ellipsis-1", total - 3, total - 2, total - 1, total];
  }
  return [1, "ellipsis-1", current - 1, current, current + 1, "ellipsis-2", total];
};

export function ReviewsManagerView() {
  const { user } = useAuth();
  const reviews = useReviewsStore((s) => s.reviews);
  const statusFilter = useReviewsStore((s) => s.statusFilter);
  const searchQuery = useReviewsStore((s) => s.searchQuery);
  const ratingFilter = useReviewsStore((s) => s.ratingFilter);
  const sortBy = useReviewsStore((s) => s.sortBy);
  const currentPage = useReviewsStore((s) => s.currentPage);
  const itemsPerPage = useReviewsStore((s) => s.itemsPerPage);

  const setStatusFilter = useReviewsStore((s) => s.setStatusFilter);
  const setSearchQuery = useReviewsStore((s) => s.setSearchQuery);
  const setRatingFilter = useReviewsStore((s) => s.setRatingFilter);
  const setSortBy = useReviewsStore((s) => s.setSortBy);
  const setCurrentPage = useReviewsStore((s) => s.setCurrentPage);
  const setItemsPerPage = useReviewsStore((s) => s.setItemsPerPage);
  const clearFilters = useReviewsStore((s) => s.clearFilters);
  const resetToMock = useReviewsStore((s) => s.resetToMock);

  const approveReview = useReviewsStore((s) => s.approveReview);
  const openRejectDialog = useReviewsStore((s) => s.openRejectDialog);
  const openReplyDialog = useReviewsStore((s) => s.openReplyDialog);
  const openDeleteDialog = useReviewsStore((s) => s.openDeleteDialog);
  const openDetailDialog = useReviewsStore((s) => s.openDetailDialog);

  // Tenant-scoped reviews check
  const scopedReviews = useMemo(() => {
    if (!user || user.role === "SUPER_ADMIN") {
      return reviews;
    }
    return reviews.filter((r) =>
      canAccessTenantResource(user, r.tenantId || "tenant-001")
    );
  }, [reviews, user]);

  // Summary counts for tabs
  const tabCounts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    scopedReviews.forEach((r) => {
      if (r.status === "PENDING") pending += 1;
      else if (r.status === "APPROVED") approved += 1;
      else if (r.status === "REJECTED") rejected += 1;
    });

    return {
      all: scopedReviews.length,
      pending,
      approved,
      rejected,
    };
  }, [scopedReviews]);

  // Overall stats
  const stats = useMemo(() => {
    const total = scopedReviews.length;
    let totalScore = 0;
    scopedReviews.forEach((r) => {
      totalScore += r.rating;
    });
    const averageRating =
      total > 0 ? parseFloat((totalScore / total).toFixed(1)) : 0;

    return {
      total,
      pending: tabCounts.pending,
      approved: tabCounts.approved,
      rejected: tabCounts.rejected,
      averageRating,
    };
  }, [scopedReviews, tabCounts]);

  // Filter & Search & Sort logic
  const filteredReviews = useMemo(() => {
    return scopedReviews
      .filter((review) => {
        // Status Filter
        if (statusFilter !== "ALL" && review.status !== statusFilter) {
          return false;
        }

        // Rating Filter
        if (ratingFilter !== "ALL" && review.rating !== ratingFilter) {
          return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = normalizeSearchText(searchQuery);
          const matchCustomer = normalizeSearchText(review.customerName).includes(q);
          const matchEmail = review.customerEmail
            ? normalizeSearchText(review.customerEmail).includes(q)
            : false;
          const matchPhone = review.customerPhone
            ? normalizeSearchText(review.customerPhone).includes(q)
            : false;
          const matchProduct = normalizeSearchText(review.productTitle).includes(q);
          const matchProductId = normalizeSearchText(review.productId).includes(q);
          const matchComment = normalizeSearchText(review.comment).includes(q);
          const matchTitle = review.title
            ? normalizeSearchText(review.title).includes(q)
            : false;
          const matchRole = review.customerRole
            ? normalizeSearchText(review.customerRole).includes(q)
            : false;
          const matchReply = review.reply?.comment
            ? normalizeSearchText(review.reply.comment).includes(q)
            : false;

          if (
            !matchCustomer &&
            !matchEmail &&
            !matchPhone &&
            !matchProduct &&
            !matchProductId &&
            !matchComment &&
            !matchTitle &&
            !matchRole &&
            !matchReply
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating_high") return b.rating - a.rating;
        if (sortBy === "rating_low") return a.rating - b.rating;
        if (sortBy === "oldest") {
          return (
            (a.createdAtIso || "").localeCompare(b.createdAtIso || "") ||
            a.id.localeCompare(b.id)
          );
        }
        // Default: newest first by ISO timestamp and ID
        return (
          (b.createdAtIso || "").localeCompare(a.createdAtIso || "") ||
          b.id.localeCompare(a.id)
        );
      });
  }, [scopedReviews, statusFilter, ratingFilter, searchQuery, sortBy]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  // Synchronize store currentPage if filtered totalPages changed
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, setCurrentPage]);

  const paginatedReviews = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReviews, validCurrentPage, itemsPerPage]);

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    ratingFilter !== "ALL" ||
    searchQuery.trim() !== "" ||
    sortBy !== "newest";

  const handleApprove = (id: string, customerName: string) => {
    approveReview(id);
    toast.success(`نظر ${customerName} با موفقیت تایید و منتشر گردید.`);
  };

  const handleResetData = () => {
    resetToMock();
    toast.info("اطلاعات نظرات به حالت نمونه اولیه بازنشانی شد.");
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-amber-950/10 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/25">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              مدیریت نظرات و بازخورد مشتریان
            </h1>
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-[11px] font-bold text-primary"
            >
              {scopedReviews.length.toLocaleString("fa-IR")} نظر ثبت‌شده
            </Badge>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-2xl leading-relaxed">
            بررسی کیفی نظرات معماران و خریداران سنگ، تایید یا رد بازخوردها، پاسخگویی رسمی مدیریت و پایش میزان رضایت از فرآوری سنگ.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetData}
            className="gap-1.5 text-xs shadow-xs"
            title="بازنشانی اطلاعات به نمونه اولیه"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>بازنشانی به دمو</span>
          </Button>
        </div>
      </div>

      {/* 2. Summary Metrics Cards */}
      <ReviewsStatsCards stats={stats} />

      {/* 3. Status Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "ALL", label: "همه نظرات", count: tabCounts.all },
          { id: "PENDING", label: "در انتظار بررسی", count: tabCounts.pending, isWarning: true },
          { id: "APPROVED", label: "تایید و منتشر شده", count: tabCounts.approved },
          { id: "REJECTED", label: "رد شده", count: tabCounts.rejected },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as ReviewFilterStatus)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card border border-border/70 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground font-bold"
                    : tab.isWarning && tab.count > 0
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {tab.count.toLocaleString("fa-IR")}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
        {/* Search Input */}
        <div className="relative w-full md:w-84">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام خریدار، نوع سنگ، متن نظر..."
            className="ps-9 text-xs h-9 bg-secondary/40"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) =>
              setRatingFilter(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
            }
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background"
          >
            <option value="ALL">همه امتیازها</option>
            <option value="5">۵ ستاره (عالی)</option>
            <option value="4">۴ ستاره (خیلی خوب)</option>
            <option value="3">۳ ستاره (متوسط)</option>
            <option value="2">۲ ستاره (ضعیف)</option>
            <option value="1">۱ ستاره (خیلی ضعیف)</option>
          </select>

          {/* Sort Option */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ReviewSortOption)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background"
          >
            <option value="newest">جدیدترین نظرات</option>
            <option value="oldest">قدیمی‌ترین نظرات</option>
            <option value="rating_high">بیشترین امتیاز</option>
            <option value="rating_low">کمترین امتیاز</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-xs text-muted-foreground hover:text-foreground h-8 px-2"
            >
              <RotateCcw className="h-3 w-3" />
              <span>پاکسازی فیلترها</span>
            </Button>
          )}
        </div>
      </div>

      {/* 5. Reviews Table & Mobile Cards Container */}
      <Card className="border border-border/80 bg-card shadow-2xs overflow-hidden">
        {scopedReviews.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground">
                <MessageSquareText className="h-6 w-6" />
              </div>
              <p className="font-bold text-foreground text-sm">
                هیچ بازخوردی برای این واحد صنعتی ثبت نشده است
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                هنوز نظری از سمت مشتریان برای سنگ‌های این کارخانه درج نشده است.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetData}
                className="mt-2 text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>بارگذاری اطلاعات نمونه دمو</span>
              </Button>
            </div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground">
                <MessageSquareText className="h-6 w-6" />
              </div>
              <p className="font-bold text-foreground text-sm">
                هیچ نظری با این فیلترها یافت نشد
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                فیلتر وضعیت، فیلتر ستاره یا عبارت جستجوی خود را تغییر دهید.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-2 text-xs gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>پاکسازی فیلترها</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-border/70 bg-secondary/30 text-muted-foreground">
                    <th className="py-3 pe-4 ps-4 text-start font-medium">مشخصات خریدار</th>
                    <th className="py-3 px-3 text-start font-medium">سنگ خریداری‌شده</th>
                    <th className="py-3 px-3 text-start font-medium">امتیاز و عنوان نظر</th>
                    <th className="py-3 px-3 text-start font-medium">متن نظر و وضعیت پاسخ</th>
                    <th className="py-3 px-3 text-start font-medium">وضعیت انتشار</th>
                    <th className="py-3 px-3 text-start font-medium">تاریخ ثبت</th>
                    <th className="py-3 ps-3 pe-4 text-end font-medium">عملیات نظارت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedReviews.map((review) => (
                    <tr
                      key={review.id}
                      className="transition-colors hover:bg-secondary/40 group"
                    >
                      {/* Customer Info */}
                      <td className="py-3 pe-3 ps-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                            {review.customerName.slice(0, 1)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                className="font-bold text-foreground truncate max-w-40 hover:text-primary transition-colors text-start"
                                onClick={() => openDetailDialog(review)}
                              >
                                {review.customerName}
                              </button>
                              {review.verifiedPurchase && (
                                <span title="خریدار تاییدشده سنگ کارخانه">
                                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
                              {review.customerRole && (
                                <span className="rounded bg-secondary/80 px-1.5 py-0.2">
                                  {review.customerRole}
                                </span>
                              )}
                              {review.customerPhone && (
                                <span className="font-mono" dir="ltr">
                                  {review.customerPhone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stone Product */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {review.productImage && (
                            <div className="relative h-10 w-10 shrink-0 rounded-lg border border-border/70 overflow-hidden bg-secondary">
                              <Image
                                src={review.productImage}
                                alt={review.productTitle}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0 max-w-48">
                            <p className="font-semibold text-foreground truncate text-xs">
                              {review.productTitle}
                            </p>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {review.productId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rating & Subject */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <StarRating rating={review.rating} size="sm" showScore />
                          {review.title ? (
                            <p className="font-medium text-foreground truncate max-w-48 text-[11px]">
                              {review.title}
                            </p>
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">
                              بدون عنوان
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Comment text snippet & Reply status */}
                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-muted-foreground line-clamp-2 leading-relaxed text-[11px]">
                          «{review.comment}»
                        </p>
                        {review.reply && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-primary font-medium">
                            <MessageSquare className="h-3 w-3" />
                            <span>پاسخ داده شده توسط {review.reply.author}</span>
                          </div>
                        )}
                      </td>

                      {/* Moderation Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {review.status === "APPROVED" && (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            <CheckCircle2 className="me-1 h-3 w-3" />
                            منتشر شده
                          </Badge>
                        )}
                        {review.status === "PENDING" && (
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]">
                            <Clock className="me-1 h-3 w-3" />
                            در انتظار تایید
                          </Badge>
                        )}
                        {review.status === "REJECTED" && (
                          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px]">
                            <XCircle className="me-1 h-3 w-3" />
                            رد شده
                          </Badge>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-muted-foreground text-[11px]">
                        {review.createdAt}
                      </td>

                      {/* Moderation Actions */}
                      <td className="py-3 ps-3 pe-4 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Approve button if not approved */}
                          {review.status !== "APPROVED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(review.id, review.customerName)}
                              className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs gap-1"
                              title="تایید و انتشار فوری"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline">تایید</span>
                            </Button>
                          )}

                          {/* Quick Reject button if not rejected */}
                          {review.status !== "REJECTED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRejectDialog(review)}
                              className="h-8 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs gap-1"
                              title="رد انتشار نظر"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline">رد</span>
                            </Button>
                          )}

                          {/* Reply Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReplyDialog(review)}
                            className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10 text-xs gap-1"
                            title="ثبت یا ویرایش پاسخ مدیریت"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span className="hidden lg:inline">پاسخ</span>
                          </Button>

                          {/* Dropdown for more actions */}
                          <DropdownMenu dir="rtl">
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 text-xs">
                              <DropdownMenuItem
                                onClick={() => openDetailDialog(review)}
                                className="gap-2 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5 text-primary" />
                                <span>مشاهده جزئیات کامل</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => openReplyDialog(review)}
                                className="gap-2 cursor-pointer"
                              >
                                <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
                                <span>{review.reply ? "ویرایش پاسخ" : "ثبت پاسخ مدیریت"}</span>
                              </DropdownMenuItem>

                              {review.status !== "APPROVED" && (
                                <DropdownMenuItem
                                  onClick={() => handleApprove(review.id, review.customerName)}
                                  className="gap-2 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>تایید و انتشار نظر</span>
                                </DropdownMenuItem>
                              )}

                              {review.status !== "REJECTED" && (
                                <DropdownMenuItem
                                  onClick={() => openRejectDialog(review)}
                                  className="gap-2 text-rose-600 dark:text-rose-400 cursor-pointer"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  <span>رد انتشار نظر</span>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(review)}
                                className="gap-2 text-destructive cursor-pointer focus:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>حذف نظر</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (Hidden on desktop) */}
            <div className="block md:hidden divide-y divide-border/60">
              {paginatedReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 space-y-3 hover:bg-secondary/30 transition-colors"
                >
                  {/* Top Header: Customer Info & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {review.customerName.slice(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="font-bold text-foreground hover:text-primary transition-colors text-start text-xs"
                            onClick={() => openDetailDialog(review)}
                          >
                            {review.customerName}
                          </button>
                          {review.verifiedPurchase && (
                            <span title="خریدار تاییدشده سنگ کارخانه">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          {review.customerRole && (
                            <span className="rounded bg-secondary px-1.5 py-0.5">
                              {review.customerRole}
                            </span>
                          )}
                          <span>{review.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {review.status === "APPROVED" && (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                          <CheckCircle2 className="me-1 h-3 w-3" />
                          منتشر شده
                        </Badge>
                      )}
                      {review.status === "PENDING" && (
                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]">
                          <Clock className="me-1 h-3 w-3" />
                          در انتظار
                        </Badge>
                      )}
                      {review.status === "REJECTED" && (
                        <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px]">
                          <XCircle className="me-1 h-3 w-3" />
                          رد شده
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Product & Rating Banner */}
                  <div className="rounded-lg bg-secondary/30 p-2.5 flex items-center justify-between gap-3 text-xs border border-border/50">
                    <div className="flex items-center gap-2 min-w-0">
                      {review.productImage && (
                        <div className="relative h-9 w-9 shrink-0 rounded-md border border-border/70 overflow-hidden bg-secondary">
                          <Image
                            src={review.productImage}
                            alt={review.productTitle}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate text-xs">
                          {review.productTitle}
                        </p>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {review.productId}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <StarRating rating={review.rating} size="sm" showScore />
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-1">
                    {review.title && (
                      <p className="text-xs font-bold text-foreground">{review.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      «{review.comment}»
                    </p>
                  </div>

                  {/* Rejection notice if rejected */}
                  {review.rejectionReason && (
                    <div className="rounded-md border border-rose-500/30 bg-rose-500/5 p-2 text-[11px] text-rose-700 dark:text-rose-400">
                      <span className="font-bold">علت رد: </span>
                      <span>{review.rejectionReason}</span>
                    </div>
                  )}

                  {/* Reply Snippet if present */}
                  {review.reply && (
                    <div className="rounded-md border border-primary/25 bg-primary/5 p-2 text-[11px] text-foreground flex items-start gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="font-bold text-primary">{review.reply.author}: </span>
                        <span className="text-muted-foreground line-clamp-2">
                          {review.reply.comment}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Mobile Card Action Bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDetailDialog(review)}
                      className="h-7 px-2 text-xs gap-1 text-primary hover:bg-primary/10"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>جزئیات</span>
                    </Button>

                    <div className="flex items-center gap-1">
                      {review.status !== "APPROVED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(review.id, review.customerName)}
                          className="h-7 px-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>تایید</span>
                        </Button>
                      )}

                      {review.status !== "REJECTED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openRejectDialog(review)}
                          className="h-7 px-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs gap-1"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>رد</span>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openReplyDialog(review)}
                        className="h-7 px-2 text-muted-foreground hover:text-foreground text-xs gap-1"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>پاسخ</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(review)}
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                        title="حذف نظر"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 6. Pagination Footer */}
        {filteredReviews.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/70 px-4 py-3 text-xs text-muted-foreground bg-secondary/15">
            <div className="flex items-center gap-3">
              <span>
                نمایش{" "}
                <strong className="font-mono text-foreground">
                  {((validCurrentPage - 1) * itemsPerPage + 1).toLocaleString("fa-IR")}
                </strong>{" "}
                تا{" "}
                <strong className="font-mono text-foreground">
                  {Math.min(validCurrentPage * itemsPerPage, filteredReviews.length).toLocaleString("fa-IR")}
                </strong>{" "}
                از{" "}
                <strong className="font-mono text-foreground">
                  {filteredReviews.length.toLocaleString("fa-IR")}
                </strong>{" "}
                نظر
              </span>

              {/* Items per page selector */}
              <div className="flex items-center gap-1 ms-2">
                <span>تعداد در صفحه:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="rounded border border-input bg-background px-2 py-0.5 text-xs"
                >
                  <option value={5}>۵</option>
                  <option value={6}>۶</option>
                  <option value={10}>۱۰</option>
                  <option value={20}>۲۰</option>
                </select>
              </div>
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, validCurrentPage - 1))}
                disabled={validCurrentPage <= 1}
                className="h-8 px-2 text-xs gap-1"
              >
                <ChevronRight className="h-4 w-4" />
                <span>قبلی</span>
              </Button>

              <div className="flex items-center gap-1 mx-1">
                {getPaginationRange(validCurrentPage, totalPages).map((item, idx) => {
                  if (typeof item === "string") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-1 text-xs text-muted-foreground select-none"
                      >
                        …
                      </span>
                    );
                  }
                  const isCur = item === validCurrentPage;
                  return (
                    <Button
                      key={item}
                      variant={isCur ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(item)}
                      className="h-8 w-8 p-0 text-xs font-mono"
                    >
                      {item.toLocaleString("fa-IR")}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, validCurrentPage + 1))}
                disabled={validCurrentPage >= totalPages}
                className="h-8 px-2 text-xs gap-1"
              >
                <span>بعدی</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 7. Dialog Modals */}
      <ReviewReplyDialog />
      <ReviewRejectDialog />
      <ReviewDeleteDialog />
      <ReviewDetailDialog />
    </div>
  );
}
