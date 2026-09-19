"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Button } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Label } from "@/components/ui";
import { AlertCircle, Loader2 } from "lucide-react";

interface CloseConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void>;
  conversationNumber: string;
}

export function CloseConversationModal({
  isOpen,
  onClose,
  onConfirm,
  conversationNumber,
}: CloseConversationModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(reason.trim() || undefined);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="space-y-2 text-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-1">
            <AlertCircle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-bold">
            بستن گفتگوی پشتیبانی {conversationNumber}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            آیا از بستن این گفتگو اطمینان دارید؟ با بستن گفتگو، امکان ارسال پیام جدید
            در این موضوع وجود نخواهد داشت و وضعیت آن به حالت «بسته شده» تغییر خواهد کرد.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="close-reason" className="text-xs font-medium">
            توضیحات یا دلیل بستن گفتگو (اختیاری)
          </Label>
          <Textarea
            id="close-reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="مثال: مشکلم با راهنمایی کارشناس حل شد، با تشکر..."
            className="text-xs rounded-xl resize-none"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl text-xs"
          >
            انصراف
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="rounded-xl text-xs gap-1.5"
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            تأیید و بستن گفتگو
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
