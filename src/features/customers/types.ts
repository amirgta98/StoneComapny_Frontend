export type CustomerRole =
  | "CONTRACTOR" // پیمانکار و مجری ساختمانی
  | "ARCHITECT"  // معمار و طراح داخلی
  | "SHOWROOM"   // نمایشگاه‌دار و سنگ‌فروشی
  | "RETAIL";    // خریدار خرد / شخصی

export type CustomerStatus = "active" | "inactive" | "suspended";

export type CreditStatus = "safe" | "warning" | "blocked";

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  productName: string;
  stoneType: string;
  dimensions: string;
  volume: string;
  volumeSqm: number;
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
  orderDate: string;
}

export interface CustomerInquiry {
  id: string;
  rfqNumber: string;
  stoneTitle: string;
  stoneType: string;
  volume: string;
  status: "pending" | "quoted" | "approved" | "rejected";
  statusLabel: string;
  date: string;
  urgency: "high" | "normal";
  notes?: string;
}

export interface CustomerFinancialLedgerItem {
  id: string;
  date: string;
  type: "invoice" | "payment" | "check" | "return" | "adjustment";
  typeLabel: string;
  documentNumber: string;
  description: string;
  debit: number;   // بدهکار (افزایش مانده بدهی مشتری به کارخانه)
  credit: number;  // بستانکار (پرداخت یا کاهش بدهی)
  balance: number; // مانده پس از تراکنش
  paymentMethod?: string;
}

export interface CustomerCheck {
  id: string;
  checkNumber: string;
  sayadId?: string;
  bankName: string;
  branch?: string;
  dueDate: string;
  amount: number;
  drawerName: string;
  status: "cleared" | "pending" | "bounced";
  statusLabel: string;
  registeredDate: string;
  notes?: string;
}

export interface CustomerNote {
  id: string;
  date: string;
  author: string;
  type: "call" | "meeting" | "visit" | "agreement" | "note";
  typeLabel: string;
  title: string;
  content: string;
}

export interface FactoryCustomer {
  id: string;
  tenantId: string;
  code: string; // e.g. "CUST-101"
  name: string;
  role: CustomerRole;
  status: CustomerStatus;
  phone: string;
  email?: string;
  nationalId?: string;
  economicCode?: string;
  companyName?: string;
  projectName?: string;
  projectLocation?: string;
  city: string;
  address?: string;
  creditLimit: number;        // سقف اعتبار به تومان
  currentBalance: number;     // مانده حساب جاری به تومان
  pendingChecksTotal: number; // مجموع مبالغ چک‌های در جریان وصول به تومان
  creditStatus: CreditStatus;
  paymentTerms: string;
  preferredStones: string[];
  totalPurchasedSqm: number;  // مجموع متراژ سنگ خریداری‌شده به مترمربع
  totalOrdersCount: number;
  totalSpentTomans: number;
  createdAt: string;
  lastOrderDate?: string;
  notes?: string;
  orders: CustomerOrder[];
  inquiries: CustomerInquiry[];
  financialLedger: CustomerFinancialLedgerItem[];
  checks: CustomerCheck[];
  interactions: CustomerNote[];
}

export interface CustomerStats {
  totalCustomers: number;
  contractorsCount: number;
  architectsCount: number;
  showroomsCount: number;
  retailCount: number;
  totalPurchasedSqm: number;
  totalActiveReceivables: number;
  totalPendingChecks: number;
}
