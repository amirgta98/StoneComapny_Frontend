"use client";

import { useState, useId } from "react";
import { PlusCircle, Building2, User, Phone, MapPin, Tag, Layers, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import type { CustomerRole, StoneCategory, StoneForm, InquiryUrgency } from "../types";
import { useFactoryInquiriesStore } from "../stores/factory-inquiries-store";

interface NewInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
}

export function NewInquiryDialog({
  open,
  onOpenChange,
  tenantId,
}: NewInquiryDialogProps) {
  const addInquiry = useFactoryInquiriesStore((s) => s.addInquiry);

  const [customerName, setCustomerName] = useState("");
  const [customerRole, setCustomerRole] = useState<CustomerRole>("معمار");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectCity, setProjectCity] = useState("تهران");
  const [projectStage, setProjectStage] = useState("نازک‌کاری و نما");
  const [stoneTitle, setStoneTitle] = useState("");
  const [stoneType, setStoneType] = useState<StoneCategory>("مرمریت");
  const [form, setForm] = useState<StoneForm>("اسلب");
  const [volumeNumber, setVolumeNumber] = useState<number>(250);
  const [volumeUnit, setVolumeUnit] = useState<"مترمربع" | "متر طول" | "تن" | "کوپ">("مترمربع");
  const [finish, setFinish] = useState("ساب صیقلی براق");
  const [thickness, setThickness] = useState("۲ سانتی‌متر");
  const [dimensions, setDimensions] = useState("اسلب ابعاد بزرگ");
  const [urgency, setUrgency] = useState<InquiryUrgency>("normal");
  const [notes, setNotes] = useState("");

  const customerNameId = useId();
  const customerPhoneId = useId();
  const customerCompanyId = useId();
  const projectNameId = useId();
  const projectCityId = useId();
  const projectStageId = useId();
  const stoneTitleId = useId();
  const volumeNumberId = useId();
  const finishId = useId();
  const thicknessId = useId();
  const dimensionsId = useId();
  const notesId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !stoneTitle.trim() || !projectName.trim()) {
      toast.error("لطفاً فیلدهای الزامی (نام، تلفن، نام پروژه و نوع سنگ) را تکمیل نمایید.");
      return;
    }

    const now = new Date();
    const dateStr = new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(now);

    addInquiry({
      tenantId,
      customerName,
      customerRole,
      customerPhone,
      customerCompany: customerCompany.trim() || undefined,
      projectName,
      projectCity,
      projectStage,
      stoneTitle,
      stoneType,
      form,
      volume: `${volumeNumber.toLocaleString("fa-IR")} ${volumeUnit}`,
      volumeNumber,
      volumeUnit,
      finish,
      thickness,
      dimensions: dimensions.trim() || undefined,
      status: "pending",
      urgency,
      createdAt: `امروز، ${dateStr}`,
      notes: notes.trim() || undefined,
    });

    toast.success("استعلام جدید با موفقیت در سیستم ثبت گردید.");
    onOpenChange(false);

    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setCustomerCompany("");
    setProjectName("");
    setStoneTitle("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-border/80 bg-card text-card-foreground shadow-2xl"
        dir="rtl"
      >
        <div className="border-b border-border/70 bg-gradient-to-r from-secondary/50 via-card to-amber-950/10 p-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/25">
              <PlusCircle className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                ثبت استعلام جدید (حضوری / تلفنی)
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                ورود اطلاعات پروژه یا استعلام قیمت جهت ارجاع به خط برش و صدور پیش‌فاکتور
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <User className="h-4 w-4 text-primary" />
              مشخصات متقاضی و خریدار
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor={customerNameId} className="text-xs">نام متقاضی *</Label>
                <Input
                  id={customerNameId}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثلاً مهندس رحیمی"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">جایگاه / نقش</Label>
                <Select value={customerRole} onValueChange={(v) => setCustomerRole(v as CustomerRole)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="معمار">معمار</SelectItem>
                    <SelectItem value="طراح داخلی">طراح داخلی</SelectItem>
                    <SelectItem value="پیمانکار">پیمانکار</SelectItem>
                    <SelectItem value="انبوه‌ساز">انبوه‌ساز</SelectItem>
                    <SelectItem value="صادرکننده">صادرکننده</SelectItem>
                    <SelectItem value="خریدار شخصی">خریدار شخصی</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor={customerPhoneId} className="text-xs">شماره تماس *</Label>
                <Input
                  id={customerPhoneId}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="۰۹۱۲xxxxxxx"
                  className="text-xs font-mono"
                  dir="ltr"
                  required
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <Label htmlFor={customerCompanyId} className="text-xs">نام شرکت یا دفتر معماری (اختیاری)</Label>
                <Input
                  id={customerCompanyId}
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  placeholder="مثلاً مهندسین مشاور سازه پایدار"
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* Project info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-primary" />
              مشخصات پروژه و محل تحویل
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor={projectNameId} className="text-xs">عنوان پروژه ساختمانی *</Label>
                <Input
                  id={projectNameId}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="مثلاً پروژه مسکونی سروستان زعفرانیه"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor={projectCityId} className="text-xs">شهر مقصد *</Label>
                <Input
                  id={projectCityId}
                  value={projectCity}
                  onChange={(e) => setProjectCity(e.target.value)}
                  placeholder="تهران"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor={projectStageId} className="text-xs">مرحله پروژه</Label>
                <Input
                  id={projectStageId}
                  value={projectStage}
                  onChange={(e) => setProjectStage(e.target.value)}
                  placeholder="مثلاً کف‌سازی لابی و سالن اصلی"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">اولویت استعلام</Label>
                <Select value={urgency} onValueChange={(v) => setUrgency(v as InquiryUrgency)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="normal">عادی</SelectItem>
                    <SelectItem value="high">فوری و ویژه</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stone specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-primary" />
              مشخصات سنگ مورد استعلام
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor={stoneTitleId} className="text-xs">نام و توصیف سنگ *</Label>
                <Input
                  id={stoneTitleId}
                  value={stoneTitle}
                  onChange={(e) => setStoneTitle(e.target.value)}
                  placeholder="مثلاً اسلب مرمریت دهبید یا تراورتن دره بخاری"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">خانواده سنگ</Label>
                <Select value={stoneType} onValueChange={(v) => setStoneType(v as StoneCategory)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="مرمریت">مرمریت</SelectItem>
                    <SelectItem value="تراورتن">تراورتن</SelectItem>
                    <SelectItem value="گرانیت">گرانیت</SelectItem>
                    <SelectItem value="آنیکس">آنیکس (مرمر)</SelectItem>
                    <SelectItem value="چینی و کریستال">چینی و کریستال</SelectItem>
                    <SelectItem value="لایم‌استون">لایم‌استون</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">قواره و فرمت</Label>
                <Select value={form} onValueChange={(v) => setForm(v as StoneForm)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="اسلب">اسلب</SelectItem>
                    <SelectItem value="تایل">تایل</SelectItem>
                    <SelectItem value="۴۰ طولی">۴۰ طولی</SelectItem>
                    <SelectItem value="کوپ خام">کوپ خام</SelectItem>
                    <SelectItem value="پله و زیرپله">پله و زیرپله</SelectItem>
                    <SelectItem value="حجمی و ابزار">حجمی و ابزار</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor={volumeNumberId} className="text-xs">مقدار عددی متراژ / حجم</Label>
                <Input
                  id={volumeNumberId}
                  type="number"
                  min="1"
                  value={volumeNumber}
                  onChange={(e) => setVolumeNumber(Number(e.target.value))}
                  className="text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">واحد سنجش</Label>
                <Select
                  value={volumeUnit}
                  onValueChange={(v) => setVolumeUnit(v as "مترمربع" | "متر طول" | "تن" | "کوپ")}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="مترمربع">مترمربع</SelectItem>
                    <SelectItem value="متر طول">متر طول</SelectItem>
                    <SelectItem value="تن">تن</SelectItem>
                    <SelectItem value="کوپ">کوپ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor={finishId} className="text-xs">فینیش سطح</Label>
                <Input
                  id={finishId}
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  placeholder="ساب صیقلی، بوش‌همر، چرمی..."
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor={thicknessId} className="text-xs">ضخامت برش</Label>
                <Input
                  id={thicknessId}
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  placeholder="۲ سانت، ۳ سانت..."
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor={dimensionsId} className="text-xs">ابعاد یا سایز برش</Label>
                <Input
                  id={dimensionsId}
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="مثلاً ۲۸۰ × ۱۶۰ یا ۸۰ × ۸۰"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <Label htmlFor={notesId} className="text-xs">توضیحات و الزامات خاص</Label>
                <Textarea
                  id={notesId}
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="نیازمندی به نمونه سنگ، توری اپوکسی پشت، سورت رنگی خاص..."
                  className="text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-border/70 pt-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onOpenChange(false)}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-1.5 text-xs bg-primary text-primary-foreground hover:brightness-105"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              ثبت استعلام در کارتابل
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
