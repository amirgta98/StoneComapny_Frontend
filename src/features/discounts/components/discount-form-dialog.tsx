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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDiscountsStore } from "../stores/discounts-store";
import type { DiscountFormData } from "../types";

export function DiscountFormDialog() {
  const { isFormOpen, closeFormDialog, editingDiscount, addDiscount, updateDiscount } =
    useDiscountsStore();

  const isEditing = !!editingDiscount;

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState<string>("");
  const [usageLimit, setUsageLimit] = useState<string>("");
  const [priority, setPriority] = useState<string>("5");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingDiscount) {
      setName(editingDiscount.name);
      setCode(editingDiscount.code);
      setType(editingDiscount.type);
      setValue(editingDiscount.value ? String(editingDiscount.value) : "");
      setStatus(editingDiscount.status === "ACTIVE" ? "ACTIVE" : "INACTIVE");
      setStartDate(editingDiscount.startAt ? editingDiscount.startAt.slice(0, 10) : "");
      setEndDate(editingDiscount.endAt ? editingDiscount.endAt.slice(0, 10) : "");
      setMinPurchaseAmount(
        editingDiscount.minPurchaseAmount ? String(editingDiscount.minPurchaseAmount) : ""
      );
      setUsageLimit(editingDiscount.usageLimit ? String(editingDiscount.usageLimit) : "");
      setPriority(editingDiscount.priority ? String(editingDiscount.priority) : "5");
      setDescription(editingDiscount.description || "");
    } else {
      setName("");
      setCode("");
      setType("PERCENTAGE");
      setValue("");
      setStatus("ACTIVE");
      const today = new Date().toISOString().slice(0, 10);
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      setStartDate(today);
      setEndDate(nextMonth);
      setMinPurchaseAmount("");
      setUsageLimit("");
      setPriority("5");
      setDescription("");
    }
    setErrors({});
  }, [editingDiscount, isFormOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "عنوان تخفیف الزامی است";
    if (!code.trim()) newErrors.code = "کد تخفیف الزامی است";
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      newErrors.value = "مقدار تخفیف باید یک عدد معتبر و بزرگتر از صفر باشد";
    }
    if (type === "PERCENTAGE" && Number(value) > 100) {
      newErrors.value = "درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد";
    }
    if (!startDate) newErrors.startDate = "تاریخ شروع الزامی است";
    if (!endDate) newErrors.endDate = "تاریخ پایان الزامی است";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "تاریخ پایان باید پس از تاریخ شروع باشد";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const startAt = new Date(`${startDate}T00:00:00.000Z`).toISOString();
    const endAt = new Date(`${endDate}T23:59:59.000Z`).toISOString();

    const formData: DiscountFormData = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      status,
      startAt,
      endAt,
      minPurchaseAmount: minPurchaseAmount ? Number(minPurchaseAmount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      priority: priority ? Number(priority) : 5,
      description: description.trim() || undefined,
      scope: editingDiscount?.scope || "ALL",
      productIds: editingDiscount?.productIds || [],
      categoryIds: editingDiscount?.categoryIds || [],
    };

    if (isEditing) {
      const result = updateDiscount(editingDiscount.id, formData);
      if (result.success) {
        toast.success("تخفیف با موفقیت به‌روزرسانی شد");
      } else {
        toast.error(result.error || "خطا در ویرایش تخفیف");
      }
    } else {
      const result = addDiscount(formData);
      if (result.success) {
        toast.success("تخفیف جدید با موفقیت ایجاد شد");
      } else {
        toast.error(result.error || "خطا در ایجاد تخفیف");
      }
    }
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeFormDialog()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle>{isEditing ? "ویرایش تخفیف" : "ایجاد تخفیف جدید"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "اطلاعات، درصد یا مبلغ و شرایط تخفیف را ویرایش کنید."
              : "مشخصات کمپین تخفیف، درصد یا مبلغ و محدودیت‌های خرید را مشخص کنید."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Title */}
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="discount-name">
                عنوان تخفیف <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discount-name"
                placeholder="مثال: جشنواره پاییزه سنگ تراورتن عباس‌آباد"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Discount Code */}
            <div className="space-y-1.5">
              <Label htmlFor="discount-code">
                کد کوپن (انگلیسی) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discount-code"
                placeholder="مثال: FALL-TRAVERTINE"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                dir="ltr"
                className={`font-mono text-left ${errors.code ? "border-destructive" : ""}`}
              />
              {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="discount-status">وضعیت اولیه</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "ACTIVE" | "INACTIVE")}>
                <SelectTrigger id="discount-status">
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="ACTIVE">فعال</SelectItem>
                  <SelectItem value="INACTIVE">غیرفعال (پیش‌نویس)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <Label htmlFor="discount-type">نوع تخفیف</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as "PERCENTAGE" | "FIXED")}
              >
                <SelectTrigger id="discount-type">
                  <SelectValue placeholder="نوع تخفیف" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="PERCENTAGE">درصدی (٪)</SelectItem>
                  <SelectItem value="FIXED">مبلغ ثابت (تومان)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Value */}
            <div className="space-y-1.5">
              <Label htmlFor="discount-value">
                {type === "PERCENTAGE" ? "درصد تخفیف (۱ تا ۱۰۰)" : "مبلغ تخفیف (تومان)"}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discount-value"
                type="number"
                placeholder={type === "PERCENTAGE" ? "مثال: ۱۵" : "مثال: ۵۰۰۰۰۰۰"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                dir="ltr"
                className={errors.value ? "border-destructive" : ""}
              />
              {errors.value && <p className="text-xs text-destructive">{errors.value}</p>}
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <Label htmlFor="start-date">
                تاریخ شروع <span className="text-destructive">*</span>
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                dir="ltr"
                className={errors.startDate ? "border-destructive" : ""}
              />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <Label htmlFor="end-date">
                تاریخ پایان <span className="text-destructive">*</span>
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                dir="ltr"
                className={errors.endDate ? "border-destructive" : ""}
              />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
            </div>

            {/* Min Purchase Amount */}
            <div className="space-y-1.5">
              <Label htmlFor="min-purchase">حداقل مبلغ سفارش (تومان)</Label>
              <Input
                id="min-purchase"
                type="number"
                placeholder="مثال: ۴۰۰۰۰۰۰۰ (اختیاری)"
                value={minPurchaseAmount}
                onChange={(e) => setMinPurchaseAmount(e.target.value)}
                dir="ltr"
              />
            </div>

            {/* Usage Limit */}
            <div className="space-y-1.5">
              <Label htmlFor="usage-limit">حداکثر سقف استفاده (تعداد)</Label>
              <Input
                id="usage-limit"
                type="number"
                placeholder="مثال: ۵۰ (نامحدود اگر خالی باشد)"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                dir="ltr"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="discount-description">توضیحات و شرایط استفاده</Label>
              <Textarea
                id="discount-description"
                placeholder="شرایط اعمال تخفیف، نوع سنگ‌ها یا مشتریان هدف..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={closeFormDialog}>
              انصراف
            </Button>
            <Button type="submit">
              {isEditing ? "ذخیره تغییرات" : "ایجاد تخفیف"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
