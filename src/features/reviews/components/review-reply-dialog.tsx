"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { StarRating } from "./star-rating";
import { useReviewsStore } from "../stores/reviews-store";
import { useAuth } from "@/auth";
import type { CustomerReview } from "../types";

interface ReplyFormProps {
  review: CustomerReview;
  onClose: () => void;
}

function ReplyForm({ review, onClose }: ReplyFormProps) {
  const submitReply = useReviewsStore((s) => s.submitReply);
  const { user } = useAuth();

  const [author, setAuthor] = useState(
    review.reply?.author || user?.name || "مدیریت کارخانه سنگ"
  );
  const [authorRole, setAuthorRole] = useState(
    review.reply?.authorRole ||
      (user?.role === "SUPER_ADMIN" ? "مدیر ارشد پلتفرم" : "مدیریت کارخانه سنگ")
  );
  const [comment, setComment] = useState(review.reply?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = comment.trim();
    if (!trimmed) {
      toast.error("لطفاً متن پاسخ را وارد نمایید.");
      return;
    }

    if (trimmed.length < 5) {
      toast.error("متن پاسخ باید حداقل ۵ کاراکتر باشد.");
      return;
    }

    setIsSubmitting(true);
    try {
      submitReply(review.id, trimmed, author, authorRole);
      toast.success(
        review.reply
          ? "پاسخ مدیریت با موفقیت بروزرسانی شد."
          : "پاسخ شما به نظر مشتری با موفقیت ثبت گردید."
      );
      onClose();
    } catch {
      toast.error("خطا در ثبت پاسخ. لطفاً دوباره تلاش نمایید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="author" className="text-xs font-medium">
            نام پاسخ‌دهنده
          </Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="مثلاً: مدیریت کارخانه سنگ"
            className="text-xs h-9"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="authorRole" className="text-xs font-medium">
            عنوان / سمت
          </Label>
          <Input
            id="authorRole"
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
            placeholder="مثلاً: روابط عمومی و پشتیبانی"
            className="text-xs h-9"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="replyText"
          className="text-xs font-medium flex items-center justify-between"
        >
          <span>متن پاسخ رسمی</span>
          <span className="text-[10px] text-muted-foreground">حداقل ۵ کاراکتر</span>
        </Label>
        <Textarea
          id="replyText"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="پاسخ محترمانه و حرفه‌ای خود را به نظر، پرسش یا بازخورد مشتری مرقوم فرمایید..."
          className="text-xs leading-relaxed resize-none"
        />
      </div>

      <DialogFooter className="flex-row items-center justify-end gap-2 pt-2 sm:space-x-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="text-xs"
        >
          انصراف
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="text-xs gap-1.5"
        >
          <Send className="h-3.5 w-3.5" />
          <span>{review.reply ? "بروزرسانی پاسخ" : "ارسال پاسخ رسمی"}</span>
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ReviewReplyDialog() {
  const isReplyOpen = useReviewsStore((s) => s.isReplyOpen);
  const replyReview = useReviewsStore((s) => s.replyReview);
  const closeReplyDialog = useReviewsStore((s) => s.closeReplyDialog);

  if (!replyReview) return null;

  return (
    <Dialog open={isReplyOpen} onOpenChange={(open) => !open && closeReplyDialog()}>
      <DialogContent className="sm:max-w-xl" dir="rtl">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-2 text-primary mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              {replyReview.reply ? "ویرایش پاسخ به نظر مشتری" : "ثبت پاسخ به نظر مشتری"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            پاسخ رسمی مدیریت کارخانه پس از تایید در صفحه محصول ذیل نظر مشتری نمایش داده خواهد شد.
          </DialogDescription>
        </DialogHeader>

        {/* Customer Review Summary Card */}
        <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">{replyReview.customerName}</span>
              {replyReview.customerRole && (
                <span className="text-[10px] rounded bg-secondary px-1.5 py-0.5 text-muted-foreground">
                  {replyReview.customerRole}
                </span>
              )}
            </div>
            <StarRating rating={replyReview.rating} size="sm" showScore />
          </div>

          <div className="text-xs text-primary font-medium">
            محصول: {replyReview.productTitle}
          </div>

          {replyReview.title && (
            <p className="text-xs font-semibold text-foreground">
              {replyReview.title}
            </p>
          )}

          <p className="text-xs text-muted-foreground leading-relaxed">
            «{replyReview.comment}»
          </p>
        </div>

        {/* Form component mounted with key */}
        <ReplyForm
          key={replyReview.id}
          review={replyReview}
          onClose={closeReplyDialog}
        />
      </DialogContent>
    </Dialog>
  );
}
