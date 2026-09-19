"use client";

import { useAuth } from "@/auth";
import { useAddressStore } from "../../stores/address-store";
import type { AddressFormValues } from "../../schemas/address-schema";
import { AddressForm } from "./address-form";

export function NewAddress() {
  const { user } = useAuth();
  const currentUserId = user?.id || "u-user-1";
  const { addAddress } = useAddressStore();

  const handleCreate = (values: AddressFormValues) => {
    addAddress(values, currentUserId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AddressForm
        title="افزودن آدرس جدید"
        submitLabel="ثبت و ذخیره آدرس"
        onSubmit={handleCreate}
        cancelHref="/account/addresses"
      />
    </div>
  );
}
