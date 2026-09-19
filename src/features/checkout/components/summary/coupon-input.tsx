"use client";

import { useState } from "react";
import { Tag, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VALID_COUPONS } from "../../constants/payment-methods";

interface CouponInputProps {
  appliedCoupon?: string;
  onApplyCoupon: (code: string) => Promise<boolean | void> | boolean | void;
  onRemoveCoupon: () => void;
  disabled?: boolean;
}

export function CouponInput({
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  disabled,
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await onApplyCoupon(cleanCode);
      if (res !== false) {
        setCode("");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "کد تخفیف وارد شده معتبر نیست";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (appliedCoupon) {
    const info = VALID_COUPONS[appliedCoupon];
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-bold text-foreground font-mono">
              {appliedCoupon}
            </span>
            <span className="text-muted-foreground block text-[11px]">
              {info?.description || "کد تخفیف با موفقیت اعمال شد"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemoveCoupon}
          aria-label="حذف کد تخفیف"
          className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-destructive transition-colors text-xs flex items-center gap-1"
        >
          <X className="h-3.5 w-3.5" />
          <span className="text-[11px]">حذف</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            placeholder="کد تخفیف (مثال: STONE10)"
            disabled={disabled || isLoading}
            className="ps-8 h-9 text-xs font-mono uppercase bg-background border-border"
          />
        </div>

        <Button
          type="submit"
          size="sm"
          variant="outline"
          disabled={!code.trim() || disabled || isLoading}
          className="h-9 px-3 text-xs shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <span>اعمال کد</span>
          )}
        </Button>
      </form>

      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
