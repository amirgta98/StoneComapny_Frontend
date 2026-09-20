"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Monitor,
  Smartphone,
  Share2,
  Code,
  Copy,
  Check,
  Globe,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useSeoStore } from "../../stores/seo-store";

export function SerpPreviewDialog() {
  const serpPreviewPage = useSeoStore((state) => state.serpPreviewPage);
  const closeSerpPreview = useSeoStore((state) => state.closeSerpPreview);
  const globalSettings = useSeoStore((state) => state.globalSettings);

  const [copiedJsonLd, setCopiedJsonLd] = useState(false);
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile" | "social" | "jsonld">("desktop");

  if (!serpPreviewPage) return null;

  const baseUrl = globalSettings.canonicalBaseUrl.replace(/\/+$/, "");
  const fullUrl = serpPreviewPage.canonicalUrl || `${baseUrl}${serpPreviewPage.slug}`;
  const displayTitle = serpPreviewPage.title;
  const displayDesc = serpPreviewPage.metaDescription;
  const displayOgImage = serpPreviewPage.openGraph?.imageUrl || globalSettings.ogDefaultImage;

  const titleLength = displayTitle.length;
  const descLength = displayDesc.length;

  const titleStatus =
    titleLength >= 45 && titleLength <= 65
      ? { label: "طول عالی", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30" }
      : titleLength < 45
      ? { label: "کوتاه", color: "text-amber-600 bg-amber-500/10 border-amber-500/30" }
      : { label: "بسیار طولانی (خطر کوتاه شدن)", color: "text-rose-600 bg-rose-500/10 border-rose-500/30" };

  const descStatus =
    descLength >= 110 && descLength <= 165
      ? { label: "طول عالی", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30" }
      : descLength < 110
      ? { label: "کوتاه", color: "text-amber-600 bg-amber-500/10 border-amber-500/30" }
      : { label: "طولانی (ممکن است در موبایل بریده شود)", color: "text-rose-600 bg-rose-500/10 border-rose-500/30" };

  // Generate Schema.org JSON-LD based on schemaType
  const schemaJsonLd = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": serpPreviewPage.schemaType,
      name: displayTitle,
      description: displayDesc,
      url: fullUrl,
      ...(serpPreviewPage.schemaType === "Product"
        ? {
            image: [displayOgImage],
            brand: {
              "@type": "Brand",
              name: "صنایع سنگ البرز",
            },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "IRR",
              availability: "https://schema.org/InStock",
            },
          }
        : {}),
      ...(serpPreviewPage.schemaType === "Organization" || serpPreviewPage.schemaType === "LocalBusiness"
        ? {
            name: "صنایع سنگ البرز",
            image: displayOgImage,
            telephone: "+98-31-33800000",
            address: {
              "@type": "PostalAddress",
              addressLocality: "اصفهان",
              addressRegion: "شهرک صنعتی محمودآباد",
              addressCountry: "IR",
            },
          }
        : {}),
    },
    null,
    2
  );

  const handleCopyJsonLd = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(schemaJsonLd);
      }
      setCopiedJsonLd(true);
      toast.success("کد داده‌های ساختاریافته JSON-LD در حافظه کپی شد.");
      setTimeout(() => setCopiedJsonLd(false), 2000);
    } catch {
      toast.error("امکان کپی در این محیط فراهم نیست.");
    }
  };

  return (
    <Dialog open={!!serpPreviewPage} onOpenChange={(open) => !open && closeSerpPreview()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  پیش‌نمایش زنده در گوگل و شبکه‌های اجتماعی
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  شبیه‌سازی دقیق نحوه نمایش صفحه «{serpPreviewPage.pageName}» در نتایج جستجو و پیام‌رسان‌ها
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {serpPreviewPage.categoryLabel}
            </Badge>
          </div>
        </DialogHeader>

        {/* Diagnostic meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg border border-border/50 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-muted-foreground font-medium">طول عنوان صفحه (Title Tag):</span>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${titleStatus.color}`}>
                {titleLength} کاراکتر — {titleStatus.label}
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${
                  titleLength >= 45 && titleLength <= 65
                    ? "bg-emerald-500"
                    : titleLength < 45
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(100, (titleLength / 65) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-muted-foreground font-medium">طول متای توضیحات (Description):</span>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${descStatus.color}`}>
                {descLength} کاراکتر — {descStatus.label}
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${
                  descLength >= 110 && descLength <= 165
                    ? "bg-emerald-500"
                    : descLength < 110
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(100, (descLength / 165) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Preview Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full mt-2"
        >
          <TabsList className="grid grid-cols-4 w-full h-9">
            <TabsTrigger value="desktop" className="text-xs flex items-center gap-1.5">
              <Monitor className="h-3.5 w-3.5" />
              <span>گوگل دسکتاپ</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="text-xs flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5" />
              <span>گوگل موبایل</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              <span>کارت سوشال مدیا</span>
            </TabsTrigger>
            <TabsTrigger value="jsonld" className="text-xs flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5" />
              <span>اسکیما JSON-LD</span>
            </TabsTrigger>
          </TabsList>

          {/* 1. Desktop SERP */}
          <TabsContent value="desktop" className="mt-4">
            <div className="rounded-xl border border-border bg-white dark:bg-zinc-950 p-5 shadow-xs" dir="ltr">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs">
                  A
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    صنایع سنگ البرز
                  </span>
                  <span className="text-[11px] text-zinc-500 truncate max-w-md">
                    {fullUrl}
                  </span>
                </div>
              </div>

              <div className="mt-1" dir="rtl">
                <h3 className="text-lg font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer leading-snug">
                  {displayTitle}
                </h3>
                <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  {displayDesc}
                </p>

                {serpPreviewPage.keywords && serpPreviewPage.keywords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {serpPreviewPage.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-block text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded px-2 py-0.5"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* 2. Mobile SERP */}
          <TabsContent value="mobile" className="mt-4">
            <div className="max-w-md mx-auto rounded-2xl border border-border bg-white dark:bg-zinc-950 p-4 shadow-sm" dir="rtl">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/40">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                  سنگ
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-medium text-foreground">
                    صنایع سنگ البرز
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[240px]" dir="ltr">
                    {fullUrl}
                  </span>
                </div>
              </div>

              <div className="mt-2.5">
                <h4 className="text-base font-medium text-blue-600 dark:text-blue-400 leading-snug">
                  {displayTitle}
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {displayDesc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>دسته‌بندی: {serpPreviewPage.categoryLabel}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {serpPreviewPage.isIndexed ? "ایندکس فعال" : "بدون ایندکس"}
                </span>
              </div>
            </div>
          </TabsContent>

          {/* 3. Social Media Card */}
          <TabsContent value="social" className="mt-4">
            <div className="max-w-lg mx-auto overflow-hidden rounded-xl border border-border bg-card shadow-sm" dir="rtl">
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayOgImage}
                  alt={displayTitle}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/70 text-white border-0 text-[10px]">
                    {globalSettings.siteName}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground" dir="ltr">
                  alborzstone.ir
                </span>
                <h4 className="mt-1 font-bold text-sm text-foreground leading-snug">
                  {serpPreviewPage.openGraph?.title || displayTitle}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {serpPreviewPage.openGraph?.description || displayDesc}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* 4. Schema JSON-LD */}
          <TabsContent value="jsonld" className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                اسکیمای ساختاریافته منطبق بر استانداردهای Schema.org و Google Rich Results:
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={handleCopyJsonLd}
              >
                {copiedJsonLd ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedJsonLd ? "کپی شد" : "کپی اسکریپت JSON-LD"}</span>
              </Button>
            </div>
            <pre
              className="p-3.5 rounded-lg bg-zinc-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-64 border border-zinc-800"
              dir="ltr"
            >
              {schemaJsonLd}
            </pre>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-between items-center pt-3 border-t border-border/60">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>اسکیمای اختصاصی:</span>
            <Badge variant="secondary" className="font-mono text-[10px]">
              {serpPreviewPage.schemaType}
            </Badge>
          </div>
          <Button variant="default" size="sm" onClick={closeSerpPreview}>
            بستن پیش‌نمایش
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
