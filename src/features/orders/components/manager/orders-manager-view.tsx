"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  FileText,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Building2,
  Phone,
  Flame,
  Hammer,
  PackageCheck,
  Printer,
  ExternalLink,
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
import { useAuth } from "@/auth";
import {
  useFactoryOrdersStore,
  type ExtendedFactoryOrder,
  FACTORY_STATUS_LABELS,
} from "../../stores/factory-orders-store";
import { OrderQuickViewDialog } from "./order-quick-view-dialog";
import { OrderStatusUpdateDialog } from "./order-status-update-dialog";
import { OrderWaybillDialog } from "./order-waybill-dialog";
import type { FactoryOrder } from "@/features/manager/types";

type TabCategory =
  | "all"
  | "sourcing"
  | "in_production"
  | "ready_to_ship"
  | "shipping"
  | "delivered"
  | "cancelled";

const STATUS_CONFIG: Record<
  FactoryOrder["status"],
  { label: string; badgeClass: string; icon: typeof Clock }
> = {
  sourcing: {
    label: "تأمین کوپ خام",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: Flame,
  },
  cutting: {
    label: "برش اسلب / تایل",
    badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
    icon: Hammer,
  },
  processing_surface: {
    label: "ساب و رزین نانو",
    badgeClass: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
    icon: Clock,
  },
  ready_to_ship: {
    label: "آماده بارگیری",
    badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    icon: PackageCheck,
  },
  shipping: {
    label: "در حال ترابری تریلی",
    badgeClass: "bg-primary/15 text-primary border-primary/30",
    icon: Truck,
  },
  delivered: {
    label: "تحویل کارگاه شد",
    badgeClass: "bg-secondary text-secondary-foreground border-border",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "لغو شده",
    badgeClass: "bg-destructive/15 text-destructive border-destructive/30",
    icon: AlertCircle,
  },
};

