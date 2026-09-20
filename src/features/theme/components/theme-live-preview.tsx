"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultTokens, type ThemeTokens } from "@/providers";
import { cn } from "@/lib/utils";

export interface ThemeLivePreviewProps {
  tokens: Partial<ThemeTokens>;
  className?: string;
}

export function ThemeLivePreview({ tokens, className }: ThemeLivePreviewProps) {
  // Merge incoming draft tokens with defaultTokens for stable fallbacks
  const activeTokens: ThemeTokens = {
    ...defaultTokens,
    ...tokens,
  };

  // Inline CSS variables scoped strictly to this preview container.
  // This isolates all active draft tokens without mutating global document root styles.
  const scopedStyle: React.CSSProperties = {
    "--primary": activeTokens.primary,
    "--primary-foreground": activeTokens.primaryForeground,
    "--secondary": activeTokens.secondary,
    "--secondary-foreground": activeTokens.secondaryForeground,
    "--background": activeTokens.background,
    "--foreground": activeTokens.foreground,
    "--muted": activeTokens.muted,
    "--muted-foreground": activeTokens.mutedForeground,
    "--accent": activeTokens.accent,
    "--accent-foreground": activeTokens.accentForeground,
    "--border": activeTokens.border,
    "--radius": activeTokens.radius,
    "--font-sans": activeTokens.fontSans,
    "--font-heading": activeTokens.fontHeading,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 shadow-md bg-card/60 backdrop-blur-xs p-5 space-y-5 transition-colors",
        className
      )}
      dir="rtl"
    >
      {/* Live Preview Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <h3 className="text-sm font-semibold text-foreground">
            پیش‌نمایش تعاملی و برخط قالب
          </h3>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
          شعاع: {activeTokens.radius}
        </span>
      </div>

      {/* Scoped Preview Simulation Sandbox */}
      <div
        style={scopedStyle}
        className="rounded-xl border border-border p-4 transition-all duration-200"
        data-testid="theme-preview-container"
      >
        {/* Mock Top Bar / Mini Storefront Navbar */}
        <div
          className="rounded-lg p-3 mb-4 flex items-center justify-between border border-border transition-colors"
          style={{
            backgroundColor: activeTokens.background,
            color: activeTokens.foreground,
            borderRadius: activeTokens.radius,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 flex items-center justify-center font-bold text-xs"
              style={{
                backgroundColor: activeTokens.primary,
                color: activeTokens.primaryForeground,
                borderRadius: `calc(${activeTokens.radius} - 2px)`,
              }}
            >
              س
            </div>
            <span
              className="text-xs font-bold"
              style={{ fontFamily: activeTokens.fontHeading }}
            >
              کارخانه سنگ دهبید و تراورتن
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-[11px] px-2 py-0.5"
              style={{
                backgroundColor: activeTokens.accent,
                color: activeTokens.accentForeground,
                borderRadius: `calc(${activeTokens.radius} - 2px)`,
              }}
            >
              کاتالوگ ۱۴۰۵
            </span>
          </div>
        </div>

        {/* Sample Content Card */}
        <Card
          className="shadow-sm transition-all"
          style={{
            backgroundColor: activeTokens.background,
            borderColor: activeTokens.border,
            color: activeTokens.foreground,
            borderRadius: activeTokens.radius,
          }}
        >
          <CardHeader className="p-4 pb-2 space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle
                className="text-base font-bold"
                style={{
                  color: activeTokens.foreground,
                  fontFamily: activeTokens.fontHeading,
                }}
              >
                اسلب مرمریت لاشتر صیقلی
              </CardTitle>
              <Badge
                variant="outline"
                className="text-[11px] border"
                style={{
                  backgroundColor: activeTokens.accent,
                  color: activeTokens.accentForeground,
                  borderColor: activeTokens.border,
                  borderRadius: `calc(${activeTokens.radius} - 2px)`,
                }}
              >
                صادراتی ویژه
              </Badge>
            </div>
            <CardDescription
              className="text-xs"
              style={{
                color: activeTokens.mutedForeground,
                fontFamily: activeTokens.fontSans,
              }}
            >
              کد محصول: STN-942 • معدن اختصاصی اصفهان
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-2 space-y-3">
            <p
              className="text-xs leading-relaxed"
              style={{
                color: activeTokens.foreground,
                fontFamily: activeTokens.fontSans,
              }}
            >
              تولید و فرآوری انواع سنگ‌های مرمریت و تراورتن با خط تولید تمام‌اتوماتیک ایتالیایی. ضخامت دقیق ۲ سانتی‌متر با ساب آینه‌ای مقاوم در برابر سایش و رطوبت.
            </p>

            {/* Muted Specs Box */}
            <div
              className="p-2.5 text-[11px] space-y-1 border"
              style={{
                backgroundColor: activeTokens.muted,
                color: activeTokens.mutedForeground,
                borderColor: activeTokens.border,
                borderRadius: `calc(${activeTokens.radius} - 2px)`,
                fontFamily: activeTokens.fontSans,
              }}
            >
              <div className="flex justify-between">
                <span>موجودی انبار کارخانه:</span>
                <span className="font-semibold font-mono" dir="ltr">
                  1,850 m²
                </span>
              </div>
              <div className="flex justify-between">
                <span>قیمت پایه هر متر مربع:</span>
                <span className="font-semibold text-foreground">
                  ۱,۴۸۰,۰۰۰ تومان
                </span>
              </div>
            </div>

            {/* Action Buttons Demonstration */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Primary Styled Button */}
              <Button
                type="button"
                className="text-xs h-8 px-3 shadow-xs hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: activeTokens.primary,
                  color: activeTokens.primaryForeground,
                  borderRadius: activeTokens.radius,
                }}
              >
                ثبت سفارش خرید (Primary)
              </Button>

              {/* Secondary Styled Button */}
              <Button
                type="button"
                variant="secondary"
                className="text-xs h-8 px-3 shadow-xs hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: activeTokens.secondary,
                  color: activeTokens.secondaryForeground,
                  borderRadius: activeTokens.radius,
                }}
              >
                درخواست کاتالوگ (Secondary)
              </Button>

              {/* Accent Button / Action */}
              <Button
                type="button"
                variant="outline"
                className="text-xs h-8 px-2.5 hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: activeTokens.accent,
                  color: activeTokens.accentForeground,
                  borderColor: activeTokens.border,
                  borderRadius: activeTokens.radius,
                }}
              >
                مشاهده تصاویر اسلب
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Color Tokens Visual Swatch Bar */}
        <div className="mt-4 pt-3 border-t border-border/60">
          <p className="text-[10px] text-muted-foreground mb-2">
            پالت فعال (Brand & UI Swatches):
          </p>
          <div className="grid grid-cols-6 gap-1.5 text-center">
            <div className="space-y-1">
              <div
                className="h-6 rounded border border-border"
                style={{
                  backgroundColor: activeTokens.primary,
                  borderRadius: `calc(${activeTokens.radius} - 2px)`,
                }}
                title={`Primary: ${activeTokens.primary}`}
              />
              <span className="text-[9px] font-mono block truncate" dir="ltr">
                {activeTokens.primary}
              </span>
            </div>

            <div className="space-y-1">
              <div
                className="h-6 rounded border border-border"
                style={{
                  backgroundColor: activeTokens.secondary,
                  borderRadius: `calc(${activeTokens.radius} - 2px)`,
                }}
                title={`Secondary: ${activeTokens.secondary}`}
              />
              <span className="text-[9px] font-mono block truncate" dir="ltr">
                {activeTokens.secondary}
              </span>
            </div>

            <div className="space-y-1">
              <div
                className="h-6 rounded border border-border"
                style={{
                  backgroundColor: activeTokens.accent,
                  borderRadius: `calc(${activeTokens.radius} - 2px)`,
                }}
                title={`Accent: ${activeTokens.accent}`}
              />
              <span className="text-[9px] font-mono block truncate" dir="ltr">
                {activeTokens.accent}
              </span>
            </div>

            <div className="space-y-1">
              <div
                className="h-6 rounded border border-border"
                style={{
                  backgroundColor: activeTokens.background,
                  borderRadius: `calc(${activeTokens.radius} - 2px)`,
                }}
                title={`Background: ${activeTokens.background}`}
              />
              <span className="text-[9px] font-mono block truncate" dir="ltr">
                {activeTokens.background}
              </span>
            </div>

            <div className="space-y-1">
              <div
                className="h-6 rounded border border-border"
                style={{
                  backgroundColor: activeTokens.muted,
                  borderRadius: `calc(${activeTokens.radius} - 2px)`,
                }}
                title={`Muted: ${activeTokens.muted}`}
              />
              <span className="text-[9px] font-mono block truncate" dir="ltr">
                {activeTokens.muted}
              </span>
            </div>

            <div className="space-y-1">
              <div
                className="h-6 rounded border border-border"
                style={{
                  backgroundColor: activeTokens.border,
                  borderRadius: `calc(${activeTokens.radius} - 2px)`,
                }}
                title={`Border: ${activeTokens.border}`}
              />
              <span className="text-[9px] font-mono block truncate" dir="ltr">
                {activeTokens.border}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
