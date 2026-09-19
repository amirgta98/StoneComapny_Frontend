"use client";

import { MapPin, Info } from "lucide-react";
import { AddressCard } from "@/features/account/components/addresses/address-card";
import type { CustomerAddress } from "@/features/account/types/address";
import { AddAddressDialog } from "./add-address-dialog";

interface AddressStepProps {
  addresses: CustomerAddress[];
  selectedAddressId?: string;
  onSelectAddress: (address: CustomerAddress) => void;
  userId?: string;
}

export function AddressStep({
  addresses,
  selectedAddressId,
  onSelectAddress,
  userId = "u-user-1",
}: AddressStepProps) {
  return (
    <section aria-labelledby="address-step-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2
            id="address-step-heading"
            className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2"
          >
            <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>مرحله اول: انتخاب آدرس تحویل و تخلیه بار</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            محل پروژه یا انبار مقصد را برای هماهنگی ناوگان باربری انتخاب نمایید.
          </p>
        </div>

        <AddAddressDialog
          userId={userId}
          onAddressCreated={(newAddr) => {
            onSelectAddress(newAddr);
          }}
        />
      </div>

      {/* Stone Logistics Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/[0.03] p-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong className="text-foreground font-semibold">نکته مهم در حمل سنگ ساختمانی:</strong>{" "}
          به دلیل وزن و حجم بالای پالت‌های سنگ طبیعی، خودروهای باربری (خاور / تریلی) تا نزدیک‌ترین محل امکان تردد ایمن و تخلیه کارگاهی بار را حمل می‌نمایند. لطفاً امکان تردد خودروهای سنگین و دسترسی جرثقیل یا لیفتراک را در آدرس مشخص فرمایید.
        </p>
      </div>

      {/* Address Cards Grid */}
      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 sm:p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              هیچ آدرسی ثبت نشده است
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              برای ادامه سفارش سنگ، لطفاً آدرس محل پروژه یا انبار مقصد را ثبت فرمایید.
            </p>
          </div>
          <AddAddressDialog
            userId={userId}
            onAddressCreated={(newAddr) => {
              onSelectAddress(newAddr);
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => {
            const isSelected = address.id === selectedAddressId;
            return (
              <AddressCard
                key={address.id}
                address={address}
                mode="checkout"
                isSelected={isSelected}
                onSelect={(addr) => onSelectAddress(addr)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
