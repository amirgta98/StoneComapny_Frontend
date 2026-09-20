"use client";

import Image from "next/image";
import {
  Eye,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Trash2,
  User,
  Phone,
  ShieldCheck,
  Calendar,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { StarRating } from "./star-rating";
import { useReviewsStore } from "../stores/reviews-store";

export function ReviewDetailDialog() {
  const isDetailOpen = useReviewsStore((s) => s.isDetailOpen);
  const detailReview = useReviewsStore((s) => s.detailReview);
  const closeDetailDialog = useReviewsStore((s) => s.closeDetailDialog);
  const approveReview = useReviewsStore((s) => s.approveReview);
  const openRejectDialog = useReviewsStore((s) => s.openRejectDialog);
  const openReplyDialog = useReviewsStore((s) => s.openReplyDialog);
  const openDeleteDialog = useReviewsStore((s) => s.openDeleteDialog);

  if (!detailReview) return null;

  const handleApprove = () => {
    approveReview(detailReview.id);
    toast.success("نظر مشتری با موفقیت تایید و در سایت منتشر شد.");
  };

  const handleOpenReject = () => {
    closeDetailDialog();
    openRejectDialog(detailReview);
  };

  const handleOpenReply = () => {
    closeDetailDialog();
    openReplyDialog(detailReview);
  };

  const handleOpenDelete = () => {
    closeDetailDialog();
    openDeleteDialog(detailReview);
  };

  return (
    <Dialog open={isDetailOpen} onOpenChange={(open) => !open && closeDetailDialog()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-start">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Eye className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                جزئیات کامل نظر و بازخورد مشتری
              </DialogTitle>
            </div>
            <div>
              {detailReview.status === "APPROVED" && (
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                  <CheckCircle2 className="me-1 h-3 w-3" />
                  منتشر شده
                </Badge>
              )}
              {detailReview.status === "PENDING" && (
                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                  در انتظار تایید
                </Badge>
              )}
              {detailReview.status === "REJECTED" && (
                <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30">
                  <XCircle className="me-1 h-3 w-3" />
                  رد شده
                </Badge>
              )}
            </div>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            شناسه بازخورد: {detailReview.id} · زمان ثبت: {detailReview.createdAt}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Customer & Product Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Customer Box */}
            <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  مشخصات مشتری
                </span>
                {detailReview.verifiedPurchase && (
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    خریدار تاییدشده
                  </Badge>
                )}
              </div>
              <div className="font-bold text-foreground text-sm">
                {detailReview.customerName}
              </div>
              <div className="flex flex-wrap gap-2 text-muted-foreground text-[11px]">
                {detailReview.customerRole && (
                  <span className="rounded bg-secondary px-2 py-0.5 font-medium">
                    نقش: {detailReview.customerRole}
                  </span>
                )}
                {detailReview.customerPhone && (
                  <span className="flex items-center gap-1 font-mono" dir="ltr">
                    <Phone className="h-3 w-3" />
                    {detailReview.customerPhone}
                  </span>
                )}
              </div>
            </div>

            {/* Product Box */}
            <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2 text-xs">
              <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                سنگ خریداری‌شده
              </span>
              <div className="flex items-center gap-3">
                {detailReview.productImage && (
                  <div className="relative h-12 w-12 shrink-0 rounded-lg border border-border/70 overflow-hidden">
                    <Image
                      src={detailReview.productImage}
                      alt={detailReview.productTitle}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-xs leading-snug">
                    {detailReview.productTitle}
                  </p>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    کد: {detailReview.productId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating & Review Content */}
          <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2">
                <StarRating rating={detailReview.rating} size="md" showScore />
                <span className="text-xs text-muted-foreground">
                  ({detailReview.rating.toLocaleString("fa-IR")} ستاره از ۵)
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {detailReview.createdAt}
              </div>
            </div>

            {detailReview.title && (
              <h4 className="font-bold text-foreground text-sm">
                {detailReview.title}
              </h4>
            )}

            <p className="text-xs leading-relaxed text-foreground whitespace-pre-line">
              {detailReview.comment}
            </p>

            {detailReview.rejectionReason && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive space-y-0.5">
                <span className="font-bold">علت رد انتشار:</span>
                <p>{detailReview.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Manager Reply Section */}
          {detailReview.reply ? (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-primary">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>پاسخ رسمی: {detailReview.reply.author}</span>
                  {detailReview.reply.authorRole && (
                    <span className="text-[10px] font-normal text-muted-foreground">
                      ({detailReview.reply.authorRole})
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {detailReview.reply.createdAt}
                </span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                {detailReview.reply.comment}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 p-3 text-center text-xs text-muted-foreground">
              هنوز پاسخی از طرف مدیریت کارخانه برای این نظر ثبت نشده است.
            </div>
          )}
        </div>

        {/* Action Controls */}
        <DialogFooter className="flex-row items-center justify-between gap-2 pt-3 border-t border-border/50 sm:space-x-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleOpenDelete}
            className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>حذف نظر</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenReply}
              className="text-xs gap-1.5"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{detailReview.reply ? "ویرایش پاسخ" : "ثبت پاسخ"}</span>
            </Button>

            {detailReview.status !== "REJECTED" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenReject}
                className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-200 dark:border-rose-900 gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>رد نظر</span>
              </Button>
            )}

            {detailReview.status !== "APPROVED" && (
              <Button
                type="button"
                size="sm"
                onClick={handleApprove}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>تایید و انتشار</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
