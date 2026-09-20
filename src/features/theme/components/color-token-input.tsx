"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface ColorTokenInputProps {
  id?: string;
  name: string;
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

export function ColorTokenInput({
  id,
  name,
  label,
  description,
  value = "#000000",
  onChange,
  onBlur,
  error,
  disabled = false,
  className,
}: ColorTokenInputProps) {
  const inputId = id || `color-token-${name}`;
  const errorId = `${inputId}-error`;
  const descriptionId = description ? `${inputId}-desc` : undefined;

  const isValidHex = HEX_REGEX.test(value);
  // HTML color picker requires valid 7-character lowercase hex
  const safePickerValue = isValidHex ? value.toLowerCase() : "#8b5e34";

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseHex = e.target.value.toUpperCase();
    onChange(uppercaseHex);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.trim();
    // Allow typing, uppercase it
    if (raw && !raw.startsWith("#") && !raw.startsWith("-")) {
      raw = `#${raw}`;
    }
    onChange(raw.toUpperCase());
  };

  return (
    <div className={cn("space-y-1.5 text-right", className)} dir="rtl">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={inputId}
          className="text-xs font-medium text-foreground select-none"
        >
          {label}
        </Label>
        {isValidHex && (
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-muted/50 text-muted-foreground"
            dir="ltr"
          >
            {value}
          </span>
        )}
      </div>

      {description && (
        <p id={descriptionId} className="text-[11px] text-muted-foreground">
          {description}
        </p>
      )}

      <div className="flex items-center gap-2">
        {/* Swatch & native color picker */}
        <div className="relative shrink-0">
          <input
            type="color"
            id={`${inputId}-picker`}
            value={safePickerValue}
            onChange={handlePickerChange}
            disabled={disabled}
            aria-label={`انتخاب رنگ برای ${label}`}
            className="sr-only"
          />
          <label
            htmlFor={`${inputId}-picker`}
            className={cn(
              "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-input shadow-xs transition-transform hover:scale-105 active:scale-95 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              disabled && "cursor-not-allowed opacity-50 hover:scale-100"
            )}
            style={{
              backgroundColor: isValidHex ? value : "#e5e7eb",
            }}
            title="کلیک برای انتخاب رنگ"
          >
            <span className="sr-only">انتخاب رنگ</span>
            {!isValidHex && (
              <span className="text-[10px] font-bold text-destructive">؟</span>
            )}
          </label>
        </div>

        {/* Synchronized HEX text input */}
        <div className="relative flex-1">
          <Input
            id={inputId}
            name={name}
            type="text"
            value={value}
            onChange={handleTextChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder="#RRGGBB"
            maxLength={7}
            aria-invalid={Boolean(error)}
            aria-describedby={
              cn(error && errorId, description && descriptionId) || undefined
            }
            className={cn(
              "font-mono text-xs uppercase tracking-wider text-left pl-3",
              error && "border-destructive focus-visible:ring-destructive"
            )}
            dir="ltr"
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
