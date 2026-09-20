"use client";

import { useState } from "react";
import {
  Globe,
  Share2,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Info,
  ExternalLink,
  Sliders,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSeoStore } from "../../stores/seo-store";

export function GlobalSettingsTab() {
  const globalSettings = useSeoStore((state) => state.globalSettings);
  const updateGlobalSettings = useSeoStore((state) => state.updateGlobalSettings);

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. Brand & General Meta Settings */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                هویت عمومی و متادیتای پیش‌فرض کارخانه در نتایج جستجو
              </CardTitle>
              <CardDescription className="text-xs">
                تنظیم عنوان اصلی، قالب پسوند نام کارخانه و توضیحات متای عمومی برای کاتالوگ و فروشگاه سنگ
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="site-title" className="text-xs font-medium">
                عنوان اصلی وب‌سایت (Site Title)
              </Label>
              <Input
                id="site-title"
                value={globalSettings.siteTitle}
                onChange={(e) => updateGlobalSettings({ siteTitle: e.target.value })}
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title-template" className="text-xs font-medium">
                الگوی ساخت عنوان صفحات (Title Template)
              </Label>
              <Input
                id="title-template"
                dir="ltr"
                value={globalSettings.titleTemplate}
                onChange={(e) => updateGlobalSettings({ titleTemplate: e.target.value })}
                className="text-sm font-mono text-right"
              />
              <p className="text-[11px] text-muted-foreground">
                متغیر <span className="font-mono text-primary">%s</span> با نام اختصاصی هر سنگ یا صفحه جایگزین می‌شود.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="global-desc" className="text-xs font-medium">
              توضیحات متای عمومی و پیش‌فرض (Default Meta Description)
            </Label>
            <Textarea
              id="global-desc"
              rows={3}
              value={globalSettings.defaultMetaDescription}
              onChange={(e) =>
                updateGlobalSettings({ defaultMetaDescription: e.target.value })
              }
              className="text-sm leading-relaxed"
            />
            <div className="flex justify-between items-center text-[11px] text-muted-foreground">
              <span>توضیحاتی که در صورت خالی بودن متادیتای اختصاصی صفحات به عنوان جایگزین لود می‌شود.</span>
              <span className="font-mono">{globalSettings.defaultMetaDescription.length} کاراکتر</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
            <div className="space-y-1.5">
              <Label htmlFor="canonical-base" className="text-xs font-medium">
                آدرس دامنه‌ی رسمی و کانونیکال (Canonical Base URL)
              </Label>
              <Input
                id="canonical-base"
                dir="ltr"
                value={globalSettings.canonicalBaseUrl}
                onChange={(e) => updateGlobalSettings({ canonicalBaseUrl: e.target.value })}
                className="text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="site-name" className="text-xs font-medium">
                نام رسمی برند کارخانه (Brand / Organization Name)
              </Label>
              <Input
                id="site-name"
                value={globalSettings.siteName}
                onChange={(e) => updateGlobalSettings({ siteName: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. OpenGraph & Social Sharing Defaults */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                تنظیمات اشتراک‌گذاری اجتماعی (OpenGraph & Twitter Cards)
              </CardTitle>
              <CardDescription className="text-xs">
                کارت‌های پیش‌نمایش گرافیکی هنگام ارسال لینک کاتالوگ سنگ در تلگرام، واتس‌اپ، لینکدین و ایتا
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="og-default-image" className="text-xs font-medium">
                آدرس تصویر پیش‌فرض اشتراک‌گذاری (OG Image URL)
              </Label>
              <Input
                id="og-default-image"
                dir="ltr"
                value={globalSettings.ogDefaultImage}
                onChange={(e) => updateGlobalSettings({ ogDefaultImage: e.target.value })}
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                ابعاد پیشنهادی گوگل و متا: ۱۲۰۰ در ۶۳۰ پیکسل با حجم کمتر از ۳۰۰ کیلوبایت.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">نوع کارت شبکه اجتماعی</Label>
              <Select
                value={globalSettings.twitterCardType}
                onValueChange={(val) =>
                  updateGlobalSettings({ twitterCardType: val as any })
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary_large_image">تصویر بزرگ عریض (Large Image)</SelectItem>
                  <SelectItem value="summary">تصویر کوچک مربعی (Summary)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image preview thumbnail */}
          {globalSettings.ogDefaultImage && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3 flex items-center gap-4">
              <div className="h-16 w-28 overflow-hidden rounded-md border border-border bg-muted shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={globalSettings.ogDefaultImage}
                  alt="پیش‌نمایش تصویر پیش‌فرض شبکه اجتماعی"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-xs space-y-1">
                <span className="font-semibold text-foreground">پیش‌نمایش تصویر کارت اجتماعی کارخانه البرز</span>
                <p className="text-muted-foreground text-[11px]">
                  این تصویر در تمام صفحات بدون تصویر اختصاصی (نظیر صفحات لیست، درباره ما، تماس) به عنوان بنر کارت اشتراک استفاده می‌شود.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Search Engine Verification & Webmasters */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                تأیید مالکیت وبگاه در وبمسترها (Google Search Console & Bing)
              </CardTitle>
              <CardDescription className="text-xs">
                کدهای اعتبارسنجی مالکیت متادیتا جهت اتصال مستقیم به سرچ کنسول گوگل و بینگ وبمستر
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="google-verify" className="text-xs font-medium flex items-center justify-between">
                <span>کد تأیید Google Search Console</span>
                <span className="text-[10px] text-muted-foreground font-mono">google-site-verification</span>
              </Label>
              <Input
                id="google-verify"
                dir="ltr"
                value={globalSettings.googleVerificationCode}
                onChange={(e) =>
                  updateGlobalSettings({ googleVerificationCode: e.target.value })
                }
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bing-verify" className="text-xs font-medium flex items-center justify-between">
                <span>کد تأیید Bing Webmaster</span>
                <span className="text-[10px] text-muted-foreground font-mono">msvalidate.01</span>
              </Label>
              <Input
                id="bing-verify"
                dir="ltr"
                value={globalSettings.bingVerificationCode}
                onChange={(e) =>
                  updateGlobalSettings({ bingVerificationCode: e.target.value })
                }
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/40">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>
              این تگ‌ها به صورت خودکار در بخش <code className="font-mono bg-muted px-1 py-0.5 rounded">&lt;head&gt;</code> وب‌سایت تزریق می‌شوند و نیاز به ویرایش دستی فایل‌های HTML سرور نیست.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Global Crawling & Indexing Master Controls */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                کنترل‌های کراول سراسری و امنیت جستجو
              </CardTitle>
              <CardDescription className="text-xs">
                مدیریت کلیدهای عمومی دسترسی ربات‌های جستجوگر و ساختار نقشه سایت
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div>
              <h5 className="text-sm font-semibold text-foreground">
                فعال‌بودن ایندکس سراسری موتورهای جستجو
              </h5>
              <p className="text-xs text-muted-foreground mt-0.5">
                در صورت غیرفعال کردن، تگ noindex به کل صفحات کارخانه اعمال شده و سایت در نتایج جستجو مخفی خواهد شد.
              </p>
            </div>
            <Switch
              checked={globalSettings.indexingEnabled}
              onCheckedChange={(checked) =>
                updateGlobalSettings({ indexingEnabled: checked })
              }
              aria-label="تغییر ایندکس سراسری"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <h5 className="text-sm font-semibold text-foreground">
                تولید و انتشار خودکار نقشه سایت XML (Auto-Generate Sitemap)
              </h5>
              <p className="text-xs text-muted-foreground mt-0.5">
                با انتشار یا ویرایش هر سنگ جدید در کاتالوگ، فایل نقشه سایت فوراً بروز می‌شود.
              </p>
            </div>
            <Switch
              checked={globalSettings.autoGenerateSitemap}
              onCheckedChange={(checked) =>
                updateGlobalSettings({ autoGenerateSitemap: checked })
              }
              aria-label="تغییر ساخت خودکار نقشه سایت"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
