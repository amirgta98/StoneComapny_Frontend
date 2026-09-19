export type KpiTrend = "up" | "down" | "flat";

export interface FactoryKpi {
  id: string;
  label: string;
  value: string;
  hint?: string;
  trend?: KpiTrend;
  trendValue?: string;
}

export interface FactorySummary {
  monthlyRevenue: number;
  totalActiveOrders: number;
  pendingInquiries: number;
  totalStockSqm: number;
  totalProductsCount: number;
  activeClientsCount: number;
}

export interface ProductionStage {
  id: string;
  title: string;
  description: string;
  orderCount: number;
  volumeSqm: number;
  stepNumber: number;
  badgeColor?: string;
}

export interface FactoryOrder {
  id: string;
  orderNumber: string;
  tenantId: string;
  customerName: string;
  customerPhone?: string;
  productName: string;
  productImage: string;
  stoneType: string;
  form: "اسلب" | "تایل" | "پله" | "کوپ خام";
  dimensions: string;
  thickness: string;
  volume: string; // e.g. "۱۲۰ مترمربع" or "۴ اسلب"
  totalPrice: number;
  status:
    | "sourcing"
    | "cutting"
    | "processing_surface"
    | "ready_to_ship"
    | "shipping"
    | "delivered"
    | "cancelled";
  statusLabel: string;
  createdAt: string;
  deliveryDate?: string;
  isUrgent?: boolean;
}

export interface FactoryInquiry {
  id: string;
  tenantId: string;
  customerName: string;
  customerRole: "معمار" | "پیمانکار" | "خریدار شخصی" | "صادرکننده";
  stoneTitle: string;
  stoneType: string;
  volume: string;
  finish: string;
  thickness: string;
  projectCity: string;
  status: "pending" | "quoted" | "rejected";
  createdAt: string;
  urgency: "high" | "normal";
  notes?: string;
}

export interface FactoryInventoryItem {
  id: string;
  stoneName: string;
  category: "مرمریت" | "تراورتن" | "گرانیت" | "آنیکس" | "چینی و کریستال";
  color: string;
  finish: string;
  thickness: string;
  stockSqm: number;
  minThresholdSqm: number;
  status: "healthy" | "low" | "critical";
  image: string;
}

export interface FactorySalesTrend {
  month: string;
  revenue: number; // in million Tomans
  productionSqm: number;
  orders: number;
}

export interface ManagerDashboardData {
  tenantId: string;
  tenantName: string;
  subdomain?: string;
  domain?: string;
  summary: FactorySummary;
  kpis: FactoryKpi[];
  productionStages: ProductionStage[];
  recentOrders: FactoryOrder[];
  pendingInquiries: FactoryInquiry[];
  inventoryStatus: FactoryInventoryItem[];
  salesTrend: FactorySalesTrend[];
}
