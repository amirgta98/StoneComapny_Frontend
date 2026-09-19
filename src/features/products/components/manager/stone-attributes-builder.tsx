"use client";

import { useState, useMemo, useRef } from "react";
import {
  ShieldCheck,
  Plus,
  Trash2,
  FileText,
  Upload,
  Download,
  CheckCircle,
  Sparkles,
  BarChart3,
  X,
  Layers,
  Wand2,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import type { ProductAttribute } from "@/types";
import { STONE_TYPES, type StoneType } from "@/constants";
import { STONE_TYPE_LABELS } from "../../constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Standard preset attributes per stone type
const STONE_PRESET_SPECS: Record<StoneType, ProductAttribute[]> = {
  travertine: [
    { id: "att-trv-1", name: "درصد تخلخل ظاهری", value: "۸.۵", unit: "درصد" },
    { id: "att-trv-2", name: "درصد جذب آب", value: "۰.۱۵", unit: "درصد" },
    { id: "att-trv-3", name: "مقاومت فشاری", value: "۵۴۰", unit: "kg/cm²" },
    { id: "att-trv-4", name: "وزن مخصوص ظاهری", value: "۲.۵۵", unit: "gr/cm³" },
    { id: "att-trv-5", name: "مقاومت خمشی", value: "۱۱۰", unit: "kg/cm²" },
    { id: "att-trv-6", name: "چسبندگی ملات سیمان", value: "عالی (تخلخل باز)", unit: "کیفی" },
  ],
  granite: [
    { id: "att-grn-1", name: "مقاومت فشاری", value: "۱۴۵۰", unit: "kg/cm²" },
    { id: "att-grn-2", name: "سختی موس (Mohs)", value: "۶.۵", unit: "Mohs" },
    { id: "att-grn-3", name: "مقاومت سایشی", value: "۰.۴۵", unit: "cm³/50cm²" },
    { id: "att-grn-4", name: "درصد جذب آب", value: "۰.۰۸", unit: "درصد" },
    { id: "att-grn-5", name: "مقاومت در برابر اسید", value: "کاملاً مقاوم", unit: "کیفی" },
    { id: "att-grn-6", name: "وزن مخصوص", value: "۲.۷۵", unit: "gr/cm³" },
  ],
  onyx: [
    { id: "att-onx-1", name: "درصد عبور نور (Backlit)", value: "۷۵", unit: "درصد" },
    { id: "att-onx-2", name: "درجه بلورینگی", value: "۹۲", unit: "درصد" },
    { id: "att-onx-3", name: "مقاومت فشاری", value: "۹۸۰", unit: "kg/cm²" },
    { id: "att-onx-4", name: "مقاومت خمشی", value: "۱۳۵", unit: "kg/cm²" },
    { id: "att-onx-5", name: "درصد جذب آب", value: "۰.۰۵", unit: "درصد" },
    { id: "att-onx-6", name: "شفافیت بلوری", value: "سوپر ترنسپرنت", unit: "کیفی" },
  ],
  marble: [
    { id: "att-mrb-1", name: "درصد جذب آب", value: "۰.۱۸", unit: "درصد" },
    { id: "att-mrb-2", name: "مقاومت فشاری", value: "۱۲۵۰", unit: "kg/cm²" },
    { id: "att-mrb-3", name: "وزن مخصوص", value: "۲.۶۸", unit: "gr/cm³" },
    { id: "att-mrb-4", name: "مقاومت سایشی", value: "۱۸", unit: "Ha" },
    { id: "att-mrb-5", name: "ضریب انبساط حرارتی", value: "۵.۲ × 10⁻⁶", unit: "/°C" },
  ],
  limestone: [
    { id: "att-lms-1", name: "درصد جذب آب", value: "۱.۸", unit: "درصد" },
    { id: "att-lms-2", name: "مقاومت فشاری", value: "۶۵۰", unit: "kg/cm²" },
    { id: "att-lms-3", name: "وزن مخصوص", value: "۲.۴۰", unit: "gr/cm³" },
    { id: "att-lms-4", name: "سازگاری با گرمایش از کف", value: "تأیید شده", unit: "کیفی" },
  ],
  quartzite: [
    { id: "att-qrz-1", name: "سختی موس (Mohs)", value: "۷.۰", unit: "Mohs" },
    { id: "att-qrz-2", name: "مقاومت فشاری", value: "۱۸۰۰", unit: "kg/cm²" },
    { id: "att-qrz-3", name: "درصد جذب آب", value: "۰.۰۴", unit: "درصد" },
    { id: "att-qrz-4", name: "مقاومت اسیدی و لکه‌پذیری", value: "فوق‌العاده بالا", unit: "کیفی" },
  ],
  basalt: [
    { id: "att-bsl-1", name: "مقاومت در برابر یخبندان", value: "۵۰", unit: "سیکل" },
    { id: "att-bsl-2", name: "مقاومت فشاری", value: "۱۶۰۰", unit: "kg/cm²" },
    { id: "att-bsl-3", name: "وزن مخصوص", value: "۲.۸۵", unit: "gr/cm³" },
    { id: "att-bsl-4", name: "درصد جذب آب", value: "۰.۲۰", unit: "درصد" },
  ],
  porcelain: [
    { id: "att-prc-1", name: "درصد جذب آب", value: "۰.۰۱", unit: "درصد" },
    { id: "att-prc-2", name: "مقاومت به لکه و اسید", value: "کلاس ۵ (کامل)", unit: "کلاس" },
    { id: "att-prc-3", name: "مقاومت خمشی", value: "۴۵۰", unit: "kg/cm²" },
  ],
  slate: [
    { id: "att-slt-1", name: "مقاومت خمشی لایه‌ای", value: "۲۸۰", unit: "kg/cm²" },
    { id: "att-slt-2", name: "درصد جذب آب", value: "۰.۳", unit: "درصد" },
    { id: "att-slt-3", name: "مقاومت هوازدگی", value: "عالی", unit: "کیفی" },
  ],
  sandstone: [
    { id: "att-snd-1", name: "درصد تخلخل", value: "۶.۲", unit: "درصد" },
    { id: "att-snd-2", name: "مقاومت فشاری", value: "۷۵۰", unit: "kg/cm²" },
    { id: "att-snd-3", name: "درصد جذب آب", value: "۱.۴", unit: "درصد" },
  ],
};

const SUGGESTED_ATTRIBUTE_NAMES = [
  "درصد جذب آب",
  "مقاومت فشاری",
  "وزن مخصوص",
  "درصد تخلخل",
  "مقاومت سایشی",
  "سختی موس (Mohs)",
  "درصد عبور نور (Backlit)",
  "مقاومت خمشی",
  "مقاومت در برابر یخبندان",
  "ضریب انبساط حرارتی",
  "مقاومت اسیدی",
  "رادیواکتیویته استاندارد",
];

const COMMON_UNITS = ["درصد", "kg/cm²", "gr/cm³", "Mohs", "سیکل", "کیفی"];

export interface LabCertificate {
  url: string;
  name: string;
  laboratoryName?: string;
  date?: string;
}

interface StoneAttributesBuilderProps {
  attributes: ProductAttribute[];
  onChange: (attributes: ProductAttribute[]) => void;
  stoneType: StoneType;
  labCertificate?: LabCertificate | null;
  onLabCertificateChange?: (cert: LabCertificate | null) => void;
  className?: string;
}

export function StoneAttributesBuilder({
  attributes,
  onChange,
  stoneType,
  labCertificate,
  onLabCertificateChange,
  className = "",
}: StoneAttributesBuilderProps) {
  const certInputRef = useRef<HTMLInputElement>(null);

  // New empty attribute row
  const handleAddAttribute = () => {
    const newAtt: ProductAttribute = {
      id: `att-custom-${Date.now()}`,
      name: "",
      value: "",
      unit: "درصد",
    };
    onChange([...attributes, newAtt]);
  };

  const handleUpdateAttribute = (
    index: number,
    field: keyof ProductAttribute,
    val: string
  ) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const handleRemoveAttribute = (index: number) => {
    onChange(attributes.filter((_, i) => i !== index));
  };

  // Load smart presets for the selected stone type
  const handleLoadPresets = () => {
    const preset = STONE_PRESET_SPECS[stoneType] || STONE_PRESET_SPECS.marble;
    onChange(preset);
    toast.success(
      `مشخصات استاندارد آزمایشگاهی «${STONE_TYPE_LABELS[stoneType]}» با موفقیت بارگذاری شد.`
    );
  };

  // Handle Lab Certificate Upload
  const handleCertFileSelect = (file?: File) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error("حجم فایل گواهی نباید بیشتر از ۱۵ مگابایت باشد.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const cert: LabCertificate = {
        url: result,
        name: file.name,
        laboratoryName: "آزمایشگاه جامع سنگ و مصالح ساختمانی",
        date: new Date().toLocaleDateString("fa-IR"),
      };
      onLabCertificateChange?.(cert);
      toast.success("برگه آنالیز آزمایشگاهی با موفقیت پیوست شد.");
    };
    reader.readAsDataURL(file);
  };

  // Compute live quality indicators for Stone Performance Radar Preview
  const qualityScores = useMemo(() => {
    const waterAttr = attributes.find((a) => a.name.includes("جذب آب"));
    const compAttr = attributes.find((a) => a.name.includes("فشاری"));
    const wearAttr = attributes.find((a) => a.name.includes("سایش") || a.name.includes("موس"));

    const waterVal = parseFloat(waterAttr?.value || "0.2");
    const compVal = parseFloat(compAttr?.value || "1000");

    const waterScore = waterVal <= 0.1 ? 5 : waterVal <= 0.3 ? 4 : waterVal <= 1.0 ? 3 : 2;
    const compScore = compVal >= 1400 ? 5 : compVal >= 1000 ? 4 : compVal >= 500 ? 3 : 2;

    return {
      waterResistance: waterScore,
      loadBearing: compScore,
      overallTier: waterScore >= 4 && compScore >= 4 ? "گرید کیفی A+ (صادراتی)" : "گرید تجاری استاندارد",
    };
  }, [attributes]);

  return (
    <div className={`space-y-5 ${className}`} dir="rtl">
      {/* Section Header with Smart Preset Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>آنالیز فیزیکی و شیمیایی آزمایشگاهی سنگ</span>
          </Label>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            پارامترهای استاندارد ژئوتکنیکی و مکانیکی، اعتماد کارفرمایان و مهندسین ناظر را تضمین می‌کند.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLoadPresets}
            className="text-xs h-8 gap-1.5 border-primary/40 text-primary hover:bg-primary/10 shadow-2xs"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>بارگذاری مقادیر استاندارد {STONE_TYPE_LABELS[stoneType]}</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleAddAttribute}
            className="text-xs h-8 gap-1 font-semibold shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>افزودن پارامتر</span>
          </Button>
        </div>
      </div>

      {/* Attributes Dynamic List */}
      <div className="space-y-2.5">
        {attributes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground space-y-2">
            <p>هیچ مشخصه فنی ثبت نشده است.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadPresets}
              className="text-xs gap-1.5"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>بارگذاری سریع قالب {STONE_TYPE_LABELS[stoneType]}</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground bg-secondary/30 rounded-lg">
              <span className="col-span-4 sm:col-span-5">نام مشخصه آزمایشگاهی</span>
              <span className="col-span-4 sm:col-span-4">مقدار عددی یا نتیجه آزمون</span>
              <span className="col-span-3 sm:col-span-2">واحد سنجش</span>
              <span className="col-span-1 text-center">عملیات</span>
            </div>

            {/* Rows */}
            {attributes.map((att, idx) => (
              <div
                key={att.id || idx}
                className="group grid grid-cols-12 gap-2 items-center rounded-xl border border-border/70 p-2 bg-card hover:border-primary/40 hover:bg-secondary/20 transition-colors shadow-2xs"
              >
                {/* Attribute Name with Datalist Suggestions */}
                <div className="col-span-4 sm:col-span-5">
                  <Input
                    list={`suggested-att-names-${idx}`}
                    value={att.name}
                    onChange={(e) =>
                      handleUpdateAttribute(idx, "name", e.target.value)
                    }
                    placeholder="مثال: مقاومت فشاری، درصد جذب آب..."
                    className="text-xs h-8"
                  />
                  <datalist id={`suggested-att-names-${idx}`}>
                    {SUGGESTED_ATTRIBUTE_NAMES.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>

                {/* Attribute Value */}
                <div className="col-span-4 sm:col-span-4">
                  <Input
                    value={att.value}
                    onChange={(e) =>
                      handleUpdateAttribute(idx, "value", e.target.value)
                    }
                    placeholder="مثال: ۱۲۵۰ یا ۰.۱۸"
                    className="text-xs h-8 font-mono"
                  />
                </div>

                {/* Unit */}
                <div className="col-span-3 sm:col-span-2">
                  <Input
                    list={`suggested-units-${idx}`}
                    value={att.unit || ""}
                    onChange={(e) =>
                      handleUpdateAttribute(idx, "unit", e.target.value)
                    }
                    placeholder="kg/cm²"
                    className="text-xs h-8 font-mono"
                  />
                  <datalist id={`suggested-units-${idx}`}>
                    {COMMON_UNITS.map((u) => (
                      <option key={u} value={u} />
                    ))}
                  </datalist>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAttribute(idx)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                    title="حذف این مشخصه"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quality Radar & Durability Summary Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="rounded-xl border border-border/80 bg-secondary/30 p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-muted-foreground block">مقاومت در برابر نفوذ رطوبت</span>
            <span className="text-xs font-bold text-foreground">
              {qualityScores.waterResistance} از ۵ ستاره
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-amber-500">
            {"★".repeat(qualityScores.waterResistance)}
            {"☆".repeat(5 - qualityScores.waterResistance)}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-secondary/30 p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-muted-foreground block">تحمل بار فشاری و ترافیکی</span>
            <span className="text-xs font-bold text-foreground">
              {qualityScores.loadBearing} از ۵ ستاره
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-primary">
            {"★".repeat(qualityScores.loadBearing)}
            {"☆".repeat(5 - qualityScores.loadBearing)}
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-muted-foreground block">سطح ارزیابی کیفی سنگ</span>
            <span className="text-xs font-bold text-primary">
              {qualityScores.overallTier}
            </span>
          </div>
          <CheckCircle className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Official Laboratory Certificate Attachment Section */}
      <div className="pt-4 border-t border-border/60 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-primary" />
              <span>پیوست گواهی رسمی آزمایشگاه مکانیک خاک و آزمون استاندارد سنگ</span>
            </Label>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              فایل PDF یا تصویر اسکن‌شده برگه تأییدیه آزمایشگاه مرجع (حداکثر ۱۵ مگابایت)
            </p>
          </div>

          <input
            ref={certInputRef}
            type="file"
            accept=".pdf, image/png, image/jpeg"
            onChange={(e) => handleCertFileSelect(e.target.files?.[0])}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => certInputRef.current?.click()}
            className="text-xs h-8 gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>آپلود برگه آزمایشگاه</span>
          </Button>
        </div>

        {/* Uploaded Certificate Card */}
        {labCertificate ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-foreground block truncate">
                  {labCertificate.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  تاریخ بارگذاری: {labCertificate.date || "امروز"} | وضعیت: تأیید شده توسط سیستم
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 text-xs gap-1"
              >
                <a href={labCertificate.url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-3.5 w-3.5" />
                  <span>مشاهده</span>
                </a>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onLabCertificateChange?.(null)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                title="حذف گواهی"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => certInputRef.current?.click()}
            className="rounded-xl border border-dashed border-border/80 p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <FileCheck className="h-5 w-5 text-primary/70" />
              <span className="font-semibold text-foreground">
                برای بارگذاری گواهی آزمایشگاه کلیک فرمایید
              </span>
              <span className="text-[10px]">
                فرمت‌های PDF، JPG یا PNG دارای مهر و امضای آزمایشگاه معتبر
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
