"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components/ui";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutOtherDevicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
}

export function LogoutOtherDevicesDialog({
  open,
  onOpenChange,
  onConfirm,
}: LogoutOtherDevicesDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-2 sm:text-start">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-1">
            <LogOut className="h-6 w-6 rtl:rotate-180" aria-hidden="true" />
          </div>
          <DialogTitle className="text-lg font-bold">خروج از سایر دستگاه‌ها</DialogTitle>
          <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              با انجام این کار، حساب شما از تمام دستگاه‌ها و مرورگرهای دیگر خارج خواهد شد.
            </p>
            <p className="text-foreground font-medium bg-muted/50 p-2.5 rounded-lg border border-border/40">
              ✓ نشست دستگاه فعلی شما فعال باقی خواهد ماند و خارج نخواهد شد.
            </p>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            انصراف
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto gap-2 bg-amber-600 hover:bg-amber-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
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
