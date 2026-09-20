"use client";

import { useState, useEffect } from "react";
import {
  FileCode,
  Globe,
  RefreshCw,
  Copy,
  Check,
  Download,
  Shield,
  ExternalLink,
  Code2,
  Table as TableIcon,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useSeoStore } from "../../stores/seo-store";

const PRESET_ROBOTS = {
  standard: `# Robots.txt - صنایع سنگ البرز (استاندارد کارخانه)
User-agent: *
Allow: /
Allow: /stones/
Allow: /collections/
Allow: /about/
Allow: /contact/
Allow: /projects/
Disallow: /dashboard/
Disallow: /account/
Disallow: /checkout/
Disallow: /api/
Disallow: /superAdmin/

# Sitemap directive
Sitemap: https://alborzstone.ir/sitemap.xml
`,
  disallowAll: `# Robots.txt - محیط آزمایشی و تست داخلی (مسدودسازی کامل)
User-agent: *
Disallow: /
`,
  allowAll: `# Robots.txt - دسترسی آزاد کلیه بخش‌های عمومی
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /superAdmin/

Sitemap: https://alborzstone.ir/sitemap.xml
`,
};

export function SitemapRobotsTab() {
  const pages = useSeoStore((state) => state.pages);
  const globalSettings = useSeoStore((state) => state.globalSettings);
  const updateRobotsTxt = useSeoStore((state) => state.updateRobotsTxt);
  const saveAllChanges = useSeoStore((state) => state.saveAllChanges);
  const regenerateSitemap = useSeoStore((state) => state.regenerateSitemap);
  const getSitemapXml = useSeoStore((state) => state.getSitemapXml);

  const [robotsDraft, setRobotsDraft] = useState(globalSettings.robotsTxtContent);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);
  const [activeSitemapView, setActiveSitemapView] = useState<"table" | "xml">("table");

  useEffect(() => {
    setRobotsDraft(globalSettings.robotsTxtContent);
  }, [globalSettings.robotsTxtContent]);

  const sitemapXml = getSitemapXml();
  const indexedPages = pages.filter((p) => p.isIndexed);
  const sitemapUrl = `${globalSettings.canonicalBaseUrl.replace(/\/+$/, "")}/sitemap.xml`;

  const handleSaveRobots = async () => {
    updateRobotsTxt(robotsDraft);
    await saveAllChanges();
  };

  const handleApplyPreset = (presetKey: keyof typeof PRESET_ROBOTS) => {
    const content = PRESET_ROBOTS[presetKey];
    setRobotsDraft(content);
    updateRobotsTxt(content);
    toast.info("الگوی انتخابی به robots.txt اعمال شد.");
  };

  const handleCopySitemapUrl = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(sitemapUrl);
      }
      setCopiedUrl(true);
      toast.success("آدرس نقشه سایت (Sitemap URL) در حافظه کپی شد.");
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      toast.error("امکان کپی در این محیط فراهم نیست.");
    }
  };

  const handleCopyXml = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(sitemapXml);
      }
      setCopiedXml(true);
      toast.success("محتوای XML نقشه سایت کپی شد.");
      setTimeout(() => setCopiedXml(false), 2000);
    } catch {
      toast.error("امکان کپی در این محیط فراهم نیست.");
    }
  };

  const handleDownloadXml = () => {
    const blob = new Blob([sitemapXml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("فایل sitemap.xml با موفقیت دانلود شد.");
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. XML Sitemap Management */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">
                  مدیریت نقشه سایت XML (Sitemap.xml Generator)
                </CardTitle>
                <CardDescription className="text-xs">
                  ساختاردهی و ارسال خودکار فهرست آدرس‌های ایندکس‌شده به موتورهای جستجوی Google و Bing
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={handleCopySitemapUrl}
              >
                {copiedUrl ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>کپی پیوند Sitemap</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={regenerateSitemap}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>بازسازی نقشه سایت</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status info bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 border border-border/50 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">پیوند رسمی نقشه سایت:</span>
              <code className="font-mono text-primary font-semibold" dir="ltr">
                {sitemapUrl}
              </code>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[11px]">
                {indexedPages.length} صفحه ثبت‌شده
              </Badge>
              <Badge variant="secondary" className="text-[11px]">
                استاندارد Sitemaps.org 0.9
              </Badge>
            </div>
          </div>

          {/* Toggle between visual table and raw XML */}
          <Tabs
            value={activeSitemapView}
            onValueChange={(v) => setActiveSitemapView(v as any)}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-2">
              <TabsList className="h-8">
                <TabsTrigger value="table" className="text-xs gap-1.5 h-7">
                  <TableIcon className="h-3.5 w-3.5" />
                  <span>جدول آدرس‌های فعال</span>
                </TabsTrigger>
                <TabsTrigger value="xml" className="text-xs gap-1.5 h-7">
                  <Code2 className="h-3.5 w-3.5" />
                  <span>کد خام XML</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={handleCopyXml}
                >
                  {copiedXml ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span>کپی محتوای XML</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={handleDownloadXml}
                >
                  <Download className="h-3 w-3" />
                  <span>دانلود فایل</span>
                </Button>
              </div>
            </div>

            {/* Visual Table */}
            <TabsContent value="table" className="mt-0">
              <div className="overflow-x-auto rounded-lg border border-border/70 max-h-72">
                <table className="w-full text-right text-xs" dir="rtl">
                  <thead className="bg-muted/60 text-muted-foreground font-medium sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">نام صفحه</th>
                      <th className="py-2.5 px-3">آدرس کامل (URL)</th>
                      <th className="py-2.5 px-3 text-center">اولویت (Priority)</th>
                      <th className="py-2.5 px-3 text-center">دوره بروزرسانی</th>
                      <th className="py-2.5 px-3 text-center">آخرین تغییر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {indexedPages.map((page) => (
                      <tr key={page.id} className="hover:bg-muted/20">
                        <td className="py-2 px-3 font-medium text-foreground">
                          {page.pageName}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground" dir="ltr">
                          {globalSettings.canonicalBaseUrl.replace(/\/+$/, "")}{page.slug}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {page.priority.toFixed(2)}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Badge variant="secondary" className="font-mono text-[10px]">
                            {page.changeFreq}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-center text-muted-foreground text-[11px]">
                          {page.lastModified}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Raw XML */}
            <TabsContent value="xml" className="mt-0">
              <pre
                className="p-4 rounded-lg bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-72 border border-zinc-800"
                dir="ltr"
              >
                {sitemapXml}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 2. Robots.txt Editor */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">
                  ویرایشگر فایل راهنمای ربات‌ها (Robots.txt)
                </CardTitle>
                <CardDescription className="text-xs">
                  تعیین سطوح دسترسی موتورهای جستجو به بخش‌های عمومی، کاتالوگ سنگ‌ها و محافظت از بخش‌های خصوصی
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleApplyPreset("standard")}
              >
                الگوی کارخانه
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs text-rose-600"
                onClick={() => handleApplyPreset("disallowAll")}
              >
                حالت آزمایشی (Disallow All)
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={handleSaveRobots}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>ذخیره Robots.txt</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              rows={12}
              dir="ltr"
              value={robotsDraft}
              onChange={(e) => {
                setRobotsDraft(e.target.value);
                updateRobotsTxt(e.target.value);
              }}
              className="font-mono text-xs bg-zinc-950 text-zinc-100 border-zinc-800 focus-visible:ring-primary leading-relaxed resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground pt-1">
            <div className="flex items-start gap-2 bg-muted/40 p-2.5 rounded-lg border border-border/40">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>پوشش کامل صفحات کاتالوگ اسلب، سنگ‌های نما و گالری سنگ‌ها برای Googlebot</span>
            </div>
            <div className="flex items-start gap-2 bg-muted/40 p-2.5 rounded-lg border border-border/40">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>محافظت کامل از پرتال پنل مدیریت کارخانه، حساب کاربری مشتریان و درگاه پرداخت</span>
            </div>
            <div className="flex items-start gap-2 bg-muted/40 p-2.5 rounded-lg border border-border/40">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>ارجاع مستقیم و استاندارد به فایل نقشه سایت sitemap.xml در انتهای فایل</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
