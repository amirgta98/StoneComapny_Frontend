export type InquiryStatus = "pending" | "quoted" | "approved" | "rejected";

export type CustomerRole =
  | "معمار"
  | "پیمانکار"
  | "خریدار شخصی"
  | "صادرکننده"
  | "طراح داخلی"
  | "انبوه‌ساز";

export type InquiryUrgency = "high" | "normal";

export type StoneCategory =
  | "مرمریت"
  | "تراورتن"
  | "گرانیت"
  | "آنیکس"
  | "چینی و کریستال"
  | "لایم‌استون"
  | "سنداستون";

export type StoneForm = "اسلب" | "تایل" | "۴۰ طولی" | "کوپ خام" | "پله و زیرپله" | "حجمی و ابزار";

export interface InquiryAttachment {
  id: string;
  name: string;
  size: string;
  type: "dwg" | "pdf" | "image";
  url?: string;
}

export interface InquiryQuotation {
  unitPrice: number; // in Tomans per sqm/ton
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  finalPrice: number; // in Tomans
  deliveryLeadDays: number;
  quarrySource: string;
  paymentTerms: string;
  validityDays: number;
  quoteDate: string;
  quotedBy: string;
  quoteNotes?: string;
  includeInstallationOffer?: boolean;
}

export interface InquiryHistoryEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  notes?: string;
}

export interface FactoryInquiryItem {
  id: string;
  rfqNumber: string;
  tenantId: string;
  customerName: string;
  customerRole: CustomerRole;
  customerPhone: string;
  customerCompany?: string;
  customerEmail?: string;
  projectName: string;
  projectCity: string;
  projectStage?: string;
  stoneTitle: string;
  stoneType: StoneCategory;
  form: StoneForm;
  volume: string;
  volumeNumber: number; // Numeric volume for calculations (sqm or tons)
  volumeUnit: "مترمربع" | "متر طول" | "تن" | "کوپ";
  finish: string;
  thickness: string;
  dimensions?: string;
  status: InquiryStatus;
  urgency: InquiryUrgency;
  createdAt: string;
  targetDeliveryDate?: string;
  notes?: string;
  attachments?: InquiryAttachment[];
  quotation?: InquiryQuotation;
  history: InquiryHistoryEvent[];
}

export interface InquiryStats {
  total: number;
  pending: number;
  quoted: number;
  approved: number;
  rejected: number;
  urgent: number;
  totalVolumeSqm: number;
  estimatedTotalValue: number;
}
