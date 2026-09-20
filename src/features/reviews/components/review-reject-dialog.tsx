"use client";

import { useState } from "react";
import { XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useReviewsStore } from "../stores/reviews-store";

const COMMON_REASONS = [
  "تبلیغات غیرمجاز و درج شماره تماس شخصی",
  "مربوط به بخش استعلام قیمت بازرگانی و فاقد ارزیابی کیفی محصول",
  "استفاده از کلمات نامناسب یا نقض قوانین اخلاقی وبگاه",
  "ثبت اطلاعات نامربوط به سنگ و فرآوری کارخانه",
];

interface RejectFormProps {
  review: {
    id: string;
    customerName: string;
    comment: string;
    rejectionReason?: string;
  };
  onClose: () => void;
  onReject: (id: string, reason?: string) => void;
}

function RejectForm({ review, onClose, onReject }: RejectFormProps) {
  const [reason, setReason] = useState(review.rejectionReason || "");

  const handleConfirm = () => {
    onReject(review.id, reason.trim() || undefined);
    toast.warning("نظر مشتری با موفقیت رد شد و از نمایش عمومی خارج گردید.");
    onClose();
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="rounded-lg border border-border/70 bg-secondary/30 p-3 text-xs space-y-1.5">
        <div className="font-bold text-foreground">{review.customerName}</div>
        <div className="text-muted-foreground line-clamp-2">«{review.comment}»</div>
      </div>

      <div className="space-y-3 pt-1">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">علت رد نظر (اختیاری جهت بایگانی مدیریت)</Label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {COMMON_REASONS.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setReason(r)}
                className="rounded-md border border-border/70 bg-secondary/50 px-2 py-1 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-start"
              >
                {r}
              </button>
            ))}
          </div>
          <Textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="دلیل رد نظر را بنویسید یا از دلایل آماده بالا انتخاب کنید..."
            className="text-xs leading-relaxed resize-none"
          />
        </div>
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
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleConfirm}
          className="text-xs gap-1.5"
        >
          <XCircle className="h-3.5 w-3.5" />
          <span>تایید و رد نظر</span>
        </Button>
      </DialogFooter>
    </div>
  );
}

export function ReviewRejectDialog() {
  const isRejectOpen = useReviewsStore((s) => s.isRejectOpen);
  const rejectReviewItem = useReviewsStore((s) => s.rejectReviewItem);
  const closeRejectDialog = useReviewsStore((s) => s.closeRejectDialog);
  const rejectReview = useReviewsStore((s) => s.rejectReview);

  if (!rejectReviewItem) return null;

  return (
    <Dialog open={isRejectOpen} onOpenChange={(open) => !open && closeRejectDialog()}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-2 text-destructive mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
              <XCircle className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              رد انتشار نظر مشتری
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            این نظر برای خریداران دیگر در صفحه محصول نمایش داده نخواهد شد.
          </DialogDescription>
        </DialogHeader>

        <RejectForm
          key={rejectReviewItem.id}
          review={rejectReviewItem}
          onClose={closeRejectDialog}
          onReject={rejectReview}
        />
      </DialogContent>
    </Dialog>
  );
}
