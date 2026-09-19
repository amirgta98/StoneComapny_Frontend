"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDiscountsStore } from "../stores/discounts-store";

export function DiscountDeleteDialog() {
  const { isDeleteDialogOpen, closeDeleteDialog, deletingDiscount, deleteDiscount } =
    useDiscountsStore();

  if (!deletingDiscount) return null;

  const handleDelete = () => {
    const result = deleteDiscount(deletingDiscount.id);
    if (result.success) {
      toast.success(`تخفیف «${deletingDiscount.name}» با موفقیت حذف شد`);
    } else {
      toast.error(result.error || "خطا در حذف تخفیف");
    }
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle>حذف تخفیف</DialogTitle>
          <DialogDescription className="space-y-2 pt-2">
            <span>
              آیا از حذف تخفیف <strong>«{deletingDiscount.name}»</strong> با کد کوپن{" "}
              <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-xs" dir="ltr">
                {deletingDiscount.code}
              </code>{" "}
              اطمینان دارید؟
            </span>
            <span className="block text-xs text-destructive">
              این عملیات قابل بازگشت نیست و مشتریان دیگر قادر به اعمال این کد نخواهند بود.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button type="button" variant="outline" onClick={closeDeleteDialog}>
            انصراف
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            تأیید و حذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
