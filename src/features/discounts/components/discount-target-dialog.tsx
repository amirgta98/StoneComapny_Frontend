"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useDiscountsStore } from "../stores/discounts-store";
import type { DiscountScope } from "../types";

const STONE_CATEGORIES = [
  { id: "cat-1", name: "سنگ مرمریت (دهبید، کاشمر، هرسین)" },
  { id: "cat-2", name: "سنگ تراورتن (عباس‌آباد، آتشکوه، حاجی‌آباد)" },
  { id: "cat-3", name: "سنگ گرانیت (مشکی نطنز، مروارید، نهبندان)" },
  { id: "cat-4", name: "سنگ مرمر و آنیکس (قروه، کاشان، کرمان)" },
  { id: "cat-5", name: "سنگ چینی و کریستال (ازنا، الیگودرز، نیریز)" },
];

export function DiscountTargetDialog() {
  const { isTargetDialogOpen, closeTargetDialog, targetingDiscount, assignTargets } =
    useDiscountsStore();

  const [scope, setScope] = useState<DiscountScope>("ALL");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (targetingDiscount) {
      setScope(targetingDiscount.scope || "ALL");
      setSelectedCategories(targetingDiscount.categoryIds || []);
    }
  }, [targetingDiscount, isTargetDialogOpen]);

  if (!targetingDiscount) return null;

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSave = () => {
    const result = assignTargets(targetingDiscount.id, {
      scope,
      categoryIds: scope === "CATEGORIES" ? selectedCategories : [],
    });

    if (result.success) {
      toast.success("دامنه و محصولات هدف تخفیف با موفقیت به‌روزرسانی شد");
    } else {
      toast.error(result.error || "خطا در تنظیم دامنه تخفیف");
    }
  };

  return (
    <Dialog open={isTargetDialogOpen} onOpenChange={(open) => !open && closeTargetDialog()}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle>تخصیص دامنه و دسته‌بندی‌های هدف</DialogTitle>
          <DialogDescription>
            مشخص کنید تخفیف <strong>«{targetingDiscount.name}»</strong> به کدام دسته از محصولات سنگ اعمال شود.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">دامنه شمول تخفیف</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={scope === "ALL" ? "default" : "outline"}
                className="justify-start text-xs h-9"
                onClick={() => setScope("ALL")}
              >
                تمامی محصولات کارخانه
              </Button>
              <Button
                type="button"
                variant={scope === "CATEGORIES" ? "default" : "outline"}
                className="justify-start text-xs h-9"
                onClick={() => setScope("CATEGORIES")}
              >
                دسته‌بندی‌های خاص
              </Button>
            </div>
          </div>

          {scope === "CATEGORIES" && (
            <div className="space-y-2 pt-2 border-t">
              <Label className="text-xs font-medium">دسته‌بندی‌های سنگ مجاز برای این تخفیف:</Label>
              <div className="space-y-2">
                {STONE_CATEGORIES.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-primary/5 border-primary text-primary font-medium"
                          : "hover:bg-accent border-muted"
                      }`}
                    >
                      <span>{cat.name}</span>
                      {isChecked ? (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">
                          انتخاب شده
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
                          غیرفعال
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {scope === "ALL" && (
            <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              این کوپن تخفیف روی تمامی سفارش‌ها و محصولات سبد خرید مشتری که شرایط حداقل مبلغ را برآورده کنند، اعمال خواهد شد.
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button type="button" variant="outline" onClick={closeTargetDialog}>
            انصراف
          </Button>
          <Button type="button" onClick={handleSave}>
            ذخیره تنظیمات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
