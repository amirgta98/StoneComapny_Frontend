"use client";

import { LogOut, AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components/ui";
import type { UserSession } from "../../types/security";

type RevokeSessionDialogProps = {
  session: UserSession | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
};

export function RevokeSessionDialog({
  session,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: RevokeSessionDialogProps) {
  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="max-w-md gap-5">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                خروج از دستگاه
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                قطع دسترسی حساب در دستگاه انتخاب‌شده
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-lg border border-stone-200/80 bg-stone-50/50 p-3.5 text-xs text-muted-foreground dark:border-stone-800/80 dark:bg-stone-900/40">
          <p className="font-medium text-foreground">{session.browser}</p>
          <p className="mt-1">
            مکان تقریبی: {session.location} • آخرین فعالیت: {session.lastActiveAt}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-foreground/90">
          آیا می‌خواهید این دستگاه از حساب شما خارج شود؟ در این صورت، برای استفاده مجدد باید دوباره وارد حساب شوید.
        </p>

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
              <>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>خروج از دستگاه</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
