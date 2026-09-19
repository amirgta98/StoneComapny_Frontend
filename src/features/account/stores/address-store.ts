"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CustomerAddress } from "../types/address";
import type { AddressFormValues } from "../schemas/address-schema";

const INITIAL_MOCK_ADDRESSES: CustomerAddress[] = [
  {
    id: "addr-1",
    userId: "u-user-1",
    title: "دفتر مرکزی و شوروم",
    firstName: "مهندس علیرضا",
    lastName: "کاظمی",
    phone: "09120000004",
    country: "ایران",
    province: "تهران",
    city: "تهران",
    address: "خیابان ولیعصر، بالاتر از میدان ونک، برج نگین، طبقه ۳",
    plaque: "۱۲۴",
    unit: "۶",
    postalCode: "1969713541",
    isDefaultShipping: true,
    isDefaultBilling: true,
    floor: "۳",
    hasFreightElevator: true,
    craneAccess: false,
    deliveryType: "forklift",
    createdAt: "2024-05-10T10:00:00Z",
    updatedAt: "2024-08-01T12:00:00Z",
  },
  {
    id: "addr-2",
    userId: "u-user-1",
    title: "کارگاه ساختمانی پروژه لواسان",
    firstName: "حسن",
    lastName: "باقری (سرپرست کارگاه)",
    phone: "09120000005",
    country: "ایران",
    province: "تهران",
    city: "لواسان",
    address: "بلوار باستی، انتهای خیابان چناران، کارگاه ساختمانی برج باغ نیلوفر",
    plaque: "۱۸",
    unit: "",
    postalCode: "1668741123",
    isDefaultShipping: false,
    isDefaultBilling: false,
    floor: "همکف محوطه",
    hasFreightElevator: false,
    craneAccess: true,
    deliveryType: "crane",
    createdAt: "2024-06-15T09:30:00Z",
    updatedAt: "2024-06-15T09:30:00Z",
  },
  {
    id: "addr-3",
    userId: "u-user-1",
    title: "انبار مرکزی و دپو مصالح البرز",
    firstName: "حامد",
    lastName: "فرهمند",
    phone: "09120000006",
    country: "ایران",
    province: "البرز",
    city: "کرج",
    address: "شهرک صنعتی بهارستان، بلوار فناوری، خیابان چهارم غربی، سوله شماره ۹",
    plaque: "۹",
    unit: "",
    postalCode: "3197654321",
    isDefaultShipping: false,
    isDefaultBilling: false,
    floor: "همکف صنعتی",
    hasFreightElevator: true,
    craneAccess: true,
    deliveryType: "forklift",
    createdAt: "2024-07-20T14:15:00Z",
    updatedAt: "2024-07-20T14:15:00Z",
  },
];

interface AddressState {
  addresses: CustomerAddress[];
  getUserAddresses: (userId?: string) => CustomerAddress[];
  getAddressById: (id: string, userId?: string) => CustomerAddress | undefined;
  addAddress: (
    data: AddressFormValues,
    userId?: string
  ) => CustomerAddress;
  updateAddress: (
    id: string,
    data: AddressFormValues,
    userId?: string
  ) => boolean;
  deleteAddress: (id: string, userId?: string) => boolean;
  setDefaultShipping: (id: string, userId?: string) => void;
  setDefaultBilling: (id: string, userId?: string) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: INITIAL_MOCK_ADDRESSES,

      getUserAddresses: (userId = "u-user-1") => {
        const effectiveUserId = userId || "u-user-1";
        return get().addresses.filter((a) => a.userId === effectiveUserId);
      },

      getAddressById: (id: string, userId = "u-user-1") => {
        const effectiveUserId = userId || "u-user-1";
        return get().addresses.find(
          (a) => a.id === id && a.userId === effectiveUserId
        );
      },

