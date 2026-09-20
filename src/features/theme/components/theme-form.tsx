"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { themeSchema, type ThemeFormValues } from "@/features/theme/schemas";
import { defaultTokens, type ThemeTokens } from "@/providers";
import { useThemeEditorStore } from "@/stores/theme-editor-store";
import { ColorTokenInput } from "./color-token-input";
import { RadiusSelector } from "./radius-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Palette,
  Layers,
  Type,
  Sparkles,
  RotateCcw,
  Save,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThemeFormProps {
  initialValues?: Partial<ThemeTokens>;
  onSubmit: (values: ThemeFormValues) => Promise<void> | void;
  onReset?: () => void;
  onValuesChange?: (values: ThemeFormValues) => void;
  isSubmitting?: boolean;
  className?: string;
}

const FONT_OPTIONS = [
  { value: "var(--font-vazirmatn)", label: "وزیرمتن (Vazirmatn - پیش‌فرض)" },
  { value: "var(--font-iransans)", label: "ایران‌سنس (IRANSans)" },
  { value: "var(--font-shabnam)", label: "شبنم (Shabnam)" },
  {
    value: "ui-sans-serif, system-ui, sans-serif",
    label: "قلم پیش‌فرض سیستم (System UI)",
  },
];

export function ThemeForm({
  initialValues,
  onSubmit,
  onReset,
  onValuesChange,
  isSubmitting = false,
  className,
}: ThemeFormProps) {
  const setDraft = useThemeEditorStore((s) => s.setDraft);

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      ...defaultTokens,
      ...initialValues,
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isDirty },
  } = form;

  // Real-time synchronization with themeEditorStore and optional parent listener
  React.useEffect(() => {
    const subscription = watch((currentValues) => {
      // Cast to Partial<ThemeTokens>
      const draft = currentValues as Partial<ThemeTokens>;
      setDraft(draft);
      if (onValuesChange) {
        onValuesChange(currentValues as ThemeFormValues);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setDraft, onValuesChange]);

  const handleReset = () => {
    reset(defaultTokens);
    if (onReset) {
      onReset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6 text-right", className)}
      dir="rtl"
      noValidate
    >
      {/* SECTION 1: Brand Colors */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Palette className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              رنگ‌های برند و اصلی (Brand Colors)
            </h3>
            <p className="text-xs text-muted-foreground">
              رنگ‌های هویت تجاری کارخانه، دکمه‌های اصلی، سربرگ‌ها و هایلایت‌های شاخص
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary & Primary Foreground */}
          <Controller
            control={control}
            name="primary"
            render={({ field }) => (
              <ColorTokenInput
                name={field.name}
                label="رنگ اصلی کارخانه (Primary)"
                description="رنگ شاخص برند، دکمه‌ها و عناصر تعاملی اصلی"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.primary?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            control={control}
            name="primaryForeground"
            render={({ field }) => (
              <ColorTokenInput
                name={field.name}
                label="متن روی رنگ اصلی (Primary Foreground)"
                description="رنگ نوشته و آیکون‌ها بر روی دکمه‌های اصلی"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.primaryForeground?.message}
                disabled={isSubmitting}
              />
            )}
          />

          {/* Secondary & Secondary Foreground */}
          <Controller
            control={control}
            name="secondary"
            render={({ field }) => (
              <ColorTokenInput
                name={field.name}
                label="رنگ ثانویه (Secondary)"
                description="رنگ پس‌زمینه دکمه‌ها و نشان‌های مکمل"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.secondary?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            control={control}
            name="secondaryForeground"
            render={({ field }) => (
              <ColorTokenInput
                name={field.name}
                label="متن روی رنگ ثانویه (Secondary Foreground)"
                description="رنگ نوشته روی دکمه‌ها و نوارهای مکمل"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.secondaryForeground?.message}
                disabled={isSubmitting}
              />
            )}
          />

          {/* Accent & Accent Foreground */}
          <Controller
            control={control}
            name="accent"
            render={({ field }) => (
              <ColorTokenInput
                name={field.name}
                label="رنگ تأکیدی (Accent)"
                description="رنگ نشان‌ها، بج‌های ویژه و کادرهای برجسته"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.accent?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            control={control}
            name="accentForeground"
            render={({ field }) => (
              <ColorTokenInput
                name={field.name}
                label="متن روی رنگ تأکیدی (Accent Foreground)"
                description="رنگ نوشته روی عناصر با رنگ تأکیدی"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.accentForeground?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </div>
      </section>

      {/* SECTION 2: Base UI Colors */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              رنگ‌های پایه رابط کاربری (Base UI Colors)
            </h3>
            <p className="text-xs text-muted-foreground">
              پس‌زمینه صفحات، رنگ متن اصلی، خطوط جداکننده و سطوح مات
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="background"
            render={({ field }) => (
              <ColorTokenInput
                name={field.name}
                label="پس‌زمینه صفحات (Background)"
                description="رنگ پس‌زمینه کلی صفحات پرتال و سایت"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.background?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            control={control}
            name="foreground"
            render={({ field }) => (
              <ColorTokenInput
                name={field.name}
                label="متن اصلی (Foreground)"
                description="رنگ تیترها و متون عمومی سایت"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.foreground?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            control={control}
            name="muted"
            render={({ field }) => (
              <ColorTokenInput
                name={field.name}
                label="رنگ خنثی / مات (Muted)"
                description="پس‌زمینه جدول‌ها، فیلدها و کادرهای اطلاعاتی"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.muted?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            control={control}
            name="mutedForeground"
            render={({ field }) => (
              <ColorTokenInput
                name={field.name}
                label="متن کم‌رنگ (Muted Foreground)"
                description="رنگ راهنماها، توضیحات فرعی و متادیتاها"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.mutedForeground?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <div className="md:col-span-2">
            <Controller
              control={control}
              name="border"
              render={({ field }) => (
                <ColorTokenInput
                  name={field.name}
                  label="رنگ کادر و حاشیه‌ها (Border)"
                  description="خطوط جداکننده کارت‌ها، جدول‌ها و ورودی‌ها"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.border?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: Typography & Geometry */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Type className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              تایپوگرافی و هندسه اجزا (Typography & Geometry)
            </h3>
            <p className="text-xs text-muted-foreground">
              قلم نوشته‌های عمومی، قلم سربرگ‌ها و میزان گردی لبه‌ها
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Border Radius with Preset Buttons + Custom Input */}
          <Controller
            control={control}
            name="radius"
            render={({ field }) => (
              <RadiusSelector
                name={field.name}
                label="شعاع انحنای گوشه‌ها (Border Radius)"
                description="انتخاب اندازه انحنای لبه کارت‌ها، دکمه‌ها و فیلدهای ورودی"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.radius?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Font Sans */}
            <Controller
              control={control}
              name="fontSans"
              render={({ field }) => {
                const knownPreset = FONT_OPTIONS.some(
                  (opt) => opt.value === field.value
                );
                return (
                  <div className="space-y-1.5 text-right">
                    <Label
                      htmlFor="fontSans"
                      className="text-xs font-medium text-foreground"
                    >
                      قلم متون عمومی (Font Sans)
                    </Label>
                    <Select
                      value={knownPreset ? field.value : "custom"}
                      onValueChange={(val) => {
                        if (val !== "custom") {
                          field.onChange(val);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="fontSans-select" className="text-xs">
                        <SelectValue placeholder="انتخاب قلم عمومی" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {FONT_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="text-xs"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom" className="text-xs">
                          قلم سفارشی (Custom CSS Font)...
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      id="fontSans"
                      name={field.name}
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      disabled={isSubmitting}
                      placeholder="var(--font-vazirmatn)"
                      className="font-mono text-xs text-left mt-1"
                      dir="ltr"
                    />
                    {errors.fontSans && (
                      <p
                        role="alert"
                        className="text-xs text-destructive font-medium mt-1"
                      >
                        ⚠️ {errors.fontSans.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            {/* Font Heading */}
            <Controller
              control={control}
              name="fontHeading"
              render={({ field }) => {
                const knownPreset = FONT_OPTIONS.some(
                  (opt) => opt.value === field.value
                );
                return (
                  <div className="space-y-1.5 text-right">
                    <Label
                      htmlFor="fontHeading"
                      className="text-xs font-medium text-foreground"
                    >
                      قلم تیترها و سربرگ‌ها (Font Heading)
                    </Label>
                    <Select
                      value={knownPreset ? field.value : "custom"}
                      onValueChange={(val) => {
                        if (val !== "custom") {
                          field.onChange(val);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="fontHeading-select" className="text-xs">
                        <SelectValue placeholder="انتخاب قلم سربرگ‌ها" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {FONT_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="text-xs"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom" className="text-xs">
                          قلم سفارشی (Custom CSS Font)...
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      id="fontHeading"
                      name={field.name}
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      disabled={isSubmitting}
                      placeholder="var(--font-vazirmatn)"
                      className="font-mono text-xs text-left mt-1"
                      dir="ltr"
                    />
                    {errors.fontHeading && (
                      <p
                        role="alert"
                        className="text-xs text-destructive font-medium mt-1"
                      >
                        ⚠️ {errors.fontHeading.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </section>

      {/* FORM ACTIONS */}
      <div className="sticky bottom-4 z-10 rounded-xl border border-border bg-card/95 backdrop-blur-md p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>
            {isDirty
              ? "تغییرات شما در حال پیش‌نمایش است و هنوز ذخیره نشده است."
              : "قالب در وضعیت همگام‌سازی شده قرار دارد."}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isSubmitting}
            className="text-xs gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>بازنشانی به پیش‌فرض</span>
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !isValid}
            className="text-xs gap-1.5 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>ذخیره تغییرات قالب</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
