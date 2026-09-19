"use client";

import { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Send,
  Printer,
  Clock,
  MapPin,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Layers,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Phone,
  LayoutGrid,
  ListFilter,
  FileCheck2,
  FileText,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/auth";
import { toast } from "sonner";
import { useFactoryInquiriesStore } from "../stores/factory-inquiries-store";
import type { FactoryInquiryItem, InquiryStatus, CustomerRole, StoneCategory } from "../types";
import { InquiryDetailDialog } from "./inquiry-detail-dialog";
import { InquiryQuoteDialog } from "./inquiry-quote-dialog";
import { InquiryPrintPreviewDialog } from "./inquiry-print-preview-dialog";
import { NewInquiryDialog } from "./new-inquiry-dialog";

type TabStatus = "all" | InquiryStatus;

export function InquiriesManagerView() {
  const { user } = useAuth();
  const activeTenantId = user?.tenantId ?? "tenant-001";

  const inquiries = useFactoryInquiriesStore((s) => s.inquiries);
  const getStats = useFactoryInquiriesStore((s) => s.getStats);
  const acceptInquiry = useFactoryInquiriesStore((s) => s.acceptInquiry);
  const rejectInquiry = useFactoryInquiriesStore((s) => s.rejectInquiry);

  // Tenant-scoped inquiries
  const tenantInquiries = useMemo(() => {
    return inquiries.filter(
      (inq) =>
        inq.tenantId === activeTenantId || (!inq.tenantId && activeTenantId === "tenant-001")
    );
  }, [inquiries, activeTenantId]);

  const stats = useMemo(() => {
    return getStats(activeTenantId);
  }, [getStats, activeTenantId, inquiries]);

  // Dialog States
  const [selectedInquiry, setSelectedInquiry] = useState<FactoryInquiryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [quoteInquiry, setQuoteInquiry] = useState<FactoryInquiryItem | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const [printInquiry, setPrintInquiry] = useState<FactoryInquiryItem | null>(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const [isNewInquiryOpen, setIsNewInquiryOpen] = useState(false);

  // Reject Dialog State
  const [rejectInquiryItem, setRejectInquiryItem] = useState<FactoryInquiryItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [stoneFilter, setStoneFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "volume_high" | "quote_high">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = {
      all: tenantInquiries.length,
      pending: 0,
      quoted: 0,
      approved: 0,
      rejected: 0,
    };

    tenantInquiries.forEach((item) => {
      if (item.status === "pending") counts.pending += 1;
      if (item.status === "quoted") counts.quoted += 1;
      if (item.status === "approved") counts.approved += 1;
      if (item.status === "rejected") counts.rejected += 1;
    });

    return counts;
  }, [tenantInquiries]);

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return tenantInquiries
      .filter((inq) => {
        // Status Tab
        if (activeTab !== "all" && inq.status !== activeTab) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNumber = inq.rfqNumber.toLowerCase().includes(q);
          const matchCustomer = inq.customerName.toLowerCase().includes(q);
          const matchStone = inq.stoneTitle.toLowerCase().includes(q);
          const matchProject = inq.projectName.toLowerCase().includes(q);
          const matchCity = inq.projectCity.toLowerCase().includes(q);
          const matchPhone = inq.customerPhone.includes(q);

          if (
            !matchNumber &&
            !matchCustomer &&
            !matchStone &&
            !matchProject &&
            !matchCity &&
            !matchPhone
          ) {
            return false;
          }
        }

        // Role filter
        if (roleFilter !== "all" && inq.customerRole !== roleFilter) return false;

        // Stone filter
        if (stoneFilter !== "all" && inq.stoneType !== stoneFilter) return false;

        // Urgency filter
        if (urgencyFilter === "high" && inq.urgency !== "high") return false;
        if (urgencyFilter === "normal" && inq.urgency !== "normal") return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "volume_high") {
          return (b.volumeNumber || 0) - (a.volumeNumber || 0);
        }
        if (sortBy === "quote_high") {
          const priceA = a.quotation?.finalPrice || 0;
          const priceB = b.quotation?.finalPrice || 0;
          return priceB - priceA;
        }
        // default newest
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
  }, [tenantInquiries, activeTab, searchQuery, roleFilter, stoneFilter, urgencyFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setRoleFilter("all");
    setStoneFilter("all");
    setUrgencyFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    activeTab !== "all" ||
    roleFilter !== "all" ||
    stoneFilter !== "all" ||
    urgencyFilter !== "all" ||
    sortBy !== "newest";

  // Actions
  const handleOpenDetail = (inq: FactoryInquiryItem) => {
    setSelectedInquiry(inq);
    setIsDetailOpen(true);
  };

  const handleOpenQuote = (inq: FactoryInquiryItem) => {
    setQuoteInquiry(inq);
    setIsQuoteOpen(true);
  };

  const handleOpenPrint = (inq: FactoryInquiryItem) => {
    setPrintInquiry(inq);
    setIsPrintOpen(true);
  };

  const handleAccept = (inq: FactoryInquiryItem) => {
    acceptInquiry(inq.id);
    toast.success(`استعلام ${inq.rfqNumber} با موفقیت تایید و به سفارش تبدیل شد.`);
  };

  const handleOpenReject = (inq: FactoryInquiryItem) => {
    setRejectInquiryItem(inq);
    setRejectReason("");
    setIsRejectOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectInquiryItem) return;
    rejectInquiry(rejectInquiryItem.id, rejectReason);
    toast.info(`استعلام ${rejectInquiryItem.rfqNumber} بایگانی گردید.`);
    setIsRejectOpen(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-amber-950/10 p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  استعلام‌های قیمت و متراژ پروژه‌ای (RFQ)
                </h1>
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs"
                >
                  {stats.pending} در انتظار بررسی
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                کارتابل متمرکز پاسخ‌گویی به استعلام متراژ معماران، سازندگان و صادرکنندگان سنگ
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-1.5 text-xs bg-primary text-primary-foreground hover:brightness-105 active:scale-[0.98] transition-all"
            onClick={() => setIsNewInquiryOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span>ثبت استعلام جدید</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="border border-border/70 bg-card shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">کل استعلام‌ها</span>
              <span className="text-xl font-bold text-foreground font-mono">
                {stats.total.toLocaleString("fa-IR")}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-500/30 bg-amber-500/5 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-amber-800 dark:text-amber-300 block font-medium">
                در انتظار مظنه
              </span>
              <span className="text-xl font-bold text-amber-900 dark:text-amber-200 font-mono">
                {stats.pending.toLocaleString("fa-IR")}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-sky-500/30 bg-sky-500/5 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-sky-800 dark:text-sky-300 block font-medium">
                پیش‌فاکتور صادر شده
              </span>
              <span className="text-xl font-bold text-sky-900 dark:text-sky-200 font-mono">
                {stats.quoted.toLocaleString("fa-IR")}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-700 dark:text-sky-400">
              <Send className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-500/30 bg-emerald-500/5 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 block font-medium">
                تأیید و عقد قرارداد
              </span>
              <span className="text-xl font-bold text-emerald-900 dark:text-emerald-200 font-mono">
                {stats.approved.toLocaleString("fa-IR")}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card shadow-2xs col-span-2 lg:col-span-1">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">مجموع متراژ استعلامی</span>
              <span className="text-lg font-bold text-foreground font-mono">
                {stats.totalVolumeSqm.toLocaleString("fa-IR")}{" "}
                <span className="text-xs font-normal text-muted-foreground">مترمربع</span>
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Layers className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Search Filter Toolbar */}
      <div className="space-y-3">
        {/* Status Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab("all")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span>همه موارد</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "all" ? "bg-primary-foreground/20 text-white" : "bg-card text-muted-foreground"
                }`}
              >
                {tabCounts.all}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === "pending"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span>در انتظار قیمت‌گذاری</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "pending"
                    ? "bg-white/20 text-white"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                }`}
              >
                {tabCounts.pending}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("quoted")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === "quoted"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span>پیش‌فاکتور صادر شده</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "quoted"
                    ? "bg-white/20 text-white"
                    : "bg-sky-500/15 text-sky-700 dark:text-sky-400"
                }`}
              >
                {tabCounts.quoted}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("approved")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === "approved"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span>تأیید شده / قرارداد</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "approved"
                    ? "bg-white/20 text-white"
                    : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                }`}
              >
                {tabCounts.approved}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("rejected")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === "rejected"
                  ? "bg-destructive text-destructive-foreground shadow-xs"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span>بایگانی / رد شده</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "rejected"
                    ? "bg-white/20 text-white"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {tabCounts.rejected}
              </span>
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 border border-border/80 rounded-lg p-0.5 bg-card">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setViewMode("grid")}
              title="نمایش کارتی"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setViewMode("table")}
              title="نمایش جدولی"
            >
              <ListFilter className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Search and Secondary Filter Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در کد استعلام، نام معمار، پروژه، نوع سنگ یا شهر..."
              className="ps-9 h-9 text-xs bg-card"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Customer Role filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5">
                  <Filter className="h-3 w-3 text-muted-foreground" />
                  <span>نقش: {roleFilter === "all" ? "همه" : roleFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem onClick={() => setRoleFilter("all")}>همه نقش‌ها</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("معمار")}>معمار</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("طراح داخلی")}>طراح داخلی</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("پیمانکار")}>پیمانکار</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("انبوه‌ساز")}>انبوه‌ساز</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("صادرکننده")}>صادرکننده</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Stone family filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5">
                  <Layers className="h-3 w-3 text-muted-foreground" />
                  <span>سنگ: {stoneFilter === "all" ? "همه" : stoneFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem onClick={() => setStoneFilter("all")}>همه سنگ‌ها</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStoneFilter("مرمریت")}>مرمریت</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStoneFilter("تراورتن")}>تراورتن</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStoneFilter("گرانیت")}>گرانیت</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStoneFilter("آنیکس")}>آنیکس (مرمر)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStoneFilter("چینی و کریستال")}>
                  چینی و کریستال
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Urgency filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5">
                  <span>
                    اولویت:{" "}
                    {urgencyFilter === "all"
                      ? "همه"
                      : urgencyFilter === "high"
                      ? "فوری و ویژه"
                      : "عادی"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem onClick={() => setUrgencyFilter("all")}>همه اولویت‌ها</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUrgencyFilter("high")}>فوری و ویژه</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUrgencyFilter("normal")}>عادی</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5">
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  <span>
                    {sortBy === "newest"
                      ? "جدیدترین"
                      : sortBy === "volume_high"
                      ? "بیشترین متراژ"
                      : "بیشترین مبلغ"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem onClick={() => setSortBy("newest")}>جدیدترین</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("volume_high")}>
                  بیشترین متراژ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("quote_high")}>
                  بیشترین مبلغ پیش‌فاکتور
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs gap-1 text-muted-foreground hover:text-foreground"
                onClick={clearFilters}
              >
                <RotateCcw className="h-3 w-3" />
                <span>پاک‌سازی</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInquiries.map((inq) => (
            <Card
              key={inq.id}
              className="border border-border/80 bg-card hover:border-primary/40 transition-all duration-200 shadow-2xs hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="p-4 pb-3 border-b border-border/60">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-[11px] text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                          {inq.rfqNumber}
                        </span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {inq.customerRole}
                        </Badge>
                        {inq.urgency === "high" && (
                          <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            فوری
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-foreground line-clamp-1">
                        {inq.stoneTitle}
                      </h3>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {inq.customerName} {inq.customerCompany ? `• ${inq.customerCompany}` : ""}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {inq.status === "pending" && (
                        <Badge
                          variant="outline"
                          className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-400/30 text-[10px]"
                        >
                          در انتظار قیمت
                        </Badge>
                      )}
                      {inq.status === "quoted" && (
                        <Badge
                          variant="outline"
                          className="bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30 text-[10px]"
                        >
                          مظنه صادر شد
                        </Badge>
                      )}
                      {inq.status === "approved" && (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]"
                        >
                          قرارداد شد
                        </Badge>
                      )}
                      {inq.status === "rejected" && (
                        <Badge
                          variant="outline"
                          className="bg-destructive/15 text-destructive border-destructive/30 text-[10px]"
                        >
                          رد شد
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Content & Specs */}
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="rounded bg-secondary/70 px-2 py-0.5 font-bold text-foreground border border-border/50">
                      حجم: {inq.volume}
                    </span>
                    <span className="rounded bg-secondary/50 px-2 py-0.5 border border-border/50 text-muted-foreground">
                      ضخامت: {inq.thickness}
                    </span>
                    <span className="rounded bg-secondary/50 px-2 py-0.5 border border-border/50 text-muted-foreground">
                      فینیش: {inq.finish}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Building2 className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <span className="truncate">{inq.projectName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {inq.projectCity}
                      </span>
                      <a
                        href={`tel:${inq.customerPhone}`}
                        className="font-mono text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {inq.customerPhone}
                      </a>
                    </div>
                  </div>

                  {inq.notes && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 bg-secondary/30 p-2 rounded-lg border border-border/40">
                      {inq.notes}
                    </p>
                  )}

                  {/* Quoted Preview Banner */}
                  {inq.quotation && (
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block">
                          مبلغ پیش‌فاکتور:
                        </span>
                        <span className="font-bold text-emerald-900 dark:text-emerald-200 font-mono">
                          {(inq.quotation.finalPrice / 1_000_000).toLocaleString("fa-IR")} میلیون تومان
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        تحویل: {inq.quotation.deliveryLeadDays} روزه
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-secondary/20 border-t border-border/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {inq.createdAt}
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleOpenDetail(inq)}
                    title="مشاهده جزئیات کامل"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>

                  {inq.status === "quoted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs gap-1"
                      onClick={() => handleOpenPrint(inq)}
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>چاپ</span>
                    </Button>
                  )}

                  {inq.status === "pending" && (
                    <Button
                      size="sm"
                      className="h-7 px-2.5 text-xs gap-1 bg-primary text-primary-foreground hover:brightness-105"
                      onClick={() => handleOpenQuote(inq)}
                    >
                      <Send className="h-3 w-3" />
                      <span>اعلام قیمت</span>
                    </Button>
                  )}

                  {inq.status === "quoted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-xs gap-1 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                      onClick={() => handleAccept(inq)}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>تأیید قرارداد</span>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="border border-border/80 bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/40 text-muted-foreground">
                  <th className="p-3 font-semibold">کد RFQ</th>
                  <th className="p-3 font-semibold">متقاضی و پروژه</th>
                  <th className="p-3 font-semibold">سنگ و ابعاد</th>
                  <th className="p-3 font-semibold">حجم / متراژ</th>
                  <th className="p-3 font-semibold">وضعیت</th>
                  <th className="p-3 font-semibold">مبلغ مظنه</th>
                  <th className="p-3 font-semibold">تاریخ</th>
                  <th className="p-3 font-semibold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className="hover:bg-secondary/20 transition-colors cursor-pointer"
                    onClick={() => handleOpenDetail(inq)}
                  >
                    <td className="p-3 font-mono font-bold text-primary">
                      {inq.rfqNumber}
                      {inq.urgency === "high" && (
                        <span className="ms-1.5 inline-block text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                          [فوری]
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-foreground">{inq.customerName}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {inq.projectName} ({inq.projectCity})
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-foreground">{inq.stoneTitle}</div>
                      <div className="text-[11px] text-muted-foreground">
                        فینیش: {inq.finish} • {inq.thickness}
                      </div>
                    </td>
                    <td className="p-3 font-bold text-foreground">{inq.volume}</td>
                    <td className="p-3">
                      {inq.status === "pending" && (
                        <Badge
                          variant="outline"
                          className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-400/30 text-[10px]"
                        >
                          در انتظار قیمت
                        </Badge>
                      )}
                      {inq.status === "quoted" && (
                        <Badge
                          variant="outline"
                          className="bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30 text-[10px]"
                        >
                          مظنه صادر شد
                        </Badge>
                      )}
                      {inq.status === "approved" && (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]"
                        >
                          قرارداد شد
                        </Badge>
                      )}
                      {inq.status === "rejected" && (
                        <Badge
                          variant="outline"
                          className="bg-destructive/15 text-destructive border-destructive/30 text-[10px]"
                        >
                          رد شد
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 font-mono font-semibold">
                      {inq.quotation?.finalPrice
                        ? `${(inq.quotation.finalPrice / 1_000_000).toLocaleString("fa-IR")} م.ت`
                        : "—"}
                    </td>
                    <td className="p-3 text-[11px] text-muted-foreground">{inq.createdAt}</td>
                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => handleOpenDetail(inq)}
                          title="مشاهده"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {inq.status === "pending" && (
                          <Button
                            size="sm"
                            className="h-7 text-xs px-2 gap-1 bg-primary text-primary-foreground"
                            onClick={() => handleOpenQuote(inq)}
                          >
                            <Send className="h-3 w-3" />
                            <span>مظنه</span>
                          </Button>
                        )}
                        {inq.status === "quoted" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs px-2 gap-1"
                            onClick={() => handleOpenPrint(inq)}
                          >
                            <Printer className="h-3 w-3" />
                            <span>چاپ</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredInquiries.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-card/50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">هیچ استعلامی مطابق فیلتر یافت نشد</h3>
            <p className="text-xs text-muted-foreground">
              می‌توانید فیلترها را بازنشانی نموده یا استعلام جدیدی ثبت نمایید.
            </p>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" className="text-xs mt-2" onClick={clearFilters}>
              پاک کردن فیلترها
            </Button>
          )}
        </div>
      )}

      {/* Dialogs */}
      <InquiryDetailDialog
        inquiry={selectedInquiry}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onOpenQuote={handleOpenQuote}
        onOpenPrint={handleOpenPrint}
        onAccept={handleAccept}
        onReject={handleOpenReject}
      />

      <InquiryQuoteDialog
        inquiry={quoteInquiry}
        open={isQuoteOpen}
        onOpenChange={setIsQuoteOpen}
      />

      <InquiryPrintPreviewDialog
        inquiry={printInquiry}
        open={isPrintOpen}
        onOpenChange={setIsPrintOpen}
      />

      <NewInquiryDialog
        open={isNewInquiryOpen}
        onOpenChange={setIsNewInquiryOpen}
        tenantId={activeTenantId}
      />

      {/* Reject Reason Confirmation Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="max-w-md border-border/80 bg-card text-card-foreground" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              رد یا بایگانی استعلام {rejectInquiryItem?.rfqNumber}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              لطفاً علت عدم توافق یا عدم امکان تامین سنگ را جهت ثبت در پرونده وارد نمایید:
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="مثلاً عدم موجودی کوپ خام در معدن، زمان تحویل کوتاه یا شرایط پرداخت غیرقابل قبول..."
              className="text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsRejectOpen(false)}>
              انصراف
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs"
              onClick={handleConfirmReject}
            >
              تایید و رد استعلام
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
