"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { useAuth } from "@/auth";
import { deleteUserAccount } from "../../services/security-api";

type DeleteStep = "closed" | "warning" | "confirm-phrase";

const CONFIRMATION_PHRASE = "حذف حساب";

export function DeleteAccountCard({ userId }: { userId: string }) {
  const router = useRouter();
  const { logout } = useAuth();

  const [step, setStep] = useState<DeleteStep>("closed");
  const [phraseInput, setPhraseInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpen = () => {
    setPhraseInput("");
    setStep("warning");
  };

  const handleClose = () => {
    if (isDeleting) return;
    setStep("closed");
    setPhraseInput("");
  };

  const handleAdvanceToConfirm = () => {
    setStep("confirm-phrase");
  };

  const handleFinalDelete = async () => {
    if (phraseInput.trim() !== CONFIRMATION_PHRASE) return;
    setIsDeleting(true);
    try {
      await deleteUserAccount(userId);
      await logout();
      toast.success("حساب کاربری شما با موفقیت حذف شد.");
      setStep("closed");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.message || "حذف حساب با خطا مواجه شد.");
      setIsDeleting(false);
    }
  };

  const isPhraseValid = phraseInput.trim() === CONFIRMATION_PHRASE;

  return (
    <>
      <Card className="overflow-hidden border border-destructive/30 bg-destructive/[0.015] shadow-xs dark:border-destructive/20 dark:bg-destructive/[0.03]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-destructive">
                حذف حساب کاربری
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                عملیات غیرقابل بازگشت و حذف دائمی کلیه داده‌های حساب
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          <div className="flex flex-col gap-4 rounded-xl border border-destructive/20 bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-destructive/20 dark:bg-background/40">
            <div className="space-y-1 text-xs leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">
                حذف حساب یک عملیات دائمی است و ممکن است اطلاعات حساب شما برای همیشه حذف شود.
              </p>
              <p>
                با حذف حساب، دسترسی شما به تمامی سفارش‌ها، پیش‌فاکتورها، آدرس‌ها و لیست علاقه‌مندی‌ها فوراً مسدود خواهد شد.
              </p>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleOpen}
              className="gap-2 self-start sm:self-center shrink-0"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span>حذف حساب کاربری</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Warning Dialog */}
      <Dialog open={step === "warning"} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-md gap-5">
          <DialogHeader className="text-start">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-destructive">
                  حذف حساب کاربری
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  مرحله ۱ از ۲: تأیید اولیه
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
            <p className="font-semibold text-foreground">
              آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟
            </p>
            <p className="text-xs text-muted-foreground">
              این عملیات ممکن است قابل بازگشت نباشد. سوابق خرید، استعلام‌ها و امتیازات شما به صورت غیرقابل بازیابی پاک خواهند شد.
            </p>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              انصراف
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleAdvanceToConfirm}
            >
              ادامه و تأیید نهایی
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step 2: Final Typed Confirmation Dialog */}
      <Dialog
        open={step === "confirm-phrase"}
        onOpenChange={(open) => !open && !isDeleting && handleClose()}
      >
        <DialogContent className="max-w-md gap-5">
          <DialogHeader className="text-start">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-destructive">
                  تأیید نهایی حذف حساب
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  مرحله ۲ از ۲: احراز قصد حذف
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 text-sm leading-relaxed">
            <p className="text-xs text-muted-foreground">
              برای حذف دائمی حساب، عبارت زیر را دقیقاً در کادر زیر تایپ کنید:
            </p>

            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2.5 text-center font-bold text-destructive select-all">
              {CONFIRMATION_PHRASE}
            </div>

            <div className="space-y-1.5 pt-1">
              <Label htmlFor="delete-confirm-input" className="text-xs">
                تکرار عبارت تأیید
              </Label>
              <Input
                id="delete-confirm-input"
                value={phraseInput}
                disabled={isDeleting}
                onChange={(e) => setPhraseInput(e.target.value)}
                placeholder="حذف حساب"
                className="text-center font-medium"
                autoComplete="off"
              />
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={handleClose}
            >
              انصراف
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!isPhraseValid || isDeleting}
              onClick={handleFinalDelete}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>در حال حذف حساب...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span>حذف دائمی حساب</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
