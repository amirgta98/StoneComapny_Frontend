"use client";

import * as React from "react";
import { toast } from "sonner";
import { useAuth } from "@/auth";
import { useTheme, defaultTokens, type ThemeTokens } from "@/providers";
import { updateTenantTheme } from "@/features/theme/actions";
import { type ThemeFormValues } from "@/features/theme/schemas";
import { useThemeEditorStore } from "@/stores/theme-editor-store";
import { ThemeForm } from "./theme-form";
import { ThemeLivePreview } from "./theme-live-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export function ThemeManagerView() {
  const { user } = useAuth();
  const { tokens: globalTokens, setTokens: setGlobalTokens } = useTheme();
  const draft = useThemeEditorStore((s) => s.draft);
  const isDirty = useThemeEditorStore((s) => s.isDirty);
  const markSaved = useThemeEditorStore((s) => s.markSaved);
  const resetDraft = useThemeEditorStore((s) => s.resetDraft);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Derive tenantId safely
  const tenantId = user?.tenantId || "default-tenant";

  // Active preview tokens combines global runtime tokens with latest draft
  const previewTokens: Partial<ThemeTokens> = React.useMemo(() => {
    return {
      ...globalTokens,
      ...draft,
    };
  }, [globalTokens, draft]);

  // Handle Save
  const handleSave = async (values: ThemeFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await updateTenantTheme(tenantId, values);
      if ("error" in response && response.error) {
        toast.error("خطا در اعتبارسنجی یا ذخیره‌سازی داده‌های قالب.", {
          description: response.issues?.[0]?.message || response.error,
        });
        return;
      }

      // Update global runtime theme
      setGlobalTokens(values);
      // Mark store state as saved
      markSaved();

      toast.success("قالب و هویت بصری کارخانه با موفقیت ذخیره شد.", {
        description: "تمام المان‌های پرتال و فروشگاه با رنگ‌ها و هندسه جدید همگام شدند.",
      });
    } catch (err) {
      toast.error("خطای سیستمی هنگام ذخیره قالب کارخانه", {
        description:
          err instanceof Error ? err.message : "لطفاً اتصال اینترنت خود را بررسی نمایید.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Reset to Defaults
  const handleReset = () => {
    // Revert draft in Zustand store
    resetDraft();
    // Revert global runtime tokens in ThemeProvider
    setGlobalTokens(defaultTokens);

    toast.info("تنظیمات قالب به مقادیر پیش‌فرض استاندارد بازگردانده شد.", {
      description: "مقادیر پالت رنگی و استایل‌های پایه‌ای مجدداً بازنشانی شدند.",
    });
  };

  return (
    <div className="space-y-8 pb-16" dir="rtl">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              قالب و هویت بصری کارخانه
            </h1>
            {isDirty ? (
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-xs gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                <span>پیش‌نویس ذخیره‌نشده</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>همگام و فعال</span>
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            شخصی‌سازی پالت رنگی برند، استایل‌های پایه رابط کاربری، تایپوگرافی و شعاع انحنای گوشه‌ها به صورت همزمان با پیش‌نمایش زنده.
          </p>
        </div>

        {/* Header Secondary Action: Quick Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isSubmitting}
            className="text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>بازنشانی به پیش‌فرض</span>
          </Button>
        </div>
      </div>

      {/* Main Split-Screen / Responsive Two-Column Layout */}
      {/* In RTL: Form on Right (col-span-7), Live Preview on Left (col-span-5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (Right in RTL) */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <ThemeForm
            key={JSON.stringify(globalTokens)}
            initialValues={globalTokens}
            onSubmit={handleSave}
            onReset={handleReset}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Live Preview Column (Left in RTL, Sticky on Desktop) */}
        <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-6 space-y-4">
          <ThemeLivePreview tokens={previewTokens} />
        </div>
      </div>
    </div>
  );
}
