"use client";

import { useState } from "react";
import {
  ExternalLink,
  Edit,
  Eye,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useSeoStore } from "../../stores/seo-store";
import type { PageSeoItem } from "../../types";

interface PageSeoTableProps {
  pages: PageSeoItem[];
}

export function PageSeoTable({ pages }: PageSeoTableProps) {
  const openSerpPreview = useSeoStore((state) => state.openSerpPreview);
  const openEditDialog = useSeoStore((state) => state.openEditDialog);
  const togglePageIndexing = useSeoStore((state) => state.togglePageIndexing);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = async (page: PageSeoItem) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(page.canonicalUrl || `https://alborzstone.ir${page.slug}`);
      }
      setCopiedId(page.id);
      toast.success(`پیوند صفحه «${page.pageName}» کپی شد.`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("امکان کپی پیوند در این محیط فراهم نیست.");
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-card shadow-xs">
      <table className="w-full text-right text-xs" dir="rtl">
        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/70">
          <tr>
            <th className="py-3 px-4 w-[28%]">صفحه و مسیر (Route / Slug)</th>
            <th className="py-3 px-4 w-[12%]">دسته‌بندی</th>
            <th className="py-3 px-4 w-[14%]">وضعیت در موتورهای جستجو</th>
            <th className="py-3 px-4 w-[14%]">نمره سلامت سئو</th>
            <th className="py-3 px-4 w-[12%]">اسکیما Schema.org</th>
            <th className="py-3 px-4 w-[20%] text-center">عملیات و پیش‌نمایش</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {pages.map((page) => {
            const isHealthy = page.healthScore >= 90;
            const isWarning = page.healthScore < 90 && page.healthScore >= 75;

            return (
              <tr
                key={page.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                {/* 1. Page Name & Slug */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                      {page.pageName}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground font-mono" dir="ltr">
                        {page.slug}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">•</span>
                      <span className="text-[10px] text-muted-foreground">
                        {page.keywords.slice(0, 2).join("، ")}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. Category */}
                <td className="py-3.5 px-4">
                  <Badge variant="outline" className="text-[11px] font-normal">
                    {page.categoryLabel}
                  </Badge>
                </td>

                {/* 3. Index Directive & Toggle */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={page.isIndexed}
                      onCheckedChange={() => togglePageIndexing(page.id)}
                      aria-label={`تغییر وضعیت ایندکس ${page.pageName}`}
                    />
                    <span
                      className={`text-[11px] font-medium ${
                        page.isIndexed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {page.isIndexed ? "ایندکس فعال" : "NoIndex"}
                    </span>
                  </div>
                </td>

                {/* 4. Health Score */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${
                          isHealthy
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : isWarning
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                        }`}
                      >
                        ٪{page.healthScore}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {isHealthy ? "عالی" : isWarning ? "نیاز به بررسی" : "ضعیف"}
                      </span>
                    </div>
                    <div className="w-24 bg-muted rounded-full h-1 overflow-hidden">
                      <div
                        className={`h-full ${
                          isHealthy
                            ? "bg-emerald-500"
                            : isWarning
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${page.healthScore}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* 5. Schema Type */}
                <td className="py-3.5 px-4">
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {page.schemaType}
                  </Badge>
                </td>

                {/* 6. Action buttons */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 text-xs gap-1 hover:border-primary hover:text-primary"
                      onClick={() => openSerpPreview(page)}
                      title="پیش‌نمایش در گوگل و شبکه‌های اجتماعی"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>پیش‌نمایش SERP</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openEditDialog(page)}
                      title="ویرایش متادیتای سئو"
                    >
                      <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleCopyUrl(page)}
                      title="کپی لینک یکتای صفحه"
                    >
                      {copiedId === page.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
