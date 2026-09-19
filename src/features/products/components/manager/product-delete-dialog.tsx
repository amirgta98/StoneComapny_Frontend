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
import type { Product } from "@/types";

interface ProductDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onConfirm: () => void;
}

export function ProductDeleteDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
}: ProductDeleteDialogProps) {
  if (!product) return null;

  const totalInventory = product.variants.reduce((acc, v) => acc + (v.inventory || 0), 0);
  const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-2.5 text-destructive">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/15">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold">
              حذف سنگ «{product.name}»
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-2 leading-relaxed">
            آیا از حذف این سنگ از کاتالوگ کارخانه اطمینان دارید؟ با حذف محصول، این کالا از شوروم آنلاین نیز برداشته خواهد شد.
          </DialogDescription>
        </DialogHeader>

        {/* Product Preview Card */}
        <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-secondary/30 p-3">
          {primaryImage && (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-12 w-12 shrink-0 rounded-lg border border-border/70 object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs text-foreground truncate">
              {product.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
              <span>قیمت: {product.price?.toLocaleString("fa-IR")} تومان</span>
              <span>·</span>
              <span>موجودی: {totalInventory.toLocaleString("fa-IR")} {product.inventoryUnit ?? "م²"}</span>
            </div>
          </div>
        </div>

        {totalInventory > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">
            <p className="font-semibold">هشدار موجودی فیزیکی:</p>
            <p className="mt-1 leading-relaxed">
              این محصول دارای <strong>{totalInventory.toLocaleString("fa-IR")} واحد موجودی دپو</strong> در انبار است. در صورت تمایل می‌توانید به جای حذف، وضعیت آن را به «بایگانی» تغییر دهید.
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
            تأیید و حذف محصول
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
