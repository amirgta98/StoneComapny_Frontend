"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  InventoryDashboardData,
  InventoryItemDto,
  WarehouseLocationDto,
  InventoryMovementDto,
  StockReceiptDto,
  StockIssueDto,
  StockReservationDto,
  StockTransferDto,
  StockCountDto,
  StockAdjustmentDto,
  InventoryAlertDto,
  InventoryReportsData,
} from "../types/inventory.types";
import type {
  CreateReceiptInput,
  CreateIssueInput,
  TransferStockInput,
  ReserveStockInput,
  CreateStockAdjustmentInput,
  CreateLocationInput,
  CreateStockCountInput,
  CompleteStockCountInput,
} from "@/modules/inventory/application/dto/inventory.dto";

// ===================== QUERY KEYS =====================

export const inventoryKeys = {
  all: ["inventory"] as const,
  dashboard: () => [...inventoryKeys.all, "dashboard"] as const,
  items: (filters?: Record<string, unknown>) => [...inventoryKeys.all, "items", filters] as const,
  itemDetail: (id: string) => [...inventoryKeys.all, "item", id] as const,
  locations: () => [...inventoryKeys.all, "locations"] as const,
  receipts: () => [...inventoryKeys.all, "receipts"] as const,
  issues: () => [...inventoryKeys.all, "issues"] as const,
  movements: (filters?: Record<string, unknown>) => [...inventoryKeys.all, "movements", filters] as const,
  reservations: () => [...inventoryKeys.all, "reservations"] as const,
  transfers: () => [...inventoryKeys.all, "transfers"] as const,
  counts: () => [...inventoryKeys.all, "counts"] as const,
  adjustments: () => [...inventoryKeys.all, "adjustments"] as const,
  alerts: () => [...inventoryKeys.all, "alerts"] as const,
  reports: () => [...inventoryKeys.all, "reports"] as const,
};

// ===================== QUERY HOOKS =====================

export function useInventoryDashboard() {
  return useQuery<InventoryDashboardData>({
    queryKey: inventoryKeys.dashboard(),
    queryFn: async () => {
      const res = await fetch("/api/inventory/dashboard");
      if (!res.ok) throw new Error("خطا در دریافت اطلاعات داشبورد انبار");
      return res.json();
    },
  });
}

export function useInventoryItems(filters?: {
  query?: string;
  stoneType?: string;
  color?: string;
  form?: string;
  unit?: string;
  locationId?: string;
  status?: string;
  lowStockOnly?: boolean;
  outOfStockOnly?: boolean;
}) {
  return useQuery<{ items: InventoryItemDto[]; total: number }>({
    queryKey: inventoryKeys.items(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.query) params.set("query", filters.query);
      if (filters?.stoneType && filters.stoneType !== "all") params.set("stoneType", filters.stoneType);
      if (filters?.color && filters.color !== "all") params.set("color", filters.color);
      if (filters?.form && filters.form !== "all") params.set("form", filters.form);
      if (filters?.unit && filters.unit !== "all") params.set("unit", filters.unit);
      if (filters?.locationId && filters.locationId !== "all") params.set("locationId", filters.locationId);
      if (filters?.status && filters.status !== "all") params.set("status", filters.status);
      if (filters?.lowStockOnly) params.set("lowStockOnly", "true");
      if (filters?.outOfStockOnly) params.set("outOfStockOnly", "true");

      const res = await fetch(`/api/inventory/items?${params.toString()}`);
      if (!res.ok) throw new Error("خطا در دریافت لیست اقلام انبار");
      return res.json();
    },
  });
}

export function useInventoryItem(id?: string) {
  return useQuery<{
    item: InventoryItemDto;
    movements: InventoryMovementDto[];
    reservations: StockReservationDto[];
  }>({
    queryKey: inventoryKeys.itemDetail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("شناسه کالا مشخص نیست");
      const res = await fetch(`/api/inventory/items/${id}`);
      if (!res.ok) throw new Error("خطا در دریافت جزییات سنگ");
      return res.json();
    },
    enabled: Boolean(id),
  });
}

export function useInventoryLocations() {
  return useQuery<{ locations: WarehouseLocationDto[] }>({
    queryKey: inventoryKeys.locations(),
    queryFn: async () => {
      const res = await fetch("/api/inventory/locations");
      if (!res.ok) throw new Error("خطا در دریافت موقعیت‌های انبار");
      return res.json();
    },
  });
}

export function useInventoryReceipts() {
  return useQuery<{ receipts: StockReceiptDto[] }>({
    queryKey: inventoryKeys.receipts(),
    queryFn: async () => {
      const res = await fetch("/api/inventory/receipts");
      if (!res.ok) throw new Error("خطا در دریافت رسیدهای انبار");
      return res.json();
    },
  });
}

export function useInventoryIssues() {
  return useQuery<{ issues: StockIssueDto[] }>({
    queryKey: inventoryKeys.issues(),
    queryFn: async () => {
      const res = await fetch("/api/inventory/issues");
      if (!res.ok) throw new Error("خطا در دریافت حواله‌های خروج انبار");
      return res.json();
    },
  });
}

export function useInventoryMovements(filters?: { inventoryItemId?: string; type?: string }) {
  return useQuery<{ movements: InventoryMovementDto[]; total: number }>({
    queryKey: inventoryKeys.movements(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.inventoryItemId) params.set("inventoryItemId", filters.inventoryItemId);
      if (filters?.type && filters.type !== "all") params.set("type", filters.type);

      const res = await fetch(`/api/inventory/movements?${params.toString()}`);
      if (!res.ok) throw new Error("خطا در دریافت کاردکس گردش انبار");
      return res.json();
    },
  });
}

