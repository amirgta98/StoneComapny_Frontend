"use client";

import { Eye, Edit, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import { useSeoStore } from "../../stores/seo-store";
import type { PageSeoItem } from "../../types";

interface PageSeoCardProps {
  page: PageSeoItem;
}

export function PageSeoCard({ page }: PageSeoCardProps) {
  const openSerpPreview = useSeoStore((state) => state.openSerpPreview);
  const openEditDialog = useSeoStore((state) => state.openEditDialog);
  const togglePageIndexing = useSeoStore((state) => state.togglePageIndexing);

  const [copied, setCopied] = useState(false);

  const isHealthy = page.healthScore >= 90;
  const isWarning = page.healthScore < 90 && page.healthScore >= 75;

  const handleCopyUrl = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(page.canonicalUrl || `https://alborzstone.ir${page.slug}`);
      }
      setCopied(true);
      toast.success(`پیوند صفحه «${page.pageName}» کپی شد.`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("امکان کپی پیوند در این محیط فراهم نیست.");
    }
  };

  return (
    <Card className="border-border/70 shadow-xs overflow-hidden" dir="rtl">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-foreground text-sm leading-snug">
              {page.pageName}
            </h4>
            <span className="text-xs text-muted-foreground font-mono" dir="ltr">
              {page.slug}
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            {page.categoryLabel}
          </Badge>
        </div>

        {/* Title preview */}
        <div className="text-xs text-muted-foreground line-clamp-2 bg-muted/40 p-2 rounded-md">
          <span className="font-medium text-foreground">عنوان متا: </span>
          {page.title}
        </div>

        {/* Statuses and Indicators */}
        <div className="flex items-center justify-between border-t border-border/40 pt-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Switch
              checked={page.isIndexed}
              onCheckedChange={() => togglePageIndexing(page.id)}
              aria-label={`تغییر ایندکس ${page.pageName}`}
            />
            <span
              className={`text-[11px] font-medium ${
                page.isIndexed ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
              }`}
            >
              {page.isIndexed ? "ایندکس فعال" : "NoIndex"}
            </span>
          </div>

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
              ٪{page.healthScore} سئو
            </Badge>
            <Badge variant="secondary" className="font-mono text-[9px]">
              {page.schemaType}
            </Badge>
          </div>
        </div>

        {/* Keywords */}
        {page.keywords && page.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {page.keywords.slice(0, 3).map((kw, i) => (
              <span
                key={i}
                className="text-[10px] bg-muted text-muted-foreground rounded px-1.5 py-0.5"
              >
                #{kw}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={handleCopyUrl}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>کپی پیوند</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={() => openSerpPreview(page)}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>گوگل SERP</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={() => openEditDialog(page)}
          >
            <Edit className="h-3.5 w-3.5" />
            <span>ویرایش</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
