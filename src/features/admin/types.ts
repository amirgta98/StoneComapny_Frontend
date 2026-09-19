import type { TenantStatus } from "@/types";

export type KpiTrend = "up" | "down" | "flat";

export type Kpi = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  trend?: KpiTrend;
  trendValue?: string;
};

export type PlatformSummary = {
  totalTenants: number;
  activeTenants: number;
  pendingTenants: number;
  suspendedTenants: number;
  totalUsers: number;
  totalManagers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingInquiries: number;
};

export type ServerMetric = {
  id: string;
  label: string;
  value: string;
  status: "healthy" | "warning" | "critical";
  detail: string;
};

export type ServerHealth = {
  status: "healthy" | "degraded" | "down";
  uptime: string;
  region: string;
  nodeVersion: string;
  metrics: ServerMetric[];
};

export type ActivityEvent = {
  id: string;
  type: "tenant.created" | "tenant.updated" | "user.invited" | "system" | "order.placed" | "inquiry.received";
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
};

export type GrowthPoint = {
  month: string;
  tenants: number;
  users: number;
  revenue: number; // in million Tomans
};

export type StoneCategoryShare = {
  name: string;
  percentage: number;
  count: number;
  color: string;
};

export type RecentInquiry = {
  id: string;
  customerName: string;
  stoneTitle: string;
  category: string;
  volume: string;
  tenantName: string;
  status: "pending" | "quoted" | "rejected" | "approved";
  createdAt: string;
  priority: "high" | "normal";
};

export type AdminDashboardData = {
  summary: PlatformSummary;
  server: ServerHealth;
  recentTenants: {
    id: string;
    name: string;
    slug: string;
    domain?: string;
    status: TenantStatus;
    createdAt: string;
  }[];
  recentInquiries: RecentInquiry[];
  stoneCategories: StoneCategoryShare[];
  activity: ActivityEvent[];
  growth: GrowthPoint[];
};