      addAddress: (data: AddressFormValues, userId = "u-user-1") => {
        const effectiveUserId = userId || "u-user-1";
        const currentList = get().addresses;
        const userExisting = currentList.filter((a) => a.userId === effectiveUserId);

        // If user had 0 addresses, automatically make this default for both
        const isFirst = userExisting.length === 0;
        const willBeDefaultShipping = isFirst || data.isDefaultShipping;
        const willBeDefaultBilling = isFirst || data.isDefaultBilling;

        // Reset previous defaults if new default is set
        const updatedList = currentList.map((addr) => {
          if (addr.userId !== effectiveUserId) return addr;
          return {
            ...addr,
            isDefaultShipping: willBeDefaultShipping
              ? false
              : addr.isDefaultShipping,
            isDefaultBilling: willBeDefaultBilling
              ? false
              : addr.isDefaultBilling,
          };
        });

        const newAddress: CustomerAddress = {
          id: `addr-${Date.now()}`,
          userId: effectiveUserId,
          title: data.title.trim(),
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          phone: data.phone.trim(),
          country: data.country.trim() || "ایران",
          province: data.province.trim(),
          city: data.city.trim(),
          address: data.address.trim(),
          plaque: data.plaque.trim(),
          unit: data.unit?.trim() || "",
          postalCode: data.postalCode.trim(),
          isDefaultShipping: willBeDefaultShipping,
          isDefaultBilling: willBeDefaultBilling,
          floor: data.floor?.trim() || "",
          hasFreightElevator: Boolean(data.hasFreightElevator),
          craneAccess: Boolean(data.craneAccess),
          deliveryType: data.deliveryType || "curbside",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({ addresses: [newAddress, ...updatedList] });
        return newAddress;
      },

      updateAddress: (id: string, data: AddressFormValues, userId = "u-user-1") => {
        const effectiveUserId = userId || "u-user-1";
        const currentList = get().addresses;
        const target = currentList.find(
          (a) => a.id === id && a.userId === effectiveUserId
        );
        if (!target) return false;

        const updatedList = currentList.map((addr) => {
          if (addr.userId !== effectiveUserId) return addr;

          if (addr.id === id) {
            return {
              ...addr,
              title: data.title.trim(),
              firstName: data.firstName.trim(),
              lastName: data.lastName.trim(),
              phone: data.phone.trim(),
              country: data.country.trim() || "ایران",
              province: data.province.trim(),
              city: data.city.trim(),
              address: data.address.trim(),
              plaque: data.plaque.trim(),
              unit: data.unit?.trim() || "",
              postalCode: data.postalCode.trim(),
              isDefaultShipping: data.isDefaultShipping,
              isDefaultBilling: data.isDefaultBilling,
              floor: data.floor?.trim() || "",
              hasFreightElevator: Boolean(data.hasFreightElevator),
              craneAccess: Boolean(data.craneAccess),
              deliveryType: data.deliveryType || "curbside",
              updatedAt: new Date().toISOString(),
            };
          }

          // If target turned on default, reset others
          return {
            ...addr,
            isDefaultShipping: data.isDefaultShipping
              ? false
              : addr.isDefaultShipping,
            isDefaultBilling: data.isDefaultBilling
              ? false
              : addr.isDefaultBilling,
          };
        });

        set({ addresses: updatedList });
        return true;
      },

      deleteAddress: (id: string, userId = "u-user-1") => {
        const effectiveUserId = userId || "u-user-1";
        const currentList = get().addresses;
        const target = currentList.find(
          (a) => a.id === id && a.userId === effectiveUserId
        );
        if (!target) return false;

        const remainingUserAddresses = currentList.filter(
          (a) => a.userId === effectiveUserId && a.id !== id
        );

        // Safe Default Handling (Specification §7):
        // If the deleted address was default, assign default to another address if available
        let reassignShipping = target.isDefaultShipping;
        let reassignBilling = target.isDefaultBilling;

        const updatedUserAddresses = remainingUserAddresses.map((addr, index) => {
          let isDefaultShipping = addr.isDefaultShipping;
          let isDefaultBilling = addr.isDefaultBilling;

          if (reassignShipping && index === 0) {
            isDefaultShipping = true;
            reassignShipping = false;
          }
          if (reassignBilling && index === 0) {
            isDefaultBilling = true;
            reassignBilling = false;
          }

          return {
            ...addr,
            isDefaultShipping,
            isDefaultBilling,
          };
        });

        const otherUsersAddresses = currentList.filter(
          (a) => a.userId !== effectiveUserId
        );

        set({
          addresses: [...updatedUserAddresses, ...otherUsersAddresses],
        });
        return true;
      },

      setDefaultShipping: (id: string, userId = "u-user-1") => {
        const effectiveUserId = userId || "u-user-1";
        set((state) => ({
          addresses: state.addresses.map((a) => {
            if (a.userId !== effectiveUserId) return a;
            return {
              ...a,
              isDefaultShipping: a.id === id,
            };
          }),
        }));
      },

      setDefaultBilling: (id: string, userId = "u-user-1") => {
        const effectiveUserId = userId || "u-user-1";
        set((state) => ({
          addresses: state.addresses.map((a) => {
            if (a.userId !== effectiveUserId) return a;
            return {
              ...a,
              isDefaultBilling: a.id === id,
            };
          }),
        }));
      },
    }),
    {
      name: "stone-customer-addresses-storage",
    }
  )
);
