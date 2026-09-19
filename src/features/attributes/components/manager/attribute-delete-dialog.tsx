"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AttributeDefinition } from "../../types";

interface AttributeDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attribute: AttributeDefinition | null;
  onConfirm: () => void;
}

export function AttributeDeleteDialog({
  open,
  onOpenChange,
  attribute,
  onConfirm,
}: AttributeDeleteDialogProps) {
  if (!attribute) return null;

  const hasProducts = attribute.productCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-2.5 text-destructive">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/15">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold">
              حذف ویژگی «{attribute.name}»
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-2 leading-relaxed">
            آیا از حذف این ویژگی و مشخصه فنی از ساختار کاتالوگ کارخانه مطمئن هستید؟
          </DialogDescription>
        </DialogHeader>

        {hasProducts && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive space-y-1">
            <p className="font-bold">هشدار وابستگی کاتالوگ سنگ:</p>
            <p className="leading-relaxed">
              این ویژگی در حال حاضر به <strong>{attribute.productCount.toLocaleString("fa-IR")} محصول یا اسلب</strong> کارخانه متصل است.
              {attribute.isVariantDriver && " همچنین این مشخصه تنوع‌ساز قیمت و انبار است؛ حذف آن ممکن است مقادیر واریانت‌های تولیدشده را نامعتبر کند."}
            </p>
          </div>
        )}

        <div className="rounded-xl border border-border/70 bg-secondary/30 p-3 text-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>کد سیستمی ویژگی:</span>
            <code className="font-mono text-[11px] text-foreground font-semibold" dir="ltr">
              {attribute.code}
            </code>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>تعداد گزینه‌های ثبت‌شده:</span>
            <span className="font-semibold text-foreground">
              {(attribute.options?.length ?? 0).toLocaleString("fa-IR")} گزینه
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            انصراف
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="gap-1.5 text-xs font-semibold"
          >
            <Trash2 className="h-4 w-4" />
            <span>حذف قطعی ویژگی</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
