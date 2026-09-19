"use client";

import { useState, useEffect } from "react";
import {
  Tags,
  Plus,
  Trash2,
  Save,
  Sparkles,
  Layers,
  HelpCircle,
  Hash,
  CheckCircle2,
  Sliders,
  Check,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { STONE_TYPES, type StoneType } from "@/constants";
import { ATTRIBUTE_GROUPS } from "../../data/mock-attributes";
import type {
  AttributeDefinition,
  AttributeFormData,
  AttributeGroup,
  AttributeDataType,
  AttributeOption,
} from "../../types";

interface AttributeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAttribute: AttributeDefinition | null;
  onSubmit: (data: AttributeFormData) => { success: boolean; error?: string };
}

const COMMON_STONE_UNITS = [
  { label: "درصد (%)", value: "درصد" },
  { label: "kg/cm² (فشار)", value: "kg/cm²" },
  { label: "gr/cm³ (چگالی)", value: "gr/cm³" },
  { label: "سانتی‌متر (ضخامت)", value: "سانتی‌متر" },
  { label: "Mohs (سختی ۱-۱۰)", value: "Mohs" },
  { label: "سیکل (یخبندان)", value: "سیکل" },
  { label: "MPa (مگاپاسکال)", value: "MPa" },
  { label: "میلی‌متر", value: "mm" },
];

const STONE_TYPE_LABELS: Record<StoneType, string> = {
  travertine: "تراورتن",
  granite: "گرانیت",
  marble: "مرمریت",
  onyx: "مرمر اونیکس",
  quartzite: "کوارتزیت",
  limestone: "لایم‌استون",
  porcelain: "پرسلان",
  basalt: "بازالت",
  sandstone: "سنداستون",
  slate: "اسلیت",
};

