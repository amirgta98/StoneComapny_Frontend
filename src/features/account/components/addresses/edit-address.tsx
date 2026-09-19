"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth";
import { useAddressStore } from "../../stores/address-store";
import type { AddressFormValues } from "../../schemas/address-schema";
import { AddressForm } from "./address-form";
import { AddressLoadingState } from "./address-loading-state";
import { AddressErrorState } from "./address-error-state";

interface EditAddressProps {
  addressId: string;
}

export function EditAddress({ addressId }: EditAddressProps) {
  const { user } = useAuth();
  const currentUserId = user?.id || "u-user-1";
  const { getAddressById, updateAddress } = useAddressStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <AddressLoadingState />
      </div>
    );
  }

  const address = getAddressById(addressId, currentUserId);

  if (!address) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-12">
        <AddressErrorState
          title="آدرس مورد نظر یافت نشد"
          message="این آدرس ممکن است حذف شده باشد یا به حساب کاربری شما تعلق نداشته باشد."
        />
        <div className="text-center">
          <Button asChild variant="outline" className="border-border">
            <Link href="/account/addresses" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              <span>بازگشت به لیست آدرس‌ها</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdate = (values: AddressFormValues) => {
    return updateAddress(addressId, values, currentUserId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AddressForm
        initialData={address}
        title={`ویرایش آدرس «${address.title}»`}
        submitLabel="ذخیره تغییرات آدرس"
        onSubmit={handleUpdate}
        cancelHref="/account/addresses"
      />
    </div>
  );
}
