"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SlidersHorizontal,
  Plus,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { useSeoStore } from "../../stores/seo-store";
import type { RobotsDirective, SchemaType, ChangeFrequency } from "../../types";

export function PageSeoEditDialog() {
  const editingPage = useSeoStore((state) => state.editingPage);
  const closeEditDialog = useSeoStore((state) => state.closeEditDialog);
  const updateEditingDraft = useSeoStore((state) => state.updateEditingDraft);
  const saveEditingPage = useSeoStore((state) => state.saveEditingPage);

  const [newKeyword, setNewKeyword] = useState("");

  if (!editingPage) return null;

  const titleLength = (editingPage.title || "").length;
  const descLength = (editingPage.metaDescription || "").length;

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    const parts = newKeyword
      .split(/[,،]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    const currentKeywords = editingPage.keywords || [];
    const newItems = parts.filter((k) => !currentKeywords.includes(k));
    if (newItems.length > 0) {
      updateEditingDraft({
        keywords: [...currentKeywords, ...newItems],
      });
    }
    setNewKeyword("");
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    updateEditingDraft({
      keywords: (editingPage.keywords || []).filter((k) => k !== keywordToRemove),
    });
  };

  return (
    <Dialog open={!!editingPage} onOpenChange={(open) => !open && closeEditDialog()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold">
                ویرایش سئو و متادیتای «{editingPage.pageName}»
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                مسیر: <span className="font-mono" dir="ltr">{editingPage.slug}</span> | دسته‌بندی: {editingPage.categoryLabel}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className={`text-xs ${
                  editingPage.healthScore >= 90
                    ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
                    : editingPage.healthScore >= 75
                    ? "text-amber-600 bg-amber-500/10 border-amber-500/30"
                    : "text-rose-600 bg-rose-500/10 border-rose-500/30"
                }`}
              >
                نمره سئو: ٪{editingPage.healthScore}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Health Issues Box if any */}
          {editingPage.healthIssues && editingPage.healthIssues.length > 0 && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-1 text-xs text-amber-700 dark:text-amber-300">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>هشدارهای بهبود سئو برای این صفحه:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pr-2">
                {editingPage.healthIssues.map((issue) => (
                  <li key={issue.id}>{issue.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 1. Meta Title */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <Label htmlFor="seo-title" className="font-medium text-foreground">
                عنوان متا در موتورهای جستجو (Meta Title Tag)
              </Label>
              <span
                className={`text-[11px] font-mono ${
                  titleLength >= 45 && titleLength <= 65
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : titleLength < 45
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-rose-600 dark:text-rose-400 font-bold"
                }`}
              >
                {titleLength} / ۶۰ کاراکتر
              </span>
            </div>
            <Input
              id="seo-title"
              value={editingPage.title}
              onChange={(e) => updateEditingDraft({ title: e.target.value })}
              placeholder="مثال: سنگ تراورتن عباس آباد سوپر | قیمت اسلب و تایل نما"
              className="text-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              توصیه گوگل: ۵۰ تا ۶۰ کاراکتر. شامل نام دقیق سنگ، نوع فرآوری و نام کارخانه باشد.
            </p>
          </div>

          {/* 2. Meta Description */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <Label htmlFor="seo-desc" className="font-medium text-foreground">
                توضیحات متا در نتایج جستجو (Meta Description)
              </Label>
              <span
                className={`text-[11px] font-mono ${
                  descLength >= 110 && descLength <= 165
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : descLength < 110
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-rose-600 dark:text-rose-400 font-bold"
                }`}
              >
                {descLength} / ۱۶۰ کاراکتر
              </span>
            </div>
            <Textarea
              id="seo-desc"
              rows={3}
              value={editingPage.metaDescription}
              onChange={(e) => updateEditingDraft({ metaDescription: e.target.value })}
              placeholder="توضیحاتی خلاصه و جذاب برای ترغیب خریداران و مهندسان به کلیک روی لینک کارخانه در گوگل..."
              className="text-sm leading-relaxed"
            />
            <p className="text-[11px] text-muted-foreground">
              توصیه گوگل: ۱۲۰ تا ۱۶۰ کاراکتر. شامل ویژگی‌های برجسته سنگ (ساب آینه‌ای، ضد لک، قیمت رقابتی) و دعوت به اقدام.
            </p>
          </div>

          {/* 3. Canonical URL & Robots Directive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="seo-canonical" className="text-xs font-medium">
                پیوند یکتا (Canonical URL)
              </Label>
              <Input
                id="seo-canonical"
                dir="ltr"
                value={editingPage.canonicalUrl}
                onChange={(e) => updateEditingDraft({ canonicalUrl: e.target.value })}
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                دستور ایندکس ربات‌ها (Robots Directive)
              </Label>
              <Select
                value={editingPage.robotsDirective}
                onValueChange={(val) =>
                  updateEditingDraft({
                    robotsDirective: val as RobotsDirective,
                    isIndexed: val.startsWith("index"),
                  })
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="index, follow">index, follow (مجاز برای نمایش و فالو لینک‌ها)</SelectItem>
                  <SelectItem value="noindex, follow">noindex, follow (عدم نمایش در سرچ اما فالو لینک‌ها)</SelectItem>
                  <SelectItem value="noindex, nofollow">noindex, nofollow (کاملاً محرمانه و مسدود)</SelectItem>
                  <SelectItem value="index, nofollow">index, nofollow (نمایش در سرچ بدون انتقال اعتبار)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4. Target Keywords Tags */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              کلمات کلیدی هدف این صفحه (Keywords Focus)
            </Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder="کلمه کلیدی جدید را وارد کرده و اینتر بزنید..."
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 text-xs gap-1"
                onClick={handleAddKeyword}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>افزودن برچسب</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {(editingPage.keywords || []).map((kw, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs flex items-center gap-1 bg-muted hover:bg-muted/80"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-destructive transition-colors ml-0.5"
                    aria-label={`حذف ${kw}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* 5. Schema Type, Priority & Change Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-border/50">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">نوع اسکیما Schema.org</Label>
              <Select
                value={editingPage.schemaType}
                onValueChange={(val) =>
                  updateEditingDraft({ schemaType: val as SchemaType })
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product">Product (محصول سنگ / اسلب)</SelectItem>
                  <SelectItem value="CollectionPage">CollectionPage (کاتالوگ / مجموعه‌ها)</SelectItem>
                  <SelectItem value="ItemPage">ItemPage (جزئیات کالا / نمونه کار)</SelectItem>
                  <SelectItem value="Organization">Organization (شرکت / کارخانه)</SelectItem>
                  <SelectItem value="LocalBusiness">LocalBusiness (کسب‌وکار محلی و شوروم)</SelectItem>
                  <SelectItem value="AboutPage">AboutPage (درباره کارخانه)</SelectItem>
                  <SelectItem value="ContactPage">ContactPage (تماس و موقعیت)</SelectItem>
                  <SelectItem value="WebPage">WebPage (صفحه عمومی)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">اولویت در نقشه سایت (Priority)</Label>
              <Select
                value={String(editingPage.priority)}
                onValueChange={(val) =>
                  updateEditingDraft({ priority: parseFloat(val) })
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1.0 (صفحه اصلی)</SelectItem>
                  <SelectItem value="0.95">0.95 (کاتالوگ اصلی)</SelectItem>
                  <SelectItem value="0.9">0.90 (اسلب‌های پرفروش)</SelectItem>
                  <SelectItem value="0.85">0.85 (محصولات سنگ شاخص)</SelectItem>
                  <SelectItem value="0.8">0.80 (کلکسیون‌ها و استعلام)</SelectItem>
                  <SelectItem value="0.75">0.75 (شوروم و تماس مرکزی)</SelectItem>
                  <SelectItem value="0.7">0.70 (درباره و تماس)</SelectItem>
                  <SelectItem value="0.6">0.60 (صفحات میانی)</SelectItem>
                  <SelectItem value="0.5">0.50 (صفحات فرعی)</SelectItem>
                  <SelectItem value="0.1">0.10 (صفحات سیستمی)</SelectItem>
                  {![1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.6, 0.5, 0.1].includes(editingPage.priority) && (
                    <SelectItem value={String(editingPage.priority)}>
                      {editingPage.priority.toFixed(2)} (سفارشی)
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">تواتر تغییرات (Changefreq)</Label>
              <Select
                value={editingPage.changeFreq}
                onValueChange={(val) =>
                  updateEditingDraft({ changeFreq: val as ChangeFrequency })
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">daily (روزانه)</SelectItem>
                  <SelectItem value="weekly">weekly (هفتگی)</SelectItem>
                  <SelectItem value="monthly">monthly (ماهانه)</SelectItem>
                  <SelectItem value="yearly">yearly (سالانه)</SelectItem>
                  <SelectItem value="never">never (بدون تغییر)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 6. OpenGraph Image */}
          <div className="space-y-1.5 pt-1">
            <Label htmlFor="og-image" className="text-xs font-medium">
              آدرس تصویر اشتراک‌گذاری در شبکه‌ها (OpenGraph Image URL)
            </Label>
            <Input
              id="og-image"
              dir="ltr"
              value={editingPage.openGraph?.imageUrl || ""}
              onChange={(e) =>
                updateEditingDraft({
                  openGraph: {
                    ...editingPage.openGraph,
                    imageUrl: e.target.value,
                    type: editingPage.openGraph?.type || "website",
                  },
                })
              }
              placeholder="https://images.unsplash.com/..."
              className="text-xs font-mono"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4 border-t border-border/60 pt-3">
          <Button variant="outline" size="sm" onClick={closeEditDialog}>
            انصراف
          </Button>
          <Button variant="default" size="sm" onClick={saveEditingPage} className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>ذخیره تغییرات متادیتا</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
