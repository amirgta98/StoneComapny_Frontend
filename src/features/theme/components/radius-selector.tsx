"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface RadiusSelectorProps {
  id?: string;
  name: string;
  label?: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const PRESET_OPTIONS = [
  { value: "0.3rem", label: "کوچک", sublabel: "0.3rem" },
  { value: "0.5rem", label: "استاندارد", sublabel: "0.5rem" },
  { value: "0.75rem", label: "متوسط", sublabel: "0.75rem" },
  { value: "1rem", label: "بزرگ", sublabel: "1rem" },
];

export function RadiusSelector({
  id = "theme-radius-selector",
  name,
  label = "شعاع گوشه‌ها (Border Radius)",
  description = "تعیین میزان انحنای لبه‌های دکمه‌ها، کارت‌ها و المان‌های ورودی",
  value = "0.5rem",
  onChange,
  onBlur,
  error,
  disabled = false,
  className,
}: RadiusSelectorProps) {
  const errorId = `${id}-error`;
  const descriptionId = description ? `${id}-desc` : undefined;

  const isCustom = !PRESET_OPTIONS.some((opt) => opt.value === value);

  return (
    <div className={cn("space-y-2 text-right", className)} dir="rtl">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs font-medium text-foreground">
          {label}
        </Label>
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-muted/50 text-muted-foreground"
          dir="ltr"
        >
          {value || "مقدار خالی"}
        </span>
      </div>

      {description && (
        <p id={descriptionId} className="text-[11px] text-muted-foreground">
          {description}
        </p>
      )}

      {/* Preset buttons */}
      <div className="grid grid-cols-4 gap-1.5">
        {PRESET_OPTIONS.map((preset) => {
          const isSelected = value === preset.value;
          return (
            <Button
              key={preset.value}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={() => onChange(preset.value)}
              className={cn(
                "h-auto py-1.5 px-2 flex flex-col items-center gap-0.5 text-xs transition-all",
                isSelected
                  ? "ring-2 ring-primary ring-offset-1 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={{
                borderRadius: preset.value,
              }}
            >
              <div
                className="w-4 h-4 border-2 border-current rounded-tl-none"
                style={{ borderRadius: preset.value }}
                aria-hidden="true"
              />
              <span className="text-[11px]">{preset.label}</span>
              <span className="text-[9px] font-mono opacity-80" dir="ltr">
                {preset.sublabel}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Custom input */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <label htmlFor={id}>مقدار سفارشی (Custom CSS)</label>
          {isCustom && value && (
            <span className="text-primary font-medium text-[10px]">
              سفارشی فعال است
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            id={id}
            name={name}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            placeholder="مثال: 0.5rem یا 8px"
            aria-invalid={Boolean(error)}
            aria-describedby={
              cn(error && errorId, description && descriptionId) || undefined
            }
            className={cn(
              "font-mono text-xs text-left",
              error && "border-destructive focus-visible:ring-destructive"
            )}
            dir="ltr"
          />
          {/* Dynamic visual preview box with active radius */}
          <div
            className="w-9 h-9 shrink-0 border-2 border-primary bg-primary/10 transition-all"
            style={{ borderRadius: value || "0" }}
            title={`پیش‌نمایش انحنا: ${value}`}
          />
        </div>
      </div>

      {/* Accessible Inline Validation Error */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-destructive flex items-center gap-1 font-medium mt-1 animate-in fade-in-50"
        >
          <span aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
