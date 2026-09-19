"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
} from "@/components/ui";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth";
import { useSecurityStore } from "../../stores/security-store";

const CONFIRMATION_PHRASE = "حذف حساب";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  userId,
}: DeleteAccountDialogProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const { resetAll } = useSecurityStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isConfirmed = confirmationInput.trim() === CONFIRMATION_PHRASE;

  const handleClose = () => {
    if (loading) return;
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setStep(1);
      setConfirmationInput("");
    }, 200);
  };

  const handleDelete = async () => {
    if (!isConfirmed || loading) return;
    setLoading(true);

    try {
      // Simulate API call for deleting user account
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Invalidate store and log out
      resetAll();
      await logout();

      toast.success("حساب کاربری شما با موفقیت حذف شد.");
      handleClose();
      router.push("/");
    } catch {
      toast.error("انجام عملیات با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-destructive/30">
        <DialogHeader className="gap-2 sm:text-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/15 text-destructive mb-1">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>

          <DialogTitle className="text-lg font-bold text-destructive">
            {step === 1 ? "حذف حساب کاربری" : "تأیید نهایی حذف حساب"}
          </DialogTitle>

          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {step === 1 ? (
              <>
                آیا مطمئن هستید که می‌خواهید حساب کاربری خود را حذف کنید؟ این عملیات
                کاملاً <strong className="text-destructive">غیرقابل بازگشت</strong> است و کلیه
                سفارش‌ها، آدرس‌ها، اسناد و سوابق شما برای همیشه حذف خواهند شد.
              </>
            ) : (
              <>
                برای تأیید حذف دائمی، لطفاً عبارت{" "}
                <span className="font-bold text-destructive font-mono px-1.5 py-0.5 bg-destructive/10 rounded">
                  {CONFIRMATION_PHRASE}
                </span>{" "}
                را در کادر زیر تایپ کنید:
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {step === 2 && (
          <div className="space-y-2 py-2">
            <Label htmlFor="delete-confirm-phrase" className="text-xs font-medium">
              تایپ عبارت تأیید:
            </Label>
            <Input
              id="delete-confirm-phrase"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder={CONFIRMATION_PHRASE}
              disabled={loading}
              className="text-center font-bold tracking-wide"
              autoFocus
            />
          </div>
        )}

        <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            انصراف
          </Button>

          {step === 1 ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setStep(2)}
              className="w-full sm:w-auto"
            >
              ادامه به مرحله بعد
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={!isConfirmed || loading}
              className="w-full sm:w-auto gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال پردازش...</span>
                </>
              ) : (
                <span>حذف دائمی حساب</span>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
