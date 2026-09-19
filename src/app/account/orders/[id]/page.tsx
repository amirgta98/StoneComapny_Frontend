import type { Metadata } from "next";
import { OrderDetail } from "@/features/account";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `جزئیات سفارش ${id}`,
    description: "مشاهده فاکتور و وضعیت فرآوری و ترابری سفارش سنگ ساختمانی",
  };
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}