export type InquiryStatus =
  | "PENDING"      // در انتظار بررسی
  | "IN_REVIEW"    // در حال کارشناسی و استعلام معدن
  | "RESPONDED"    // پاسخ داده شده و قیمت‌گذاری
  | "APPROVED"     // قابل تأمین و تأییدشده
  | "UNAVAILABLE"  // عدم امکان تأمین
  | "CANCELLED"    // لغو شده توسط کاربر
  | "COMPLETED";   // تکمیل شده و تبدیل به سفارش

export interface ManagerQuoteResponse {
  responseText: string;
  respondedAt: string;
  isAvailable: boolean;
  estimatedPricePerUnit?: number; // قیمت تخمینی هر واحد (تومان)
  estimatedTotalPrice?: number;   // قیمت تخمینی کل سفارش (تومان)
  estimatedPrepDays?: string;     // زمان تخمینی آماده‌سازی و برش
  deliveryTerms?: string;         // شرایط تحویل باربری یا درب کارخانه
  managerNotes?: string;          // توضیحات تکمیلی کارشناس
}

export interface CustomerInquiry {
  id: string;
  inquiryNumber: string;          // e.g. INQ-1403-8820
  userId: string;                 // owner user id
  requestedStoneName: string;     // نام یا عنوان سنگ درخواستی
  stoneType: string;              // مرمریت، گرانیت، تراورتن، مرمر و...
  stoneColor: string;             // رنگ سنگ
  application: string;            // کاربرد: نما، کف، پله، سرویس و...
  productFormat: string;          // اسلب، تایل، کوپ، پله...
  quantity: number;               // مقدار درخواستی
  unit: string;                   // متر مربع، عدد، تن...
  dimensions?: string;            // ابعاد درخواستی (e.g. 280x160)
  thickness?: string;             // ضخامت درخواستی (e.g. 2 سانتی‌متر)
  grade?: string;                 // درجه کیفی (سوپر، ممتاز...)
  quarryOrigin?: string;          // معدن یا خاستگاه مدنظر
  description: string;            // توضیحات تکمیلی کاربر
  referenceImage?: string | null; // عکس یا نمونه آپلود شده سنگ
  contactName?: string;
  contactPhone: string;
  status: InquiryStatus;
  managerResponse?: ManagerQuoteResponse | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryStatusConfig {
  label: string;
  description: string;
  badgeClass: string;
  canEdit: boolean;
  canCancel: boolean;
}

export const INQUIRY_STATUS_CONFIG: Record<InquiryStatus, InquiryStatusConfig> = {
  PENDING: {
    label: "در انتظار بررسی",
    description: "درخواست شما ثبت شده و در نوبت کارشناسی اولیه قرار دارد.",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    canEdit: true,
    canCancel: true,
  },
  IN_REVIEW: {
    label: "در حال بررسی و استعلام",
    description: "کارشناس تأمین در حال هماهنگی با معدن و ارزیابی کیفیت کوپ است.",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    canEdit: false,
    canCancel: true,
  },
  RESPONDED: {
    label: "پاسخ داده شده",
    description: "پیشنهاد قیمت، زمان تحویل و امکان تأمین توسط فروشگاه اعلام شده است.",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium",
    canEdit: false,
    canCancel: false,
  },
  APPROVED: {
    label: "قابل تأمین",
    description: "سنگ با مشخصات درخواستی شما در انبار یا معدن تأیید و رزرو شده است.",
    badgeClass: "bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border-emerald-600/30 font-semibold",
    canEdit: false,
    canCancel: false,
  },
  UNAVAILABLE: {
    label: "عدم امکان تأمین",
    description: "متأسفانه در حال حاضر امکان استخراج یا تأمین این نوع سنگ وجود ندارد.",
    badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    canEdit: false,
    canCancel: false,
  },
  CANCELLED: {
    label: "لغو شده",
    description: "این استعلام توسط کاربر یا کارشناس لغو شده است.",
    badgeClass: "bg-muted text-muted-foreground border-border",
    canEdit: false,
    canCancel: false,
  },
  COMPLETED: {
    label: "تکمیل شده",
    description: "این استعلام به سفارش خرید تبدیل و نهایی شده است.",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    canEdit: false,
    canCancel: false,
  },
};