export function AttributeFormDialog({
  open,
  onOpenChange,
  editingAttribute,
  onSubmit,
}: AttributeFormDialogProps) {
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [code, setCode] = useState("");
  const [group, setGroup] = useState<AttributeGroup>("finishes");
  const [dataType, setDataType] = useState<AttributeDataType>("select");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [isVariantDriver, setIsVariantDriver] = useState(false);
  const [isFilterable, setIsFilterable] = useState(true);
  const [isRequired, setIsRequired] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [applicableStones, setApplicableStones] = useState<StoneType[]>([]);
  const [options, setOptions] = useState<AttributeOption[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New option draft inputs
  const [newOptLabel, setNewOptLabel] = useState("");
  const [newOptLabelEn, setNewOptLabelEn] = useState("");
  const [newOptValue, setNewOptValue] = useState("");
  const [newOptColor, setNewOptColor] = useState("#d4d4d8");

  useEffect(() => {
    if (open) {
      if (editingAttribute) {
        setName(editingAttribute.name);
        setNameEn(editingAttribute.nameEn);
        setCode(editingAttribute.code);
        setGroup(editingAttribute.group);
        setDataType(editingAttribute.dataType);
        setUnit(editingAttribute.unit ?? "");
        setDescription(editingAttribute.description ?? "");
        setIsVariantDriver(editingAttribute.isVariantDriver);
        setIsFilterable(editingAttribute.isFilterable);
        setIsRequired(editingAttribute.isRequired);
        setIsActive(editingAttribute.isActive);
        setApplicableStones(editingAttribute.applicableStoneTypes ?? []);
        setOptions(editingAttribute.options ?? []);
      } else {
        setName("");
        setNameEn("");
        setCode("");
        setGroup("finishes");
        setDataType("select");
        setUnit("");
        setDescription("");
        setIsVariantDriver(false);
        setIsFilterable(true);
        setIsRequired(false);
        setIsActive(true);
        setApplicableStones([]);
        setOptions([
          { id: "opt-1", label: "گزینه ۱", value: "option-1", isDefault: true },
        ]);
      }
      setErrorMessage(null);
      setNewOptLabel("");
      setNewOptLabelEn("");
      setNewOptValue("");
    }
  }, [open, editingAttribute]);

  // Generate code automatically from English name or Persian name
  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    if (!editingAttribute && (!code || code === autoSlug(nameEn))) {
      setCode(autoSlug(val));
    }
  };

  const autoSlug = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  };

  // Add option to list
  const handleAddOption = () => {
    if (!newOptLabel.trim()) return;
    const generatedValue = newOptValue.trim() || autoSlug(newOptLabelEn || newOptLabel) || `opt_${Date.now()}`;
    const newOpt: AttributeOption = {
      id: `opt-${Date.now()}`,
      label: newOptLabel.trim(),
      labelEn: newOptLabelEn.trim() || undefined,
      value: generatedValue,
      colorHex: newOptColor !== "#d4d4d8" ? newOptColor : undefined,
    };
    setOptions([...options, newOpt]);
    setNewOptLabel("");
    setNewOptLabelEn("");
    setNewOptValue("");
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter((o) => o.id !== id));
  };

  const toggleStoneType = (stone: StoneType) => {
    if (applicableStones.includes(stone)) {
      setApplicableStones(applicableStones.filter((s) => s !== stone));
    } else {
      setApplicableStones([...applicableStones, stone]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("لطفاً عنوان فارسی ویژگی را وارد کنید.");
      return;
    }
    if (!code.trim()) {
      setErrorMessage("لطفاً کد انگلیسی شناسه ویژگی را وارد کنید.");
      return;
    }
    if ((dataType === "select" || dataType === "multiselect") && options.length === 0) {
      setErrorMessage("برای فیلدهای گزینه‌ای، حداقل یک گزینه باید تعریف شود.");
      return;
    }

    const payload: AttributeFormData = {
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      code: autoSlug(code),
      group,
      dataType,
      unit: dataType === "number" || dataType === "range" ? unit.trim() : undefined,
      description: description.trim() || undefined,
      options: dataType === "select" || dataType === "multiselect" ? options : [],
      applicableStoneTypes: applicableStones.length > 0 ? applicableStones : undefined,
      isVariantDriver,
      isFilterable,
      isRequired,
      isActive,
    };

    const result = onSubmit(payload);
    if (!result.success) {
      setErrorMessage(result.error || "خطا در ثبت ویژگی.");
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-2.5 text-primary">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Tags className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                {editingAttribute ? `ویرایش ویژگی «${editingAttribute.name}»` : "افزودن ویژگی و مشخصه فنی جدید"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                تنظیمات مشخصات فنی سنگ، فینیش‌های سطحی، استانداردهای آزمایشگاهی و متغیرهای قیمت‌گذاری
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMessage && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Group Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">دسته‌بندی و گروه ویژگی</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ATTRIBUTE_GROUPS.map((g) => {
                const isSelected = group === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGroup(g.id)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-start transition-all text-xs ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-2xs"
                        : "border-border/70 hover:border-border hover:bg-secondary/40"
                    }`}
                  >
                    <span className="font-bold text-foreground truncate">{g.title}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 truncate" dir="ltr">
                      {g.titleEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Code Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                نام فارسی ویژگی <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً: درصد جذب آب، فینیش بوش‌همر..."
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">نام انگلیسی (جهت خروجی کاتالوگ)</Label>
              <Input
                value={nameEn}
                onChange={(e) => handleNameEnChange(e.target.value)}
                placeholder="Water Absorption, Surface Finish..."
                className="text-xs h-9"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                شناسه سیستمی (کد متغیر) <span className="text-destructive">*</span>
              </Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="water_absorption_pct"
                className="text-xs h-9 font-mono"
                dir="ltr"
              />
              <p className="text-[10px] text-muted-foreground">
                کد یکتای انگلیسی بدون فاصله (مانند compressive_strength).
              </p>
            </div>

            {/* Data Type */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">نوع فیلد داده‌ای</Label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value as AttributeDataType)}
                className="w-full h-9 rounded-lg border border-border/80 bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="select">انتخاب تک‌گزینه‌ای (Select)</option>
                <option value="multiselect">انتخاب چندگزینه‌ای (Multi-Select)</option>
                <option value="number">عددی با واحد اندازه‌گیری (Number + Unit)</option>
                <option value="range">بازه عددی (Range e.g. 2 - 3 cm)</option>
                <option value="boolean">بله / خیر دو وضعیتی (Boolean)</option>
                <option value="text">متنی آزاد (Text)</option>
              </select>
            </div>
          </div>

          {/* If Number / Range: Unit input + quick chips */}
          {(dataType === "number" || dataType === "range") && (
            <div className="rounded-xl border border-border/70 bg-secondary/30 p-3 space-y-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">واحد اندازه‌گیری مهندسی</Label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="مثلاً: درصد، kg/cm²، سانتی‌متر..."
                  className="text-xs h-8 bg-card"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-muted-foreground">واحدهای رایج آزمایشگاهی سنگ:</span>
                {COMMON_STONE_UNITS.map((u) => (
                  <button
                    key={u.value}
                    type="button"
                    onClick={() => setUnit(u.value)}
                    className="rounded-md border border-border/80 bg-card px-2 py-0.5 text-[10px] hover:border-primary hover:text-primary transition-colors"
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* If Select / Multiselect: Options Builder */}
          {(dataType === "select" || dataType === "multiselect") && (
            <div className="rounded-xl border border-border/70 bg-secondary/30 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-foreground">
                  گزینه‌های مجاز برای این ویژگی ({options.length.toLocaleString("fa-IR")})
                </Label>
                <span className="text-[10px] text-muted-foreground">
                  مقادیری که مدیر کارخانه هنگام ایجاد سنگ انتخاب می‌کند
                </span>
              </div>

              {/* Existing Options List */}
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {options.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-card p-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] text-muted-foreground w-4 text-center font-mono">
                        {idx + 1}
                      </span>
                      {opt.colorHex && (
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-border/50 shrink-0"
                          style={{ backgroundColor: opt.colorHex }}
                        />
                      )}
                      <span className="font-semibold text-foreground truncate">{opt.label}</span>
                      {opt.labelEn && (
                        <span className="text-[10px] text-muted-foreground truncate" dir="ltr">
                          ({opt.labelEn})
                        </span>
                      )}
                      <code className="text-[10px] text-muted-foreground font-mono bg-muted px-1 rounded" dir="ltr">
                        {opt.value}
                      </code>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveOption(opt.id)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Option Sub-form */}
              <div className="rounded-lg border border-dashed border-border/80 p-2.5 space-y-2 bg-card/60">
                <span className="text-[11px] font-semibold text-foreground">افزودن گزینه جدید:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    value={newOptLabel}
                    onChange={(e) => setNewOptLabel(e.target.value)}
                    placeholder="عنوان فارسی (مثلاً: چرمی)"
                    className="text-xs h-8"
                  />
                  <Input
                    value={newOptLabelEn}
                    onChange={(e) => setNewOptLabelEn(e.target.value)}
                    placeholder="عنوان لاتین (Leathered)"
                    className="text-xs h-8"
                    dir="ltr"
                  />
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={newOptValue}
                      onChange={(e) => setNewOptValue(e.target.value)}
                      placeholder="کد (leathered)"
                      className="text-xs h-8 font-mono"
                      dir="ltr"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAddOption}
                      className="h-8 px-2.5 text-xs shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>ثبت</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applicable Stone Types */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">سنگ‌های مرتبط با این مشخصه</Label>
              <span className="text-[10px] text-muted-foreground">
                {applicableStones.length === 0 ? "اعمال روی همه انواع سنگ" : `${applicableStones.length} سنگ انتخاب شده`}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STONE_TYPES.map((stone) => {
                const isSelected = applicableStones.includes(stone);
                return (
                  <button
                    key={stone}
                    type="button"
                    onClick={() => toggleStoneType(stone)}
                    className={`rounded-lg px-2.5 py-1 text-xs border font-medium transition-all ${
                      isSelected
                        ? "border-amber-600 bg-amber-600/10 text-amber-800 dark:text-amber-300 font-bold"
                        : "border-border/70 bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {STONE_TYPE_LABELS[stone]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Behavior Configuration Flags */}
          <div className="rounded-xl border border-border/70 bg-secondary/20 p-3 space-y-2.5">
            <p className="text-xs font-bold text-foreground">تنظیمات سیستمی و نحوه اثرگذاری:</p>

            <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
              <div>
                <p className="text-xs font-semibold text-foreground">تنوع‌ساز قیمت و موجودی انبار (Variant Driver)</p>
                <p className="text-[10px] text-muted-foreground">
                  آیا انتخاب این مشخصه (مثل فینیش یا ضخامت) باعث ایجاد SKUهای مجزا با قیمت متغیر می‌شود؟
                </p>
              </div>
              <input
                type="checkbox"
                checked={isVariantDriver}
                onChange={(e) => setIsVariantDriver(e.target.checked)}
                className="h-4 w-4 rounded accent-primary cursor-pointer"
              />
            </label>

            <div className="h-px bg-border/60" />

            <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
              <div>
                <p className="text-xs font-semibold text-foreground">نمایش در فیلترهای جستجوی وبگاه (Faceted Filter)</p>
                <p className="text-[10px] text-muted-foreground">
                  خریداران و معماران می‌توانند کاتالوگ سنگ را بر اساس این مشخصه فیلتر کنند.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isFilterable}
                onChange={(e) => setIsFilterable(e.target.checked)}
                className="h-4 w-4 rounded accent-primary cursor-pointer"
              />
            </label>

            <div className="h-px bg-border/60" />

            <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
              <div>
                <p className="text-xs font-semibold text-foreground">فیلد الزامی در فرم ثبت سنگ</p>
                <p className="text-[10px] text-muted-foreground">
                  تکمیل این مشخصه برای ثبت هر سنگ جدید در کاتالوگ کارخانه اجباری خواهد بود.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="h-4 w-4 rounded accent-primary cursor-pointer"
              />
            </label>

            <div className="h-px bg-border/60" />

            <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
              <div>
                <p className="text-xs font-semibold text-foreground">وضعیت فعال در سیستم</p>
                <p className="text-[10px] text-muted-foreground">
                  در صورت غیرفعال بودن، در ثبت سنگ‌های جدید نمایش داده نخواهد شد.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded accent-primary cursor-pointer"
              />
            </label>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold">توضیحات و راهنمای مهندسی سنگ</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیح فنی روش آزمون، تأثیر در مقاومت سنگ، نکات مربوط به چسبندگی و ..."
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
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
              type="submit"
              size="sm"
              className="gap-1.5 text-xs font-semibold shadow-xs"
            >
              <Save className="h-4 w-4" />
              <span>{editingAttribute ? "ذخیره تغییرات" : "افزودن ویژگی به کاتالوگ"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
