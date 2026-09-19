import type { Metadata } from "next";
import { InquiryDetail } from "@/features/account";

type InquiryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: InquiryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `جزئیات استعلام سنگ ${id} | پنل کاربری`,
    description: "مشاهده مشخصات سنگ درخواستی، وضعیت کارشناسی و پیشنهاد قیمت فروشگاه.",
  };
}

export default async function InquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  const { id } = await params;
  return <InquiryDetail id={id} />;
}
