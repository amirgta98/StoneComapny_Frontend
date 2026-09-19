"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { CustomerInquiry } from "../../types/inquiry";

interface CancelInquiryModalProps {
  inquiry: CustomerInquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (id: string, reason: string) => void;
}

export function CancelInquiryModal({
  inquiry,
  isOpen,
  onClose,
  onConfirmCancel,
}: CancelInquiryModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!inquiry) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCancel(inquiry.id, reason);
      setIsSubmitting(false);
      setReason("");
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader className="text-start space-y-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            لغو درخواست استعلام سنگ
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            آیا از لغو استعلام{" "}
            <span className="font-semibold text-foreground">
              «{inquiry.requestedStoneName}»
            </span>{" "}
            با شناسه{" "}
            <span className="font-mono text-foreground" dir="ltr">
              {inquiry.inquiryNumber}
            </span>{" "}
            اطمینان دارید؟ این عملیات قابل بازگشت نخواهد بود.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cancel-reason" className="text-xs font-medium">
              دلیل لغو (اختیاری)
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder="مثال: تغییر متراژ پروژه، تأمین از منبع دیگر یا تغییر نوع سنگ..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-20 text-xs rounded-xl resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs rounded-xl"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 text-xs rounded-xl"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              تأیید و لغو استعلام
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
