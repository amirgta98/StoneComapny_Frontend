"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Headphones, MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/layouts";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { SupportConversationCard } from "./support-conversation-card";
import { useSupportStore } from "../../stores/support-store";
import { supportService } from "../../services/support-service";
import type { SupportStatus } from "../../types/support";
import { cn } from "@/lib/utils";

type FilterTab = "ALL" | SupportStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "ALL", label: "همه" },
  { key: "OPEN", label: "باز" },
  { key: "IN_PROGRESS", label: "در حال پیگیری" },
  { key: "WAITING_USER", label: "منتظر پاسخ شما" },
  { key: "RESPONDED", label: "پاسخ داده شده" },
  { key: "CLOSED", label: "بسته شده" },
  { key: "REJECTED", label: "رد شده" },
];

export function SupportInbox() {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);

  const conversations = useSupportStore((state) => state.conversations);
  const getUserConversations = useSupportStore(
    (state) => state.getUserConversations
  );

  useEffect(() => {
    setIsClient(true);

    // Initial sync from API service
    supportService.fetchConversations().catch(() => {
      // offline/fallback to local store
    });

    // Subscribe to real-time events on inbox
    const unsubscribe = supportService.subscribeToInbox(() => {
      // Re-trigger store update
      useSupportStore.persist.rehydrate();
    });

    return () => unsubscribe();
  }, []);

  const filteredConversations = useMemo(() => {
    return getUserConversations(undefined, activeTab, searchQuery);
  }, [getUserConversations, activeTab, searchQuery, conversations]);

  // Statistics counters
  const stats = useMemo(() => {
    const userConvs = conversations.filter((c) => c.userId === "u-user-1");
    const active = userConvs.filter(
      (c) =>
        c.status === "OPEN" ||
        c.status === "IN_PROGRESS" ||
        c.status === "WAITING_USER" ||
        c.status === "WAITING_SUPPORT" ||
        c.status === "RESPONDED"
    ).length;
    const waitingUser = userConvs.filter((c) => c.status === "WAITING_USER").length;
    const closed = userConvs.filter((c) => c.status === "CLOSED").length;

    return { total: userConvs.length, active, waitingUser, closed };
  }, [conversations]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="پشتیبانی"
          description="گفتگوها و درخواست‌های پشتیبانی خود را مدیریت کنید."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-muted/40 animate-pulse"
            />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header with New Request CTA */}
      <PageHeader
        title="پشتیبانی"
        description="گفتگوها و درخواست‌های پشتیبانی خود را مدیریت کنید."
      >
        <Button
          asChild
          className="h-10 gap-2 rounded-xl text-xs font-semibold px-4 shadow-sm active:scale-[0.98] transition-all"
        >
          <Link href="/account/support/new">
            <Plus className="h-4 w-4" />
            شروع گفتگوی جدید
          </Link>
        </Button>
      </PageHeader>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="rounded-2xl border-border/70 bg-card p-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium">
                کل گفتگوها
              </p>
              <p className="text-lg font-bold text-foreground">
                {stats.total.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card p-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium">
                در جریان و فعال
              </p>
              <p className="text-lg font-bold text-foreground">
                {stats.active.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card p-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium">
                منتظر پاسخ شما
              </p>
              <p className="text-lg font-bold text-foreground">
                {stats.waitingUser.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card p-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium">
                بسته یا حل شده
              </p>
              <p className="text-lg font-bold text-foreground">
                {stats.closed.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در عنوان گفتگو، شناسه (مثال: SUP-1403) یا متن پیام..."
            className="ps-10 h-11 text-xs rounded-xl bg-card border-border/70"
          />
        </div>

        {/* Scrollable Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversations List / Empty State */}
      {filteredConversations.length > 0 ? (
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <SupportConversationCard
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </div>
      ) : (
        <Card className="border border-dashed border-border rounded-2xl bg-card/50 p-8 sm:p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground mb-4">
            <Headphones className="h-8 w-8 text-primary/80" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-foreground">
            هنوز گفتگویی با پشتیبانی ندارید
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            برای دریافت راهنمایی یا پیگیری درخواست خود، یک گفتگوی جدید ایجاد کنید.
            کارشناسان ما در سریع‌ترین زمان پاسخگوی شما خواهند بود.
          </p>

          <div className="mt-6">
            <Button asChild className="rounded-xl text-xs gap-2 px-5">
              <Link href="/account/support/new">
                <Plus className="h-4 w-4" />
                شروع گفتگوی جدید
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
