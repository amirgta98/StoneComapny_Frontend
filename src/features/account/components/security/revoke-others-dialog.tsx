"use client";

import { ShieldAlert, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components/ui";

type RevokeOthersDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  otherDevicesCount: number;
};

export function RevokeOthersDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  otherDevicesCount,
}: RevokeOthersDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="max-w-md gap-5">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                خروج از سایر دستگاه‌ها
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                غیرفعال‌سازی تمامی نشست‌های فعال به‌جز دستگاه فعلی
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
          <p>
            با انجام این کار، حساب شما از{" "}
            <span className="font-semibold text-foreground">
              تمام دستگاه‌های دیگر ({otherDevicesCount.toLocaleString("fa-IR")} دستگاه)
            </span>{" "}
            خارج خواهد شد.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary dark:border-primary/30">
            دستگاه فعلی شما خارج نخواهد شد و به فعالیت خود ادامه خواهید داد.
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onClose}
          >
            انصراف
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            onClick={onConfirm}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>در حال خروج...</span>
              </>
            ) : (
              <span>خروج از سایر دستگاه‌ها</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
