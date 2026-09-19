"use client";

import { useState, useMemo } from "react";
import {
  Sparkles,
  ShieldAlert,
  Check,
  Info,
  Layers,
  Flame,
  Sun,
  HandMetal,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  STONE_FINISHES,
  type StoneFinish,
  type StoneApplication,
} from "@/constants";
import { STONE_FINISH_LABELS } from "../../constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FinishMetadata {
  id: StoneFinish;
  title: string;
  titleEn: string;
  description: string;
  glossLevel: string;
  slipRating: string;
  tactileFeel: string;
  textureGradient: string;
  recommendedFor: string[];
  cautionFor: string[];
}

export const FINISH_DETAILS: Record<StoneFinish, FinishMetadata> = {
  polished: {
    id: "polished",
    title: "ساب صیقلی و براق",
    titleEn: "Polished",
    description: "فرآوری آینه‌ای با رزین اپوکسی و لقمه‌های اسیدی جهت حداکثر بازتاب نور و درخشش رگه‌ها.",
    glossLevel: "۹۵٪ (فوق براق)",
    slipRating: "R9 (لغزنده در رطوبت)",
    tactileFeel: "کاملاً صاف و صیقلی شیشه‌ای",
    textureGradient: "from-amber-100 via-stone-50 to-amber-200/60 dark:from-stone-800 dark:via-stone-700 dark:to-stone-900 border-amber-400/40",
    recommendedFor: ["لابی و پذیرایی", "دیوار TV Wall", "کانترتاپ لوکس", "فضاهای سرپوشیده"],
    cautionFor: ["کف حمام و سرویس", "رمپ پارکینگ", "محوطه استخر و حیاط"],
  },
  honed: {
    id: "honed",
    title: "مات مخملی (هوند)",
    titleEn: "Honed",
    description: "سطحی صاف و یکنواخت با ساب نرم بدون انعکاس شدید نور، مناسب فضاهای مدرن و مینیمال.",
    glossLevel: "۲۰٪ (مات ساتنی)",
    slipRating: "R10 (استاندارد تردد)",
    tactileFeel: "مخملی، ابریشمی و نرم",
    textureGradient: "from-stone-200 via-stone-100 to-stone-200 dark:from-stone-800 dark:via-stone-800 dark:to-stone-700",
    recommendedFor: ["کف‌سازی عمومی", "فضاهای اداری", "پله داخلی", "سرویس‌های بهداشتی مدرن"],
    cautionFor: ["مکان‌های نیازمند بازتاب نوری بالا"],
  },
  leathered: {
    id: "leathered",
    title: "فرآوری چرمی (لدر)",
    titleEn: "Leathered",
    description: "ایجاد بافت برجسته موج‌دار با فرچه‌های الماسه که رگه‌های نرم را تخلیه کرده و جلوه ۳ بعدی می‌دهد.",
    glossLevel: "۳۰٪ (نیمه‌مات عمیق)",
    slipRating: "R11 (ضدلغزش مناسب)",
    tactileFeel: "موج‌دار، رگه‌دار و شبیه چرم طبیعی",
    textureGradient: "from-amber-950/20 via-stone-300/40 to-stone-400/30 dark:from-amber-950/40 dark:via-stone-800 dark:to-stone-900",
    recommendedFor: ["صفحه کابینت و بین‌کابینتی", "دیوارهای دکوراتیو", "فضاهای لوکس بدون لک انگشت"],
    cautionFor: ["بندکشی‌های بسیار باریک تایل"],
  },
  sandblasted: {
    id: "sandblasted",
    title: "سندبلاست (شن‌پاشی)",
    titleEn: "Sandblasted",
    description: "پرتاب پرفشار ذرات سیلیس به سطح سنگ جهت ایجاد ریزدانه‌های زبر مات و ضدلغزش.",
    glossLevel: "۵٪ (مات کامل)",
    slipRating: "R11 (ایمن در باران)",
    tactileFeel: "زبر یکدست ریزدانه",
    textureGradient: "from-stone-300/60 via-stone-200 to-stone-300/80 dark:from-stone-700 dark:via-stone-800 dark:to-stone-700",
    recommendedFor: ["محوطه‌سازی و حیاط", "پله‌های روباز", "رمپ خودرو", "کف‌سازی پیاده‌رو"],
    cautionFor: ["کانتر آشپزخانه (به دلیل نفوذ چربی)"],
  },
  flamed: {
    id: "flamed",
    title: "شعله‌ور (فلیمینگ)",
    titleEn: "Flamed",
    description: "شوک حرارتی با مشعل دمای بالا روی گرانیت که کریستال‌های کوارتز را شکسته و سطحی زبر ایجاد می‌کند.",
    glossLevel: "۰٪ (کاملاً مات)",
    slipRating: "R12 (فوق ایمن ضدلغزش)",
    tactileFeel: "زبر و برجسته کوهستانی",
    textureGradient: "from-zinc-400/40 via-stone-300 to-zinc-500/30 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-900",
    recommendedFor: ["سنگفرش خیابانی و پارک", "محوطه استخر روباز", "نمای خارجی اقلیم سرد"],
    cautionFor: ["فضاهای داخلی با پای برهنه"],
  },
  brushed: {
    id: "brushed",
    title: "برس‌خورده (براش)",
    titleEn: "Brushed",
    description: "سایش سطح با برس‌های سیمی جهت نرم کردن خطوط اره و کهنه‌نمایی بافت طبیعی سنگ.",
    glossLevel: "۲۵٪ (درخشش طبیعی)",
    slipRating: "R10 (پایداری مطلوب)",
    tactileFeel: "بافت‌دار اما لطیف بدون تیزی",
    textureGradient: "from-stone-200/70 via-stone-100 to-stone-300/50 dark:from-stone-800 dark:via-stone-700 dark:to-stone-800",
    recommendedFor: ["کف نشیمن و بالکن", "نمای ویلایی", "دیوارهای شومینه"],
    cautionFor: ["سطوح نیازمند شستشوی صنعتی"],
  },
  tumbled: {
    id: "tumbled",
    title: "تامبل (کهنه‌کاری / آنتیک)",
    titleEn: "Tumbled",
    description: "چرخش سنگ‌ها در دستگاه تامبلر همراه ماسه و آب جهت گرد شدن لبه‌ها و ایجاد حس سنگ‌های روم باستان.",
    glossLevel: "۱۰٪ (طبیعی باستانی)",
    slipRating: "R11 (ضدلغزش)",
    tactileFeel: "لبه‌های فرسوده نرم با حفرات طبیعی",
    textureGradient: "from-amber-200/30 via-stone-200 to-amber-300/20 dark:from-amber-950/30 dark:via-stone-800 dark:to-stone-900",
    recommendedFor: ["طراحی روستیک و سنتی", "کف باغ و حیاط خلوت", "بین‌کابینتی کلاسیک"],
    cautionFor: ["پروژه‌های مدرن لبه‌تیز گونیا"],
  },
  split: {
    id: "split",
    title: "گیوتین و بادبر (اسپلیت)",
    titleEn: "Split Face",
    description: "شکستن مکانیکی سنگ با تیغه گیوتین برای داشتن رخ طبیعی و لایه‌ای سنگ کوهستان.",
    glossLevel: "۰٪ (رخ طبیعی صخره)",
    slipRating: "عدم کاربرد در کف",
    tactileFeel: "ناهموار و صخره‌ای برجسته",
    textureGradient: "from-stone-400/40 via-stone-300 to-stone-500/30 dark:from-stone-700 dark:via-stone-600 dark:to-stone-800",
    recommendedFor: ["نمای اصلی ساختمان", "دیوار دکوراتیو باغ و لابی", "ستون‌های سنگی"],
    cautionFor: ["کف‌سازی و فضاهای ترددی"],
  },
  natural: {
    id: "natural",
    title: "طبیعی / شیاردار خطی",
    titleEn: "Natural / Grooved",
    description: "حفظ رگه‌های طبیعی یا ایجاد شیارهای موازی با تیغه دیسک جهت زیبایی بصری و کنترل جریان آب.",
    glossLevel: "۱۵٪ (بافت خام طبیعی)",
    slipRating: "R11 (جهت‌دار)",
    tactileFeel: "شیاردار یا لایه‌ای متراکم",
    textureGradient: "from-stone-200 via-stone-100 to-stone-300 dark:from-stone-800 dark:via-stone-700 dark:to-stone-800",
    recommendedFor: ["پله‌های ورودی شیاردار", "آب‌نما و محوطه", "دیوارهای پیرامونی"],
    cautionFor: ["کانتر و میز غذاخوری"],
  },
  satin: {
    id: "satin",
    title: "ساتن ابریشمی",
    titleEn: "Satin",
    description: "ترکیب ساب مات و فرچه ملایم برای رسیدن به حسی فوق‌العاده نرم با حداقل بازتاب آزاردهنده نور.",
    glossLevel: "۴۰٪ (درخشش ابریشمی)",
    slipRating: "R10 (استاندارد لوکس)",
    tactileFeel: "بسیار نرم و مخملی لطیف",
    textureGradient: "from-amber-100/40 via-stone-100 to-stone-200/60 dark:from-stone-800 dark:via-stone-700 dark:to-stone-900",
    recommendedFor: ["روشویی و مستر روم", "لابی‌های مدرن", "فضاهای اقامتی هتل"],
    cautionFor: ["پارکینگ و فضاهای تردد سنگین"],
  },
};

