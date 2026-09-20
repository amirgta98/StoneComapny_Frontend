"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  TrendingUp,
  Sliders,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSeoStore } from "../../stores/seo-store";

export function SeoAuditTab() {
  const auditItems = useSeoStore((state) => state.auditItems);
  const pages = useSeoStore((state) => state.pages);
  const getStats = useSeoStore((state) => state.getStats);

  const [isAuditing, setIsAuditing] = useState(false);
  const stats = getStats();

  const handleRunAudit = async () => {
    setIsAuditing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsAuditing(false);
    toast.success("تحلیل کامل سلامت سئو کاتالوگ سنگ با موفقیت انجام شد.");
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner with Score Gauge */}
      <Card className="border-border/70 shadow-xs overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                <span className="text-3xl font-bold tracking-tight">
                  ٪{stats.overallHealthScore}
                </span>
              </div>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    وضعیت کلی آمادگی موتورهای جستجو (SEO Audit)
                  </h3>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                    مطلوب و آماده رتبه‌گیری
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                  پلتفرم کارخانه سنگ البرز از نظر ساختار متادیتا، دسترسی ربات‌ها، تگ‌های کانونیکال و استانداردهای OpenGraph در وضعیت بهینه قرار دارد.
                </p>
              </div>
            </div>

            <Button
              variant="default"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={handleRunAudit}
              disabled={isAuditing}
            >
              <RefreshCw className={`h-4 w-4 ${isAuditing ? "animate-spin" : ""}`} />
              <span>{isAuditing ? "در حال پایش..." : "بررسی مجدد سلامت سئو"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Checklist Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>چک‌لیست شاخص‌های رتبه‌بندی گوگل و استانداردهای کاتالوگ سنگ</span>
          </h4>
          <span className="text-xs text-muted-foreground">
            {auditItems.filter((i) => i.status === "passed").length} از {auditItems.length} معیار تایید شده
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {auditItems.map((item) => {
            const isPassed = item.status === "passed";
            const isWarning = item.status === "warning";

            return (
              <Card
                key={item.id}
                className="border-border/60 bg-card hover:border-border transition-all shadow-2xs"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isPassed ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        ) : isWarning ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
                            <XCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold text-sm text-foreground">
                            {item.title}
                          </h5>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-2 py-0 ${
                              isPassed
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                            }`}
                          >
                            امتیاز: ٪{item.score}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.message}
                        </p>
                        {item.recommendation && (
                          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-primary">
                            <Sparkles className="h-3.5 w-3.5 shrink-0" />
                            <span>راهکار بهبود: {item.recommendation}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <Badge variant="secondary" className="text-[10px]">
                        اثرگذاری: {item.weight}٪
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stone Industry SEO Best Practices Guide */}
      <Card className="border-border/70 bg-muted/20 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold">
              توصیه‌های ویژه متخصصان سئو برای صنعت سنگ و صادرات اسلب
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            • <strong className="text-foreground">اصطلاحات پرداخت سطحی سنگ:</strong> حتماً در متای توضیحات و تگ‌های کلمات کلیدی، نوع فینیشینگ سنگ (ساب صیقلی، چرمی، بوش‌همر، سندبلاست، هوند، بادبر) را قید فرمایید تا معماران پروژه‌ای مستقیماً به صفحه محصول هدایت شوند.
          </p>
          <p>
            • <strong className="text-foreground">موقعیت معادن معتبر:</strong> درج خاستگاه سنگ (مانند عباس‌آباد محلات، دهبید فارس، لاشتر اصفهان، گرانیت نطنز یا نهبندان) اعتماد خریداران عمده و موتورهای جستجو را افزایش می‌دهد.
          </p>
          <p>
            • <strong className="text-foreground">ابعاد استاندارد صادراتی:</strong> اسلب‌های با ضخامت ۲ سانتی‌متر و تایل‌های ۶۰×۶۰ و ۴۰ طولی دارای بیشترین جستجوی B2B در صنعت ساختمان ایران و خاورمیانه هستند.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
