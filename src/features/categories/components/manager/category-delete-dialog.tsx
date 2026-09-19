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
import type { CategoryNode } from "../../types";
import { getDescendantIds } from "../../data/mock-hierarchical-categories";

interface CategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryNode | null;
  allCategories: CategoryNode[];
  onConfirm: () => void;
}

export function CategoryDeleteDialog({
  open,
  onOpenChange,
  category,
  allCategories,
  onConfirm,
}: CategoryDeleteDialogProps) {
  if (!category) return null;

  const descendantIds = getDescendantIds(category.id, allCategories);
  const descendantCount = descendantIds.size;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-2.5 text-destructive">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/15">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold">
              حذف دسته‌بندی «{category.name}»
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-2 leading-relaxed">
            آیا از حذف این دسته‌بندی اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
          </DialogDescription>
        </DialogHeader>

        {descendantCount > 0 && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <p className="font-semibold">توجه مهم:</p>
            <p className="mt-1 leading-relaxed">
              این دسته‌بندی دارای <strong>{descendantCount.toLocaleString("fa-IR")} زیرمجموعه</strong> در لایه‌های پایین‌تر است. با حذف این دسته، تمامی زیرشاخه‌های آن نیز حذف خواهند شد.
            </p>
          </div>
        )}

        {category.productCount > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">
            <p className="font-semibold">تعداد سنگ‌های متصل:</p>
            <p className="mt-1 leading-relaxed">
              تعداد <strong>{category.productCount.toLocaleString("fa-IR")} سنگ و اسلب</strong> در کاتالوگ به این دسته متصل هستند.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-start pt-2">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Trash2 className="h-4 w-4" />
            تأیید و حذف دسته
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
