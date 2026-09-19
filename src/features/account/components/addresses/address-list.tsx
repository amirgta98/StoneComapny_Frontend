"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth";
import { useAddressStore } from "../../stores/address-store";
import type { CustomerAddress } from "../../types/address";
import { AddressCard } from "./address-card";
import { DeleteAddressDialog } from "./delete-address-dialog";
import { EmptyAddresses } from "./empty-addresses";
import { AddressLoadingState } from "./address-loading-state";

export function AddressesList() {
  const { user } = useAuth();
  const currentUserId = user?.id || "u-user-1";

  // Zustand Store operations
  const {
    getUserAddresses,
    deleteAddress,
    setDefaultShipping,
    setDefaultBilling,
  } = useAddressStore();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addressToDelete, setAddressToDelete] = useState<CustomerAddress | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userAddresses = useMemo(() => {
    return getUserAddresses(currentUserId);
  }, [getUserAddresses, currentUserId]);

  // Filter addresses by search query (title, recipient, city, province, postalCode)
  const filteredAddresses = useMemo(() => {
    if (!searchQuery.trim()) return userAddresses;

    const query = searchQuery.trim().toLowerCase();
    return userAddresses.filter((addr) => {
      const titleMatch = addr.title.toLowerCase().includes(query);
      const nameMatch = `${addr.firstName} ${addr.lastName}`
        .toLowerCase()
        .includes(query);
      const locationMatch = `${addr.province} ${addr.city} ${addr.address}`
        .toLowerCase()
        .includes(query);
      const postalMatch = addr.postalCode.includes(query);
      const phoneMatch = addr.phone.includes(query);

      return (
        titleMatch ||
        nameMatch ||
        locationMatch ||
        postalMatch ||
        phoneMatch
      );
    });
  }, [userAddresses, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;
    try {
      setIsDeleting(true);
      const success = deleteAddress(addressToDelete.id, currentUserId);
      if (success) {
        toast.success(`آدرس «${addressToDelete.title}» با موفقیت حذف گردید.`);
        setAddressToDelete(null);
      } else {
        toast.error("خطا در حذف آدرس.");
      }
    } catch (err) {
      console.error(err);
      toast.error("مشکلی در حذف آدرس رخ داد.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefaultShipping = (id: string) => {
    setDefaultShipping(id, currentUserId);
    toast.success("آدرس پیش‌فرض ارسال به‌روزرسانی شد.");
  };

  const handleSetDefaultBilling = (id: string) => {
    setDefaultBilling(id, currentUserId);
    toast.success("آدرس پیش‌فرض صورت‌حساب به‌روزرسانی شد.");
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">آدرس‌های من</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              مدیریت آدرس‌های ارسال سنگ و صورت‌حساب‌های رسمی پروژه
            </p>
          </div>
        </div>
        <AddressLoadingState />
      </div>
    );
  }

  const hasAnyAddresses = userAddresses.length > 0;
  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-4 w-4 stroke-[2]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">آدرس‌های من</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground ps-10">
            مدیریت آدرس‌های تحویل سنگ، تنظیم دسترسی جرثقیل و تعیین پیش‌فرض‌های سفارش
          </p>
        </div>

        <div className="flex items-center gap-2 ps-10 sm:ps-0">
          <Button asChild className="gap-2 shadow-xs text-xs sm:text-sm">
            <Link href="/account/addresses/new">
              <Plus className="h-4 w-4" />
              <span>افزودن آدرس جدید</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Address Search Bar (when addresses exist) */}
      {hasAnyAddresses && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی در عنوان، نام تحویل‌گیرنده، شهر، استان یا کد پستی..."
              className="ps-9 pe-9 border-border bg-card text-xs sm:text-sm"
            />
            {isSearchActive && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full"
                aria-label="پاک کردن جستجو"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-muted-foreground font-medium">
            تعداد کل آدرس‌ها: {userAddresses.length.toLocaleString("fa-IR")}
          </div>
        </div>
      )}

      {/* Addresses Grid or Empty States */}
      {!hasAnyAddresses ? (
        <EmptyAddresses />
      ) : filteredAddresses.length === 0 ? (
        <EmptyAddresses
          isSearchActive
          onClearSearch={() => setSearchQuery("")}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              mode="account"
              onDelete={(addr) => setAddressToDelete(addr)}
              onSetDefaultShipping={handleSetDefaultShipping}
              onSetDefaultBilling={handleSetDefaultBilling}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteAddressDialog
        open={Boolean(addressToDelete)}
        onOpenChange={(open) => !open && setAddressToDelete(null)}
        address={addressToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
