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
import { AlertCircle, Loader2 } from "lucide-react";
import type { Session } from "../../types/security";

interface LogoutSessionDialogProps {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (session: Session) => Promise<void> | void;
}

export function LogoutSessionDialog({
  session,
  open,
  onOpenChange,
  onConfirm,
}: LogoutSessionDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(session);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-2 sm:text-start">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive mb-1">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <DialogTitle className="text-lg font-bold">خروج از دستگاه</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            آیا می‌خواهید دسترسی حساب شما از دستگاه{" "}
            <span className="font-semibold text-foreground">{session.deviceTitle}</span>{" "}
            ({session.location}) قطع شود؟ برای استفاده مجدد در آن دستگاه باید مجدداً وارد شوید.
          </DialogDescription>
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
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>در حال خروج...</span>
              </>
            ) : (
              <span>خروج از دستگاه</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
