"use client";

import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useReviewsStore } from "../stores/reviews-store";

export function ReviewDeleteDialog() {
  const isDeleteOpen = useReviewsStore((s) => s.isDeleteOpen);
  const deleteReview = useReviewsStore((s) => s.deleteReview);
  const closeDeleteDialog = useReviewsStore((s) => s.closeDeleteDialog);
  const deleteReviewItem = useReviewsStore((s) => s.deleteReviewItem);

  const handleDelete = () => {
    if (!deleteReview) return;

    deleteReviewItem(deleteReview.id);
    toast.success("نظر مشتری با موفقیت از سیستم حذف گردید.");
  };

  if (!deleteReview) return null;

  return (
    <Dialog open={isDeleteOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-2 text-destructive mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              حذف دائمی نظر مشتری
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            آیا از حذف این نظر اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground">{deleteReview.customerName}</span>
            <span className="text-[11px] text-muted-foreground">{deleteReview.createdAt}</span>
          </div>
          <div className="text-muted-foreground line-clamp-2 leading-relaxed">
            «{deleteReview.comment}»
          </div>
          <div className="text-[11px] text-primary font-medium">
            مربوط به: {deleteReview.productTitle}
          </div>
        </div>

        <DialogFooter className="flex-row items-center justify-end gap-2 pt-2 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={closeDeleteDialog}
            className="text-xs"
          >
            انصراف
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="text-xs gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>حذف دائمی</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
