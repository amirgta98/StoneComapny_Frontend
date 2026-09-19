import type { Metadata } from "next";
import { EditAddress } from "@/features/account";

export const metadata: Metadata = {
  title: "ویرایش آدرس | حساب کاربری",
  description: "ویرایش مشخصات آدرس تحویل سنگ و صورت‌حساب",
};

interface EditAddressPageProps {
  params: Promise<{ addressId: string }>;
}

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const { addressId } = await params;
  return <EditAddress addressId={addressId} />;
}
