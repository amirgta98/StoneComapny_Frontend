"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddressErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function AddressErrorState({
  title = "خطا در دریافت اطلاعات آدرس‌ها",
  message = "مشکلی در بارگذاری لیست آدرس‌ها پیش آمده است. لطفاً مجدداً تلاش فرمایید.",
  onRetry,
}: AddressErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertCircle className="h-6 w-6 stroke-[2]" />
      </div>
      <h3 className="mt-4 text-base font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-5 gap-1.5 border-border"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>تلاش مجدد</span>
        </Button>
      )}
    </div>
  );
}
