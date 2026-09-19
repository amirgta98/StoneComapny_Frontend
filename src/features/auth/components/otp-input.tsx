"use client";

import { useRef, useState } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { CINEMATIC_EASE } from "@/lib/motion";

const CODE_LENGTH = 5;

type OtpInputProps = {
  /** Called with the full code as soon as all boxes are filled. */
  onComplete: (code: string) => void;
  /** Called on any change (used to clear a stale error). */
  onChange?: () => void;
  disabled?: boolean;
  /** Highlight the boxes as invalid. */
  hasError?: boolean;
};

/**
 * Five-digit OTP input with:
 * - automatic focus advance as digits are typed,
 * - Backspace navigation to the previous box,
 * - clipboard paste support (fills boxes left→right),
 * - a subtle scale bounce on each filled box (respects reduced motion).
 */
export function OtpInput({
  onComplete,
  onChange,
  disabled,
  hasError,
}: OtpInputProps) {
  const [values, setValues] = useState<string[]>(() =>
    Array<string>(CODE_LENGTH).fill("")
  );
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  const focusAt = (index: number) => {
    const clamped = Math.max(0, Math.min(CODE_LENGTH - 1, index));
    const el = refs.current[clamped];
    el?.focus();
    el?.select();
  };

  const fill = (next: string[]) => {
    setValues(next);
    onChange?.();
    const code = next.join("");
    const filledUntil = next.findIndex((v) => v === "");
    if (code.length === CODE_LENGTH && filledUntil === -1) {
      onComplete(code);
    } else if (filledUntil > 0) {
      focusAt(filledUntil);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!digits) return;

    const next = Array<string>(CODE_LENGTH).fill("");
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    fill(next);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (values[index]) {
        const next = [...values];
        next[index] = "";
        setValues(next);
        onChange?.();
        focusAt(index);
      } else if (index > 0) {
        const next = [...values];
        next[index - 1] = "";
        setValues(next);
        onChange?.();
        focusAt(index - 1);
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      focusAt(index - 1);
    } else if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      focusAt(index + 1);
    }
  };

  return (
    <div
      dir="ltr"
      role="group"
      aria-label="کد تأیید — پنج رقمی"
      className="flex items-center justify-between gap-2"
    >
      {values.map((value, index) => {
        const filled = value !== "";
        return (
          <motion.input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={2}
            value={value}
            disabled={disabled}
            aria-label={`رقم ${index + 1}`}
            onChange={(event) => {
              const digit = event.target.value.replace(/\D/g, "").slice(-1);
              const next = [...values];
              next[index] = digit;
              fill(next);
            }}
            onPaste={handlePaste}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onFocus={(event) => event.target.select()}
            animate={filled && !reduceMotion ? { scale: [1, 1.12, 1] } : undefined}
            transition={{ duration: 0.28, ease: CINEMATIC_EASE }}
            className={cn(
              "h-12 w-10 rounded-lg border bg-background text-center text-lg font-bold tabular-nums shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-14 sm:w-12",
              hasError
                ? "border-destructive"
                : filled
                  ? "border-primary"
                  : "border-border"
            )}
          />
        );
      })}
    </div>
  );
}