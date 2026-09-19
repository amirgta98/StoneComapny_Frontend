"use client";

import { useMemo, useState } from "react";
import {
  Package,
  Layers,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/auth";
import { useOrdersStore } from "@/features/orders";
import {
  mockOrders,
  type OrderCategory,
  orderStatusMeta,
} from "../data/mock-data";
import { OrderAccordionItem } from "./orders/order-accordion-item";
import { OrderFilterBar, type OrderSortOption } from "./orders/order-filter-bar";
import { OrderEmptyState } from "./orders/order-empty-state";

/**
 * Customer stone orders list (Redesigned with Accordion architecture).
 *
 * Specifically designed for natural stone commerce:
 * - Expandable/collapsible accordion cards per order with global expand/collapse all toggle.
 * - Comprehensive stone lifecycle statuses (cutting, processing, ready, shipping, delivered).
 * - Multi-item stone orders with dimensions, thickness, surface finish, and units.
 * - Industrial logistics & transportation metadata (packaging, freight bill, crane/forklift access).
 * - Visual milestone progress timeline.
 * - Category filter tabs, supplier filter, sorting (date & price), and instant search.
 * - Integrated freight bill tracking modal & order cancellation/return request dialogs.
 * - Owner-scoped (user only sees their own orders).
 */
export function OrdersList() {
  const { user } = useAuth();
  const allOrders = useOrdersStore((s) => s.orders);
  const [activeCategory, setActiveCategory] = useState<OrderCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<OrderSortOption>("newest");

  // Owner-scoped orders
  const userOrders = useMemo(() => {
    const currentUserId = user?.id || "u-user-1";
    const source = allOrders.length > 0 ? allOrders : mockOrders;
    return source.filter((o) => o.ownerId === currentUserId);
  }, [user?.id, allOrders]);

  // Track expanded accordion items (defaulting the active processing order or first order as expanded)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    if (userOrders.length > 0) {
      const processingOrder =
        userOrders.find((o) => o.status === "processing") ||
        userOrders.find((o) => orderStatusMeta[o.status]?.category === "processing") ||
        userOrders[0];
      return processingOrder ? { [processingOrder.id]: true } : {};
    }
    return {};
  });

  const toggleOrderItem = (orderId: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Category counts
  const counts = useMemo(() => {
    const res: Record<OrderCategory, number> = {
      all: userOrders.length,
      processing: 0,
      shipping: 0,
      completed: 0,
      cancelled: 0,
    };

    userOrders.forEach((o) => {
      const meta = orderStatusMeta[o.status];
      const cat = meta?.category ?? "processing";
      if (res[cat] !== undefined) {
        res[cat] += 1;
      }
    });

    return res;
  }, [userOrders]);

  // Filtered and sorted orders
  const processedOrders = useMemo(() => {
    // 1. Filter
    const filtered = userOrders.filter((order) => {
      // Category Filter
      if (activeCategory !== "all") {
        const cat = orderStatusMeta[order.status]?.category ?? "processing";
        if (cat !== activeCategory) return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const orderNum = (order.orderNumber || order.id).toLowerCase();
        const productName = order.productName.toLowerCase();
        const tenantName = order.tenantName.toLowerCase();
        const trackingNum = (
          order.freightBillNumber ||
          order.delivery?.trackingNumber ||
          ""
        ).toLowerCase();
        const itemsMatch = order.items?.some(
          (i) =>
            i.name.toLowerCase().includes(query) ||
            i.stoneType.toLowerCase().includes(query) ||
            (i.sku && i.sku.toLowerCase().includes(query))
        );

        const matches =
          orderNum.includes(query) ||
          productName.includes(query) ||
          tenantName.includes(query) ||
          trackingNum.includes(query) ||
          itemsMatch;

        if (!matches) return false;
      }

      return true;
    });

    // 2. Sort: Orders in processing always remain at the top of the list
    return [...filtered].sort((a, b) => {
      // Determine processing priority:
      // status 'processing' has highest priority (2), category 'processing' has priority (1), others (0)
      const getPriority = (order: (typeof filtered)[number]) => {
        if (order.status === "processing") return 2;
        if (orderStatusMeta[order.status]?.category === "processing") return 1;
        return 0;
      };

      const priorityA = getPriority(a);
      const priorityB = getPriority(b);

      if (priorityA !== priorityB) {
        return priorityB - priorityA; // higher priority first
      }

      // If both items have identical priority, sort by chosen sortOrder
      const totalA = a.summary?.total ?? a.total;
      const totalB = b.summary?.total ?? b.total;
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();

      switch (sortOrder) {
        case "newest":
          return timeB - timeA;
        case "oldest":
          return timeA - timeB;
        case "highest_price":
          return totalB - totalA;
        case "lowest_price":
          return totalA - totalB;
        default:
          return timeB - timeA;
      }
    });
  }, [userOrders, activeCategory, searchQuery, sortOrder]);

  // Global Expand / Collapse All
  const allExpanded = useMemo(() => {
    if (processedOrders.length === 0) return false;
    return processedOrders.every((order) => expandedIds[order.id]);
  }, [processedOrders, expandedIds]);

  const handleToggleExpandAll = () => {
    const nextState = !allExpanded;
    const newExpanded: Record<string, boolean> = {};
    processedOrders.forEach((order) => {
      newExpanded[order.id] = nextState;
    });
    setExpandedIds(newExpanded);
  };

  const isFiltered =
    activeCategory !== "all" ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="تاریخچه سفارش‌های سنگ"
        description="پیگیری مراحل برش، فرآوری، پالت‌بندی و ترابری سفارش‌های سنگ ساختمانی"
      />

      {/* Summary KPI Stats Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <Card className="border border-border bg-card shadow-xs transition-all hover:border-primary/20">
          <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
              <Package className="h-5 w-5 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-muted-foreground sm:text-xs">
                کل سفارش‌ها
              </div>
              <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
                {counts.all.toLocaleString("fa-IR")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs transition-all hover:border-primary/20">
          <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="h-5 w-5 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-muted-foreground sm:text-xs">
                برش و فرآوری
              </div>
              <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
                {counts.processing.toLocaleString("fa-IR")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs transition-all hover:border-primary/20">
          <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
              <Truck className="h-5 w-5 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-muted-foreground sm:text-xs">
                در حال ترابری
              </div>
              <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
                {counts.shipping.toLocaleString("fa-IR")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs transition-all hover:border-primary/20">
          <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
              <CheckCircle2 className="h-5 w-5 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-muted-foreground sm:text-xs">
                تحویل‌شده به پروژه
              </div>
              <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
                {counts.completed.toLocaleString("fa-IR")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <OrderFilterBar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        allExpanded={allExpanded}
        onToggleExpandAll={handleToggleExpandAll}
      />

      {/* Orders Accordion List */}
      {processedOrders.length > 0 ? (
        <div className="space-y-4">
          {processedOrders.map((order) => (
            <OrderAccordionItem
              key={order.id}
              order={order}
              isExpanded={Boolean(expandedIds[order.id])}
              onToggle={() => toggleOrderItem(order.id)}
            />
          ))}
        </div>
      ) : (
        <OrderEmptyState
          isFiltered={isFiltered}
          onResetFilters={() => {
            setActiveCategory("all");
            setSearchQuery("");
            setSortOrder("newest");
          }}
        />
      )}
    </div>
  );
}
