"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, MessageSquareText, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/auth";
import {
  mockOrders,
  mockFavorites,
  orderStatusLabel,
  orderStatusVariant,
  orderStatusMeta,
} from "../data/mock-data";
import { useInquiryStore } from "../stores/inquiry-store";

/**
 * Customer Dashboard Overview (skill: Customer Dashboard §4).
 *
 * Top: 3 summary KPI cards (in-progress orders, unanswered inquiries,
 * favorites count). Below: latest orders list with product thumbnail,
 * stone name, tenant name, and a colored status badge. Each row links to
 * the order detail.
 *
 * User isolation (skill §9 rule 3): only orders with
 * order.ownerId === currentUser.id are shown — enforced here on mock data
 * so IDOR bugs surface before the backend exists.
 */
export function Overview() {
  const { user } = useAuth();
  const currentUserId = user?.id || "u-user-1";
  const { getUserInquiries } = useInquiryStore();

  // Owner-scoped data — a USER only ever sees their own resources.
  const orders = mockOrders.filter((o) => o.ownerId === currentUserId);
  const inquiries = getUserInquiries(currentUserId);
  const favorites = mockFavorites.filter((f) => f.ownerId === currentUserId);

  const inProgress = orders.filter((o) => {
    const cat = orderStatusMeta[o.status]?.category;
    return cat === "processing" || cat === "shipping";
  }).length;
  const unanswered = inquiries.filter(
    (i) => i.status === "PENDING" || i.status === "IN_REVIEW"
  ).length;

  // Recent orders with processing orders prioritized at the top
  const recentOrders = [...orders]
    .sort((a, b) => {
      const getPriority = (order: (typeof orders)[number]) => {
        if (order.status === "processing") return 2;
        if (orderStatusMeta[order.status]?.category === "processing") return 1;
        return 0;
      };
      const prioA = getPriority(a);
      const prioB = getPriority(b);
      if (prioA !== prioB) return prioB - prioA;

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">خلاصه‌ی حساب کاربری</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          خوش آمدید، {user?.name ?? "کاربر گرامی"}.
        </p>
      </div>

      {/* Summary KPI cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>سفارش در حال پیگیری</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {inProgress.toLocaleString("fa-IR")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
            از مجموع {orders.length.toLocaleString("fa-IR")} سفارش
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>استعلام بی‌پاسخ</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {unanswered.toLocaleString("fa-IR")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
            از مجموع {inquiries.length.toLocaleString("fa-IR")} استعلام
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>تعداد علاقه‌مندی‌ها</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {favorites.length.toLocaleString("fa-IR")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            محصول ذخیره‌شده
          </CardContent>
        </Card>
      </div>

      {/* Latest orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>آخرین سفارش‌ها</CardTitle>
            <CardDescription>
              برای مشاهده‌ی جزئیات روی هر ردیف کلیک کنید.
            </CardDescription>
          </div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            مشاهده‌ی همه
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center gap-4 py-3 transition-colors hover:bg-muted/40 -mx-6 px-6"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="h-12 w-12 shrink-0 rounded-lg border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {order.productName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {order.tenantName}
                  </p>
                </div>
                <Badge
                  variant={orderStatusVariant[order.status]}
                  className="shrink-0"
                >
                  {orderStatusLabel[order.status]}
                </Badge>
              </Link>
            ))}
            {recentOrders.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                سفارشی ثبت نشده است.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