interface StoneFinishPickerProps {
  value: StoneFinish;
  onChange: (finish: StoneFinish) => void;
  availableFinishes?: StoneFinish[];
  onAvailableFinishesChange?: (finishes: StoneFinish[]) => void;
  selectedApplications?: StoneApplication[];
  className?: string;
}

export function StoneFinishPicker({
  value,
  onChange,
  availableFinishes = [],
  onAvailableFinishesChange,
  selectedApplications = [],
  className = "",
}: StoneFinishPickerProps) {
  const currentDetails = FINISH_DETAILS[value] || FINISH_DETAILS.polished;

  // Check architectural conflicts with chosen applications
  const activeConflicts = useMemo(() => {
    const conflicts: { app: StoneApplication; reason: string }[] = [];

    if (value === "polished") {
      if (selectedApplications.includes("bathroom")) {
        conflicts.push({
          app: "bathroom",
          reason: "ساب صیقلی در مجاورت آب حمام و سرویس خطر سر خوردن بالایی دارد. استفاده از فینیشینگ چرمی یا بوش‌همر توصیه می‌گردد.",
        });
      }
      if (selectedApplications.includes("outdoor") || selectedApplications.includes("landscaping")) {
        conflicts.push({
          app: "outdoor",
          reason: "ساب براق در محوطه باز به مرور بر اثر باران اسیدی و تابش مستقیم کدر می‌شود و در یخ‌بندان لغزنده است.",
        });
      }
    }

    if (value === "split" && selectedApplications.includes("flooring")) {
      conflicts.push({
        app: "flooring",
        reason: "فرآوری گیوتین و صخره‌ای به دلیل ناهمواری شدید به هیچ وجه برای کف‌سازی مناسب نیست.",
      });
    }

    return conflicts;
  }, [value, selectedApplications]);

  const toggleAvailableFinish = (finishId: StoneFinish) => {
    if (!onAvailableFinishesChange) return;
    if (availableFinishes.includes(finishId)) {
      onAvailableFinishesChange(availableFinishes.filter((f) => f !== finishId));
    } else {
      onAvailableFinishesChange([...availableFinishes, finishId]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`} dir="rtl">
      {/* Header & Concept */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-primary" />
            <span>استودیو فینیشینگ و بافت سطح سنگ</span>
          </Label>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            نوع پرداخت سطحی مستقیماً بر میزان بازتاب نور، لغزندگی، زیبایی لمسی و قیمت سنگ تأثیرگذار است.
          </p>
        </div>

        <Badge variant="outline" className="text-[10px] self-start sm:self-auto gap-1 py-1 px-2 border-primary/30">
          <Sparkles className="h-3 w-3 text-primary" />
          <span>فینیشینگ فعال: {currentDetails.title}</span>
        </Badge>
      </div>

      {/* Finishing Cards Visual Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {STONE_FINISHES.map((fin) => {
          const details = FINISH_DETAILS[fin];
          const isSelected = value === fin;
          const isAvailable = availableFinishes.includes(fin);

          return (
            <div
              key={fin}
              onClick={() => onChange(fin)}
              className={`group relative rounded-xl border p-2.5 text-start cursor-pointer transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? "border-primary ring-2 ring-primary/20 bg-primary/[0.04] shadow-sm scale-[1.01]"
                  : "border-border/70 hover:border-primary/50 hover:bg-secondary/40 bg-card"
              }`}
            >
              {/* Texture Swatch Simulation */}
              <div
                className={`w-full h-12 rounded-lg mb-2.5 border bg-gradient-to-br relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] flex items-center justify-center ${details.textureGradient}`}
              >
                {/* Shine / Texture details */}
                {fin === "polished" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                )}
                {fin === "flamed" && (
                  <Flame className="h-4 w-4 text-amber-600/50" />
                )}
                {fin === "leathered" && (
                  <HandMetal className="h-4 w-4 text-stone-600/40" />
                )}

                {isSelected && (
                  <div className="absolute top-1 end-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-xs">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>

              {/* Title & En Name */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {details.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                  {details.titleEn}
                </span>

                {/* Micro Metric Badges */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[9px] bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded">
                    {details.glossLevel.split(" ")[0]}
                  </span>
                  <span className="text-[9px] bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded font-mono">
                    {details.slipRating.split(" ")[0]}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Finish Architectural Deep-Dive Card */}
      <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-card to-primary/[0.04] p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <span>مشخصات فنی و استانداردهای فرآوری «{currentDetails.title}»</span>
                <span className="text-[10px] font-mono text-muted-foreground font-normal">
                  ({currentDetails.titleEn})
                </span>
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {currentDetails.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-end text-[10px]">
              <span className="text-muted-foreground block">ضریب لغزندگی:</span>
              <span className="font-semibold text-foreground font-mono">{currentDetails.slipRating}</span>
            </div>
            <div className="h-6 w-px bg-border/80" />
            <div className="text-end text-[10px]">
              <span className="text-muted-foreground block">حس لمسی:</span>
              <span className="font-semibold text-foreground">{currentDetails.tactileFeel}</span>
            </div>
          </div>
        </div>

        {/* Recommended & Caution Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>کاربردهای ایده‌آل و توصیه شده:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentDetails.recommendedFor.map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>ملاحظات فنی و نقاط احتیاط:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentDetails.cautionFor.map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-700 dark:text-amber-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Conflict Alert (if any) */}
        {activeConflicts.length > 0 && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2 mt-2">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="space-y-1 text-[11px]">
              <span className="font-bold block">ملاحظه معماری و ایمنی:</span>
              {activeConflicts.map((c, i) => (
                <p key={i}>• {c.reason}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Multi-finish selection for custom orders */}
      {onAvailableFinishesChange && (
        <div className="pt-3 border-t border-border/60 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-foreground">
              سایر فینیشینگ‌های قابل سفارش در خط تولید کارخانه (آپشن‌های خریدار)
            </Label>
            <span className="text-[10px] text-muted-foreground">
              {availableFinishes.length} فرآوری سفارشی برگزیده شده
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {STONE_FINISHES.filter((f) => f !== value).map((f) => {
              const isChecked = availableFinishes.includes(f);
              return (
                <button
                  type="button"
                  key={f}
                  onClick={() => toggleAvailableFinish(f)}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                    isChecked
                      ? "bg-secondary text-foreground border-primary font-medium shadow-2xs"
                      : "bg-card text-muted-foreground border-border/70 hover:bg-secondary/60"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${isChecked ? "bg-primary" : "bg-border"}`} />
                  <span>{STONE_FINISH_LABELS[f]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
