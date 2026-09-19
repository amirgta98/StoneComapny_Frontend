"use client";

import Link from "next/link";
import { MapPin, Plus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAddressesProps {
  isSearchActive?: boolean;
  onClearSearch?: () => void;
}

export function EmptyAddresses({
  isSearchActive = false,
  onClearSearch,
}: EmptyAddressesProps) {
  if (isSearchActive) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <SearchX className="h-6 w-6 stroke-[1.8]" />
        </div>
        <h3 className="mt-4 text-base font-bold text-foreground">
          آدرسی با این مشخصات یافت نشد
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
          عبارت جستجو شده با عنوان، نام گیرنده، شهر، استان یا کد پستی هیچ‌یک از آدرس‌ها همخوانی ندارد.
        </p>
        {onClearSearch && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearSearch}
            className="mt-5 border-border"
          >
            پاک کردن جستجو
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MapPin className="h-8 w-8 stroke-[1.8]" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-foreground">
        هنوز آدرسی ثبت نکرده‌اید
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        برای سریع‌تر شدن فرآیند خرید سنگ، بارگیری و صدور پیش‌فاکتور، اولین آدرس خود را اضافه کنید.
      </p>
      <div className="mt-6">
        <Button asChild className="gap-1.5 shadow-xs">
          <Link href="/account/addresses/new">
            <Plus className="h-4 w-4" />
            <span>افزودن آدرس جدید</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