export function useInventoryReservations() {
  return useQuery<{ reservations: StockReservationDto[] }>({
    queryKey: inventoryKeys.reservations(),
    queryFn: async () => {
      const res = await fetch("/api/inventory/reservations");
      if (!res.ok) throw new Error("خطا در دریافت رزروهای انبار");
      return res.json();
    },
  });
}

export function useInventoryTransfers() {
  return useQuery<{ transfers: StockTransferDto[] }>({
    queryKey: inventoryKeys.transfers(),
    queryFn: async () => {
      const res = await fetch("/api/inventory/transfers");
      if (!res.ok) throw new Error("خطا در دریافت انتقالات انبار");
      return res.json();
    },
  });
}

export function useInventoryCounts() {
  return useQuery<{ counts: StockCountDto[] }>({
    queryKey: inventoryKeys.counts(),
    queryFn: async () => {
      const res = await fetch("/api/inventory/counts");
      if (!res.ok) throw new Error("خطا در دریافت انبارگردانی‌ها");
      return res.json();
    },
  });
}

export function useInventoryAdjustments() {
  return useQuery<{ adjustments: StockAdjustmentDto[] }>({
    queryKey: inventoryKeys.adjustments(),
    queryFn: async () => {
      const res = await fetch("/api/inventory/adjustments");
      if (!res.ok) throw new Error("خطا در دریافت تعدیلات انبار");
      return res.json();
    },
  });
}

export function useInventoryAlerts() {
  return useQuery<{
    alerts: InventoryAlertDto[];
    summary: { criticalCount: number; warningCount: number; infoCount: number; total: number };
  }>({
    queryKey: inventoryKeys.alerts(),
    queryFn: async () => {
      const res = await fetch("/api/inventory/alerts");
      if (!res.ok) throw new Error("خطا در دریافت هشدارهای موجودی");
      return res.json();
    },
  });
}

export function useInventoryReports() {
  return useQuery<InventoryReportsData>({
    queryKey: inventoryKeys.reports(),
    queryFn: async () => {
      const res = await fetch("/api/inventory/reports");
      if (!res.ok) throw new Error("خطا در دریافت گزارشات انبار");
      return res.json();
    },
  });
}

// ===================== MUTATION HOOKS =====================

export function useCreateReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReceiptInput) => {
      const res = await fetch("/api/inventory/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در ثبت رسید انبار");
      return result;
    },
    onSuccess: () => {
      toast.success("رسید ورود سنگ با موفقیت ثبت شد.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.receipts() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.dashboard() });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useConfirmReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (receiptId: string) => {
      const res = await fetch(`/api/inventory/receipts/${receiptId}/confirm`, {
        method: "POST",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در تأیید رسید");
      return result;
    },
    onSuccess: () => {
      toast.success("رسید ورود به انبار تأیید و موجودی فیزیکی افزوده شد.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateIssueInput) => {
      const res = await fetch("/api/inventory/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در ثبت حواله خروج");
      return result;
    },
    onSuccess: () => {
      toast.success("حواله خروج بار سنگ با موفقیت ایجاد شد.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.issues() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.dashboard() });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useConfirmIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (issueId: string) => {
      const res = await fetch(`/api/inventory/issues/${issueId}/confirm`, {
        method: "POST",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در تأیید حواله خروج");
      return result;
    },
    onSuccess: () => {
      toast.success("حواله خروج تأیید و کسر موجودی فیزیکی در کاردکس ثبت گردید.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useReserveStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReserveStockInput) => {
      const res = await fetch("/api/inventory/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در ثبت رزرو سنگ");
      return result;
    },
    onSuccess: () => {
      toast.success("رزرو سنگ با موفقیت ثبت شد.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useReleaseReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reservationId: string) => {
      const res = await fetch(`/api/inventory/reservations/${reservationId}/release`, {
        method: "POST",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در آزادسازی رزرو");
      return result;
    },
    onSuccess: () => {
      toast.success("رزرو آزاد شد و سنگ به موجودی قابل فروش بازگشت.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useTransferStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TransferStockInput) => {
      const res = await fetch("/api/inventory/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در انتقال بین انبارها");
      return result;
    },
    onSuccess: () => {
      toast.success("انتقال سنگ بین موقعیت‌های انبار با موفقیت انجام شد.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useCreateStockCount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateStockCountInput) => {
      const res = await fetch("/api/inventory/counts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در ثبت انبارگردانی");
      return result;
    },
    onSuccess: () => {
      toast.success("برگه انبارگردانی ایجاد شد و آماده ثبت مقادیر فیزیکی است.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.counts() });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useCompleteStockCount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ countId, data }: { countId: string; data: CompleteStockCountInput }) => {
      const res = await fetch(`/api/inventory/counts/${countId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در تصویب انبارگردانی");
      return result;
    },
    onSuccess: () => {
      toast.success("انبارگردانی تصویب و تعدیلات مغایرت به صورت خودکار اعمال شد.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useCreateAdjustment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateStockAdjustmentInput) => {
      const res = await fetch("/api/inventory/adjustments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در ثبت تعدیل انبار");
      return result;
    },
    onSuccess: () => {
      toast.success("تعدیل موجودی با موفقیت در سیستم ثبت گردید.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLocationInput) => {
      const res = await fetch("/api/inventory/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در ایجاد موقعیت انبار");
      return result;
    },
    onSuccess: () => {
      toast.success("موقعیت جدید انبار اضافه شد.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.locations() });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/inventory/locations/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در حذف موقعیت انبار");
      return result;
    },
    onSuccess: () => {
      toast.success("موقعیت انبار حذف شد.");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.locations() });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