export function OrdersManagerView() {
  const { user } = useAuth();
  const activeTenantId = user?.tenantId ?? "tenant-001";

  const orders = useFactoryOrdersStore((s) => s.orders);
  const getStats = useFactoryOrdersStore((s) => s.getStats);

  // Scoped orders for tenant
  const tenantOrders = useMemo(() => {
    return orders.filter(
      (o) => o.tenantId === activeTenantId || (!o.tenantId && activeTenantId === "tenant-001")
    );
  }, [orders, activeTenantId]);

  const stats = useMemo(() => {
    return getStats(activeTenantId);
  }, [getStats, activeTenantId, orders]);

  // Dialog states
  const [quickViewOrder, setQuickViewOrder] = useState<ExtendedFactoryOrder | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [statusUpdateOrder, setStatusUpdateOrder] = useState<ExtendedFactoryOrder | null>(null);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);

  const [waybillOrder, setWaybillOrder] = useState<ExtendedFactoryOrder | null>(null);
  const [isWaybillOpen, setIsWaybillOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabCategory>("all");
  const [selectedForm, setSelectedForm] = useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "price_high" | "price_low">("newest");

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = {
      all: tenantOrders.length,
      sourcing: 0,
      in_production: 0,
      ready_to_ship: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };

    tenantOrders.forEach((o) => {
      if (o.status === "sourcing") counts.sourcing += 1;
      if (o.status === "cutting" || o.status === "processing_surface") counts.in_production += 1;
      if (o.status === "ready_to_ship") counts.ready_to_ship += 1;
      if (o.status === "shipping") counts.shipping += 1;
      if (o.status === "delivered") counts.delivered += 1;
      if (o.status === "cancelled") counts.cancelled += 1;
    });

    return counts;
  }, [tenantOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return tenantOrders
      .filter((order) => {
        // Tab Category Filter
        if (activeTab === "sourcing" && order.status !== "sourcing") return false;
        if (
          activeTab === "in_production" &&
          order.status !== "cutting" &&
          order.status !== "processing_surface"
        )
          return false;
        if (activeTab === "ready_to_ship" && order.status !== "ready_to_ship") return false;
        if (activeTab === "shipping" && order.status !== "shipping") return false;
        if (activeTab === "delivered" && order.status !== "delivered") return false;
        if (activeTab === "cancelled" && order.status !== "cancelled") return false;

        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNumber = order.orderNumber.toLowerCase().includes(q);
          const matchCustomer = order.customerName.toLowerCase().includes(q);
          const matchProduct = order.productName.toLowerCase().includes(q);
          const matchPhone = order.customerPhone?.toLowerCase().includes(q) ?? false;
          const matchCity = order.destinationCity?.toLowerCase().includes(q) ?? false;
          const matchProject = order.projectName?.toLowerCase().includes(q) ?? false;
          const matchTracking = order.delivery?.trackingNumber?.toLowerCase().includes(q) ?? false;

          if (
            !matchNumber &&
            !matchCustomer &&
            !matchProduct &&
            !matchPhone &&
            !matchCity &&
            !matchProject &&
            !matchTracking
          ) {
            return false;
          }
        }

        // Stone Form Filter
        if (selectedForm !== "all" && order.form !== selectedForm) return false;

        // Urgency Filter
        if (selectedUrgency === "urgent" && !order.isUrgent) return false;
        if (selectedUrgency === "normal" && order.isUrgent) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_high") return b.totalPrice - a.totalPrice;
        if (sortBy === "price_low") return a.totalPrice - b.totalPrice;
        // Default newest
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
  }, [tenantOrders, activeTab, searchQuery, selectedForm, selectedUrgency, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setSelectedForm("all");
    setSelectedUrgency("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    activeTab !== "all" ||
    selectedForm !== "all" ||
    selectedUrgency !== "all" ||
    sortBy !== "newest";

  const handleOpenQuickView = (order: ExtendedFactoryOrder) => {
    setQuickViewOrder(order);
    setIsQuickViewOpen(true);
  };

  const handleOpenStatusUpdate = (order: ExtendedFactoryOrder) => {
    setStatusUpdateOrder(order);
    setIsStatusUpdateOpen(true);
  };

  const handleOpenWaybill = (order: ExtendedFactoryOrder) => {
    setWaybillOrder(order);
    setIsWaybillOpen(true);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-amber-950/10 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              مدیریت سفارش‌ها و خط تولید کارخانه
            </h1>
            <Badge
              variant="outline"
              className="border-amber-600/30 bg-amber-500/10 text-[10px] font-bold text-amber-700 dark:text-amber-400"
            >
              {tenantOrders.length} سفارش ثبت‌شده
            </Badge>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-2xl leading-relaxed">
            رهگیری دقیق مراحل برش اسلب، تایل، فرآوری ساب نانو، بسته‌بندی در پالت‌های مقاوم و صدور بارنامه حمل سنگ.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5 text-xs shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>چاپ گزارش سفارشات</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Orders */}
        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-muted-foreground">
            کل سفارش‌های جاری
          </span>
          <p className="mt-1 text-xl font-bold text-foreground tabular-nums">
            {stats.totalOrders.toLocaleString("fa-IR")}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>{stats.deliveredCount} تحویل‌شده</span>
            <span>·</span>
            <span>{stats.totalOrders - stats.deliveredCount} فعال</span>
          </div>
        </Card>

        {/* In Production */}
        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-muted-foreground">
            در حال برش و فرآوری
          </span>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xl font-bold text-sky-700 dark:text-sky-400 tabular-nums">
              {stats.inProductionCount.toLocaleString("fa-IR")}
            </p>
            <Badge variant="outline" className="text-[10px] bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30">
              خط تولید
            </Badge>
          </div>
          <span className="mt-1 block text-[10px] text-muted-foreground">
            {stats.inProductionSqm.toLocaleString("fa-IR")} مترمربع در کارگاه
          </span>
        </Card>

        {/* Ready to Ship */}
        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-muted-foreground">
            آماده بارگیری و پالت
          </span>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {stats.readyToShipCount.toLocaleString("fa-IR")}
            </p>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
              پالت A-Frame
            </Badge>
          </div>
          <span className="mt-1 block text-[10px] text-muted-foreground">
            آماده اعزام تریلی و باربری
          </span>
        </Card>

        {/* Total Revenue */}
        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-muted-foreground">
            مجموع ارزش ریالی
          </span>
          <p className="mt-1 text-xl font-bold text-foreground tabular-nums truncate">
            {(stats.totalSalesValue / 1_000_000).toLocaleString("fa-IR")} م.ت
          </p>
          <span className="mt-1 block text-[10px] text-muted-foreground">
            ارزش فاکتور سفارش‌های سنگ
          </span>
        </Card>

        {/* Urgent Orders */}
        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-medium text-muted-foreground">
            سفارش‌های اولویت‌دار فوری
          </span>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xl font-bold text-destructive tabular-nums">
              {stats.urgentCount.toLocaleString("fa-IR")}
            </p>
            {stats.urgentCount > 0 ? (
              <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/30">
                اقدام فوری
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] bg-secondary text-muted-foreground">
                روال عادی
              </Badge>
            )}
          </div>
          <span className="mt-1 block text-[10px] text-muted-foreground">
            پروژه‌های با فوریت بالا
          </span>
        </Card>
      </div>

      {/* Production Stage Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: "all", label: "همه سفارش‌ها", count: tabCounts.all },
          { id: "sourcing", label: "تأمین کوپ", count: tabCounts.sourcing },
          { id: "in_production", label: "برش و فرآوری", count: tabCounts.in_production },
          { id: "ready_to_ship", label: "آماده بارگیری", count: tabCounts.ready_to_ship },
          { id: "shipping", label: "در حال حمل", count: tabCounts.shipping },
          { id: "delivered", label: "تحویل‌شده", count: tabCounts.delivered },
          { id: "cancelled", label: "لغو شده", count: tabCounts.cancelled },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabCategory)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card border border-border/70 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono tabular-nums ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی شماره سفارش، خریدار، نوع سنگ، بارنامه..."
            className="ps-9 text-xs h-9 bg-secondary/40"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Stone Form */}
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs ring-offset-background"
          >
            <option value="all">همه فرم‌های سنگ</option>
            <option value="اسلب">اسلب</option>
            <option value="تایل">تایل</option>
            <option value="پله">پله و زیرپله</option>
            <option value="کوپ خام">کوپ خام</option>
          </select>

          {/* Urgency */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs ring-offset-background"
          >
            <option value="all">همه اولویت‌ها</option>
            <option value="urgent">فقط سفارشات فوری</option>
            <option value="normal">سفارشات عادی</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs ring-offset-background"
          >
            <option value="newest">جدیدترین سفارش‌ها</option>
            <option value="price_high">بیشترین مبلغ فاکتور</option>
            <option value="price_low">کمترین مبلغ فاکتور</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-xs text-muted-foreground hover:text-foreground h-8 px-2"
            >
              <RotateCcw className="h-3 w-3" />
              <span>پاکسازی</span>
            </Button>
          )}
        </div>
      </div>

      {/* Orders Data Table */}
      <Card className="border border-border/80 bg-card shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-border/70 bg-secondary/30 text-muted-foreground">
                <th className="py-3 pe-4 ps-4 text-start font-medium">مشخصات سنگ و سفارش</th>
                <th className="py-3 px-3 text-start font-medium">خریدار و پروژه</th>
                <th className="py-3 px-3 text-start font-medium">ابعاد و فرم</th>
                <th className="py-3 px-3 text-start font-medium">متراژ / حجم</th>
                <th className="py-3 px-3 text-start font-medium">مبلغ کل فاکتور</th>
                <th className="py-3 px-3 text-start font-medium">وضعیت خط تولید</th>
                <th className="py-3 px-3 text-start font-medium">ترابری / تحویل</th>
                <th className="py-3 ps-3 pe-4 text-end font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredOrders.map((order) => {
                const statusMeta =
                  STATUS_CONFIG[order.status] ?? {
                    label: order.statusLabel,
                    badgeClass: "bg-secondary text-secondary-foreground",
                    icon: Clock,
                  };
                const StatusIcon = statusMeta.icon;

                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-secondary/40 group"
                  >
                    {/* Stone & Order Identifier */}
                    <td className="py-3 pe-3 ps-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="relative h-12 w-12 shrink-0 rounded-lg border border-border/70 overflow-hidden cursor-pointer group-hover:scale-105 transition-transform"
                          onClick={() => handleOpenQuickView(order)}
                          title="کلیک جهت مشاهده سریع"
                        >
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p
                              className="font-bold text-foreground truncate max-w-56 cursor-pointer hover:text-primary transition-colors"
                              onClick={() => handleOpenQuickView(order)}
                            >
                              {order.productName}
                            </p>
                            {order.isUrgent && (
                              <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                                <AlertCircle className="h-2.5 w-2.5" />
                                فوری
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="text-[11px] text-muted-foreground font-mono font-medium"
                              dir="ltr"
                            >
                              {order.orderNumber}
                            </span>
                            <span className="text-[10px] text-muted-foreground">·</span>
                            <span className="text-[10px] text-muted-foreground">
                              {order.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Customer & Project */}
                    <td className="py-3 px-3">
                      <p className="font-semibold text-foreground truncate max-w-44">
                        {order.customerName}
                      </p>
                      {order.projectName ? (
                        <p className="text-[11px] text-muted-foreground truncate max-w-44">
                          {order.projectName}
                        </p>
                      ) : order.customerPhone ? (
                        <p className="text-[11px] text-muted-foreground font-mono" dir="ltr">
                          {order.customerPhone}
                        </p>
                      ) : null}
                    </td>

                    {/* Dimensions & Form */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block rounded bg-secondary/80 px-2 py-0.5 text-[11px] text-foreground font-medium">
                          {order.form}
                        </span>
                        <span className="text-[11px] text-foreground font-mono">
                          {order.dimensions}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        ضخامت: {order.thickness}
                      </p>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 font-semibold text-foreground tabular-nums">
                      {order.volume}
                    </td>

                    {/* Total Price */}
                    <td className="py-3 px-3 font-bold text-foreground tabular-nums">
                      {order.totalPrice.toLocaleString("fa-IR")} تومان
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold border gap-1 py-0.5 ${statusMeta.badgeClass}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{statusMeta.label}</span>
                      </Badge>
                    </td>

                    {/* Logistics / Carrier */}
                    <td className="py-3 px-3">
                      <p className="text-[11px] font-medium text-foreground truncate max-w-36">
                        {order.delivery?.carrier ?? "باربری مشخص نشده"}
                      </p>
                      {order.delivery?.trackingNumber && (
                        <span className="text-[10px] font-mono text-muted-foreground" dir="ltr">
                          {order.delivery.trackingNumber}
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 ps-3 pe-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenQuickView(order)}
                          className="h-7 w-7 p-0"
                          title="پیش‌نمایش سریع"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-[11px] gap-1 px-2"
                            >
                              <span>اقدامات</span>
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem
                              onClick={() => handleOpenQuickView(order)}
                              className="gap-2 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>مشاهده سریع مشخصات</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleOpenStatusUpdate(order)}
                              className="gap-2 cursor-pointer"
                            >
                              <Clock className="h-3.5 w-3.5 text-amber-600" />
                              <span>تغییر وضعیت خط تولید</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleOpenWaybill(order)}
                              className="gap-2 cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5 text-primary" />
                              <span>چاپ حواله خروج انبار</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                              <Link href={`/dashboard/orders/${order.id}`}>
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>صفحه کامل جزئیات سفارش</span>
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-foreground text-sm">
                        هیچ سفارشی با این مشخصات یافت نشد
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        فیلترهای انتخابی یا عبارت جستجوی خود را تغییر دهید تا سفارشات نمایش داده شوند.
                      </p>
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="mt-2 text-xs gap-1"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>پاکسازی فیلترها</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <OrderQuickViewDialog
        order={quickViewOrder}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onOpenStatusUpdate={handleOpenStatusUpdate}
        onOpenWaybill={handleOpenWaybill}
      />

      <OrderStatusUpdateDialog
        order={statusUpdateOrder}
        isOpen={isStatusUpdateOpen}
        onClose={() => setIsStatusUpdateOpen(false)}
      />

      <OrderWaybillDialog
        order={waybillOrder}
        isOpen={isWaybillOpen}
        onClose={() => setIsWaybillOpen(false)}
      />
    </div>
  );
}
