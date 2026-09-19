"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layouts";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth";
import { toast } from "sonner";
import { useInquiryStore } from "../stores/inquiry-store";
import type { CustomerInquiry, InquiryStatus } from "../types/inquiry";
import { InquiryStats } from "./inquiries/inquiry-stats";
import { InquiryCard } from "./inquiries/inquiry-card";
import { InquiriesEmptyState } from "./inquiries/inquiries-empty-state";
import { CancelInquiryModal } from "./inquiries/cancel-inquiry-modal";

type TabFilter = "all" | "pending" | "responded" | "completed" | "cancelled";

const TAB_CONFIG: { key: TabFilter; label: string }[] = [
  { key: "all", label: "همه استعلام‌ها" },
  { key: "pending", label: "در نوبت کارشناسی" },
  { key: "responded", label: "پاسخ داده شده" },
  { key: "completed", label: "تکمیل‌شده" },
  { key: "cancelled", label: "لغو شده" },
];

export function InquiriesList() {
  const { user } = useAuth();
  const { getUserInquiries, cancelInquiry } = useInquiryStore();

  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cancellingInquiry, setCancellingInquiry] =
    useState<CustomerInquiry | null>(null);

  const currentUserId = user?.id || "u-user-1";
  const userInquiries = getUserInquiries(currentUserId);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: userInquiries.length,
      pending: userInquiries.filter(
        (i) => i.status === "PENDING" || i.status === "IN_REVIEW"
      ).length,
      responded: userInquiries.filter(
        (i) => i.status === "RESPONDED" || i.status === "APPROVED"
      ).length,
      completed: userInquiries.filter((i) => i.status === "COMPLETED").length,
      cancelled: userInquiries.filter((i) => i.status === "CANCELLED").length,
    };
  }, [userInquiries]);

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return userInquiries.filter((inquiry) => {
      // Tab filter
      if (activeTab === "pending") {
        if (inquiry.status !== "PENDING" && inquiry.status !== "IN_REVIEW") {
          return false;
        }
      } else if (activeTab === "responded") {
        if (inquiry.status !== "RESPONDED" && inquiry.status !== "APPROVED") {
          return false;
        }
      } else if (activeTab === "completed") {
        if (inquiry.status !== "COMPLETED") return false;
      } else if (activeTab === "cancelled") {
        if (inquiry.status !== "CANCELLED") return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matches =
          inquiry.requestedStoneName.toLowerCase().includes(q) ||
          inquiry.inquiryNumber.toLowerCase().includes(q) ||
          inquiry.stoneType.toLowerCase().includes(q) ||
          (inquiry.quarryOrigin &&
            inquiry.quarryOrigin.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [userInquiries, activeTab, searchQuery]);

  const isFiltered = activeTab !== "all" || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
  };

  const handleConfirmCancel = (id: string, reason: string) => {
    const success = cancelInquiry(id, reason, currentUserId);
    if (success) {
      toast.success("درخواست استعلام با موفقیت لغو گردید");
    } else {
      toast.error("امکان لغو این استعلام وجود ندارد");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="استعلام سنگ"
          description="سنگ موردنظر خود را که در سایت موجود نیست، برای ما ارسال کنید تا بررسی و قیمت آن را به شما اعلام کنیم."
        />

        <Button asChild size="sm" className="gap-1.5 rounded-xl text-xs shrink-0 self-start sm:self-auto">
          <Link href="/account/inquiries/new">
            <Plus className="h-4 w-4" />
            ثبت استعلام جدید
          </Link>
        </Button>
      </div>

      {/* KPI Stats Overview */}
      <InquiryStats inquiries={userInquiries} />

      {/* Filters and Search Bar */}
      <div className="space-y-3.5">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = counts[tab.key] ?? 0;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background/80 text-foreground"
                  )}
                >
                  {count.toLocaleString("fa-IR")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="جستجو در استعلام‌ها (نام سنگ، شناسه رهگیری، معدن)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pe-8 ps-9 text-xs rounded-xl"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute end-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">پاک کردن</span>
            </Button>
          )}
        </div>
      </div>

      {/* Inquiry List */}
      {filteredInquiries.length > 0 ? (
        <div className="space-y-3.5">
          {filteredInquiries.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              onCancelClick={(inq) => setCancellingInquiry(inq)}
            />
          ))}
        </div>
      ) : (
        <InquiriesEmptyState
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* Cancel Confirmation Modal */}
      <CancelInquiryModal
        inquiry={cancellingInquiry}
        isOpen={Boolean(cancellingInquiry)}
        onClose={() => setCancellingInquiry(null)}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
}
