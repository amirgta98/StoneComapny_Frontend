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
import { AlertTriangle } from "lucide-react";
import type { CustomerAddress } from "../../types/address";

interface DeleteAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: CustomerAddress | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteAddressDialog({
  open,
  onOpenChange,
  address,
  onConfirm,
  isDeleting = false,
}: DeleteAddressDialogProps) {
  if (!address) return null;

  const isDefault = address.isDefaultShipping || address.isDefaultBilling;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card p-6">
        <DialogHeader className="space-y-3 text-start">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5 stroke-[2]" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            حذف آدرس
          </DialogTitle>
          <DialogDescription className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              آیا از حذف آدرس <strong className="text-foreground">«{address.title}»</strong> اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
            </p>
            {isDefault && (
              <p className="rounded-lg border border-border bg-secondary/60 p-2.5 text-xs text-secondary-foreground leading-normal">
                این آدرس در حال حاضر به عنوان آدرس پیش‌فرض ثبت شده است. در صورت تأیید، یکی از سایر آدرس‌های شما به عنوان پیش‌فرض جایگزین خواهد شد.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="border-border"
          >
            انصراف
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "در حال حذف..." : "حذف آدرس"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
