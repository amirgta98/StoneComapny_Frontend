import type { Metadata } from "next";
import { SupportChat } from "@/features/account";

type SupportConversationPageProps = {
  params: Promise<{ conversationId: string }>;
};

export async function generateMetadata({
  params,
}: SupportConversationPageProps): Promise<Metadata> {
  const { conversationId } = await params;
  return {
    title: `گفتگوی پشتیبانی ${conversationId} | پنل کاربری`,
    description: "مشاهده تاریخچه پیام‌ها و گفتگو با کارشناسان پشتیبانی کارخانه.",
  };
}

export default async function SupportConversationPage({
  params,
}: SupportConversationPageProps) {
  const { conversationId } = await params;
  return <SupportChat conversationId={conversationId} />;
}
