import type { AuthUser } from "@/auth/types";

/**
 * Mock data for the Customer Account panel (access-control skill §7).
 *
 * MOCK-ONLY: swapped for real API calls after the backend exists (§11.5).
 * Every resource a USER sees is scoped to ownerId === currentUser.id
 * (skill §9 rule 3 — enforced in the mock layer so IDOR bugs surface now).
 */

export const mockCustomerUser: AuthUser = {
  id: "u-user-1",
  role: "USER",
  tenantId: null,
  name: "مشتری نمونه",
  phone: "09120000004",
};

export type OrderStatus =
  // Existing legacy statuses for full backwards-compatibility:
  | "placed"
  | "preparing"
  | "shipped"
  | "delivered"
  // Purchase / Processing:
  | "pending_payment"
  | "paid"
  | "processing"
  | "sourcing"
  | "seller_pending"
  | "confirmed"
  // Production / Preparation (stone industry):
  | "cutting"
  | "processing_surface"
  | "ready_to_ship"
  // Shipping:
  | "shipping"
  | "freight_delivered"
  // Completed:
  | "received"
  | "completed"
  // Problems / Cancellation:
  | "cancelled"
  | "refund_requested"
  | "refunded"
  | "failed"
  | "sourcing_failed";

export type OrderCategory =
  | "all"
  | "processing"
  | "shipping"
  | "completed"
  | "cancelled";

export interface OrderItem {
  id: string;
  productId?: string;
  name: string;
  image: string;
  stoneType: string;
  stoneColor?: string;
  finish?: string;
  form?: string;
  dimensions?: string;
  thickness?: string;
  grade?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  sku?: string;
}

export interface OrderDelivery {
  method: string;
  carrier?: string;
  trackingNumber?: string;
  shippingCost?: number;
  address: string;
  receiverName: string;
  receiverPhone: string;
  estimatedDeliveryDate: string;
  packaging?: string;
  craneAccess?: boolean;
  forkliftAccess?: boolean;
  floor?: string;
  deliveryNotes?: string;
}

export interface OrderSummary {
  subtotal: number;
  shippingCost: number;
  discount?: number;
  tax?: number;
  total: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber?: string;
  productName: string;
  productImage: string;
  tenantName: string;
  tenantId: string;
  status: OrderStatus;
  total: number;
  date: string;
  ownerId: string;
  // Rich stone domain extensions:
  items?: OrderItem[];
  delivery?: OrderDelivery;
  summary?: OrderSummary;
  packaging?: string;
  estimatedDeliveryDate?: string;
  estimatedPrepTime?: string;
  shippingMethod?: string;
  freightBillNumber?: string;
  timelineStep?: number; // 0 to 5
}

export const orderStatusLabel: Record<OrderStatus, string> = {
  placed: "ثبت‌شده",
  preparing: "در حال آماده‌سازی و بسته‌بندی",
  shipped: "ارسال‌شده",
  delivered: "تحویل‌شده",
  pending_payment: "در انتظار پرداخت",
  paid: "پرداخت‌شده",
  processing: "در حال بررسی سفارش",
  sourcing: "در حال تأمین کوپ و سنگ خام",
  seller_pending: "در انتظار تأیید کارخانه",
  confirmed: "تأییدشده توسط کارخانه",
  cutting: "در حال برش اسلب و تایل",
  processing_surface: "در حال فرآوری، ساب و رزین",
  ready_to_ship: "آماده ارسال و بارگیری",
  shipping: "در حال ارسال با باربری",
  freight_delivered: "تحویل به باربری بین‌شهری",
  received: "تحویل مشتری شد",
  completed: "تکمیل‌شده",
  cancelled: "لغو شده",
  refund_requested: "درخواست مرجوعی",
  refunded: "مرجوع شده",
  failed: "پرداخت ناموفق",
  sourcing_failed: "عدم تأمین از معدن",
};

/** Color badge per status (UI only — the real value comes from the backend). */
export const orderStatusVariant: Record<
  OrderStatus,
  "outline" | "secondary" | "default" | "destructive"
> = {
  placed: "outline",
  preparing: "secondary",
  shipped: "default",
  delivered: "secondary",
  pending_payment: "outline",
  paid: "secondary",
  processing: "secondary",
  sourcing: "secondary",
  seller_pending: "outline",
  confirmed: "secondary",
  cutting: "secondary",
  processing_surface: "secondary",
  ready_to_ship: "default",
  shipping: "default",
  freight_delivered: "default",
  received: "secondary",
  completed: "secondary",
  cancelled: "destructive",
  refund_requested: "destructive",
  refunded: "destructive",
  failed: "destructive",
  sourcing_failed: "destructive",
};

export interface StatusMeta {
  label: string;
  category: OrderCategory;
  stepIndex: number; // 0 to 5
  badgeClass: string;
}

export const orderStatusMeta: Record<OrderStatus, StatusMeta> = {
  pending_payment: {
    label: "در انتظار پرداخت",
    category: "processing",
    stepIndex: 0,
    badgeClass: "bg-secondary text-secondary-foreground border-border",
  },
  placed: {
    label: "ثبت‌شده",
    category: "processing",
    stepIndex: 0,
    badgeClass: "bg-secondary text-secondary-foreground border-border",
  },
  paid: {
    label: "پرداخت‌شده",
    category: "processing",
    stepIndex: 0,
    badgeClass: "bg-secondary text-secondary-foreground border-border",
  },
  seller_pending: {
    label: "در انتظار تأیید کارخانه",
    category: "processing",
    stepIndex: 1,
    badgeClass: "bg-secondary text-secondary-foreground border-border",
  },
  confirmed: {
    label: "تأییدشده",
    category: "processing",
    stepIndex: 1,
    badgeClass: "bg-secondary text-secondary-foreground border-border",
  },
  sourcing: {
    label: "در حال تأمین کوپ",
    category: "processing",
    stepIndex: 1,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  processing: {
    label: "در حال پردازش",
    category: "processing",
    stepIndex: 1,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  cutting: {
    label: "در حال برش سنگ",
    category: "processing",
    stepIndex: 2,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  processing_surface: {
    label: "فرآوری و ساب سنگ",
    category: "processing",
    stepIndex: 2,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  preparing: {
    label: "در حال آماده‌سازی و پالت‌بندی",
    category: "processing",
    stepIndex: 3,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  ready_to_ship: {
    label: "آماده بارگیری و ارسال",
    category: "shipping",
    stepIndex: 3,
    badgeClass: "bg-secondary text-secondary-foreground border-border",
  },
  shipping: {
    label: "در حال حمل با باربری",
    category: "shipping",
    stepIndex: 4,
    badgeClass: "bg-secondary text-secondary-foreground border-border",
  },
  freight_delivered: {
    label: "تحویل به باربری",
    category: "shipping",
    stepIndex: 4,
    badgeClass: "bg-secondary text-secondary-foreground border-border",
  },
  shipped: {
    label: "ارسال‌شده",
    category: "shipping",
    stepIndex: 4,
    badgeClass: "bg-secondary text-secondary-foreground border-border",
  },
  delivered: {
    label: "تحویل داده‌شده",
    category: "completed",
    stepIndex: 5,
    badgeClass: "bg-foreground text-background border-foreground/20",
  },
  received: {
    label: "دریافت‌شده در پروژه",
    category: "completed",
    stepIndex: 5,
    badgeClass: "bg-foreground text-background border-foreground/20",
  },
  completed: {
    label: "سفارش تکمیل‌شده",
    category: "completed",
    stepIndex: 5,
    badgeClass: "bg-foreground text-background border-foreground/20",
  },
  cancelled: {
    label: "لغو شده",
    category: "cancelled",
    stepIndex: -1,
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
  refund_requested: {
    label: "درخواست مرجوعی",
    category: "cancelled",
    stepIndex: -1,
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
  refunded: {
    label: "مرجوع شده",
    category: "cancelled",
    stepIndex: -1,
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
  failed: {
    label: "پرداخت ناموفق",
    category: "cancelled",
    stepIndex: -1,
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
  sourcing_failed: {
    label: "عدم تأمین از معدن",
    category: "cancelled",
    stepIndex: -1,
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export const mockOrders: CustomerOrder[] = [
  {
    id: "ord-c-1001",
    orderNumber: "ORD-10245",
    productName: "سنگ مرمریت کالاتا گلد",
    productImage: "/test_images/stones/test_1.jpg",
    tenantName: "کارخانه سنگ و سرامیک صنعت",
    tenantId: "tenant-001",
    status: "processing",
    total: 184_800_000,
    date: "2024-08-10T09:00:00Z",
    ownerId: "u-user-1",
    packaging: "پالت چوبی تقویت‌شده استاندارد با روکش پلی‌اتیلن و تسمه فولادی ضد زنگ",
    shippingMethod: "حمل با تریلی کفی اختصاصی مجهز به بادگیر و زیرپایی لاستیکی",
    freightBillNumber: "BL-982410",
    estimatedDeliveryDate: "۱۴۰۳/۰۶/۲۸",
    estimatedPrepTime: "در حال پردازش و آماده‌سازی در کارخانه",
    timelineStep: 2,
    delivery: {
      method: "تریلی کفی اختصاصی سنگ",
      carrier: "شرکت باربری ترابری سراسری سنگ پایتخت",
      trackingNumber: "BL-982410",
      shippingCost: 8_500_000,
      address: "تهران، لواسان، بلوار باستی، پروژه ویلایی نیلوفر، پلاک ۱۸",
      receiverName: "مهندس کاظمی",
      receiverPhone: "۰۹۱۲۰۰۰۰۰۰۴",
      estimatedDeliveryDate: "۲۸ شهریور ۱۴۰۳",
      craneAccess: true,
      forkliftAccess: false,
      floor: "همکف محوطه",
      deliveryNotes: "نیاز به جرثقیل ۵ تن جهت تخلیه پالت‌های اسلب در محوطه کارگاهی پروژه.",
    },
    summary: {
      subtotal: 184_800_000,
      shippingCost: 8_500_000,
      discount: 5_000_000,
      tax: 0,
      total: 188_300_000,
    },
    items: [
      {
        id: "item-101",
        productId: "p1",
        name: "سنگ مرمریت کالاتا گلد (اسلب بوک‌مچ)",
        image: "/test_images/stones/test_1.jpg",
        stoneType: "مرمریت",
        stoneColor: "سفید و طلایی",
        finish: "ساب‌خورده آینه‌ای (پولیش)",
        form: "اسلب",
        dimensions: "۲۸۰ × ۱۶۰ سانتی‌متر",
        thickness: "۲ سانتی‌متر",
        grade: "سوپر صادراتی",
        quantity: 4,
        unit: "اسلب (۱۸ متر مربع)",
        unitPrice: 12_600_000,
        totalPrice: 50_400_000,
        sku: "CAL-SL-001",
      },
      {
        id: "item-102",
        productId: "p2",
        name: "تایل مرمریت کالاتا گلد کف سالن",
        image: "/test_images/stones/test_2.jpg",
        stoneType: "مرمریت",
        stoneColor: "سفید رگه‌دار",
        finish: "هون مات ابریشمی",
        form: "تایل",
        dimensions: "۸۰ × ۸۰ سانتی‌متر",
        thickness: "۱.۸ سانتی‌متر",
        grade: "ممتاز درجه ۱",
        quantity: 120,
        unit: "متر مربع",
        unitPrice: 1_120_000,
        totalPrice: 134_400_000,
        sku: "CAL-TL-080",
      },
    ],
  },
  {
    id: "ord-c-1002",
    orderNumber: "ORD-10198",
    productName: "سنگ گرانیت ناتانس مشکی",
    productImage: "/test_images/stones/test_3.jpg",
    tenantName: "تجارت سنگ‌های قیمتی",
    tenantId: "tenant-002",
    status: "shipping",
    total: 92_500_000,
    date: "2024-08-12T14:30:00Z",
    ownerId: "u-user-1",
    packaging: "پالت فلزی خرپایی A-Frame به همراه محافظ فوم پلی‌اورتان",
    shippingMethod: "خاور تک مسقف مجهز به جک تخلیه هیدرولیک",
    freightBillNumber: "BL-883012",
    estimatedDeliveryDate: "۱۴۰۳/۰۶/۲۲",
    estimatedPrepTime: "آماده شده",
    timelineStep: 4,
    delivery: {
      method: "خاور تک مسقف ویژه سنگ",
      carrier: "باربری تخصصی سنگ اصفهان ترابر",
      trackingNumber: "BL-883012",
      shippingCost: 4_200_000,
      address: "کرج، شهرک صنعتی بهارستان، بلوار فناوری، کارگاه ساختمانی البرز",
      receiverName: "حسین باقری",
      receiverPhone: "۰۹۱۲۰۰۰۰۰۰۴",
      estimatedDeliveryDate: "۲۲ شهریور ۱۴۰۳",
      craneAccess: false,
      forkliftAccess: true,
      floor: "انبار مرکزی کارگاه",
      deliveryNotes: "راننده قبل از ورود به شهرک با سرپرست کارگاه هماهنگ شود.",
    },
    summary: {
      subtotal: 92_500_000,
      shippingCost: 4_200_000,
      discount: 0,
      tax: 0,
      total: 96_700_000,
    },
    items: [
      {
        id: "item-201",
        productId: "p3",
        name: "سنگ پله گرانیت مشکی نطنز ابزاردار",
        image: "/test_images/stones/test_3.jpg",
        stoneType: "گرانیت",
        stoneColor: "مشکی دانه ریز",
        finish: "ساب‌خورده لبه گرد ابزار دوبل",
        form: "پله و زیرپله",
        dimensions: "۱۲۰ × ۳۵ سانتی‌متر",
        thickness: "۳ سانتی‌متر",
        grade: "سوپر ممتاز",
        quantity: 25,
        unit: "عدد",
        unitPrice: 2_000_000,
        totalPrice: 50_000_000,
        sku: "GRN-PL-120",
      },
      {
        id: "item-202",
        productId: "p4",
        name: "تایل گرانیت فلیم‌شده مشکی محوطه",
        image: "/test_images/stones/test_4.jpg",
        stoneType: "گرانیت",
        stoneColor: "مشکی ذغالی",
        finish: "شعله‌ور ضد لغزش (فلیم)",
        form: "تایل ۴۰ طولی",
        dimensions: "۴۰ × آزاد سانتی‌متر",
        thickness: "۲ سانتی‌متر",
        grade: "درجه ۱",
        quantity: 50,
        unit: "متر طول",
        unitPrice: 850_000,
        totalPrice: 42_500_000,
        sku: "GRN-FLM-040",
      },
    ],
  },
  {
    id: "ord-c-1003",
    orderNumber: "ORD-10087",
    productName: "تراورتن کرم آتشکوه",
    productImage: "/test_images/stones/test_5.jpg",
    tenantName: "کارخانه سرامیک شمال",
    tenantId: "tenant-003",
    status: "delivered",
    total: 67_000_000,
    date: "2024-07-28T11:00:00Z",
    ownerId: "u-user-1",
    packaging: "دسته‌بندی پالت چوبی پین‌کاری شده تسمه‌دار",
    shippingMethod: "خاور بغل‌بازشو کارخانه‌ای",
    freightBillNumber: "BL-552190",
    estimatedDeliveryDate: "۱۴۰۳/۰۵/۰۴",
    estimatedPrepTime: "تکمیل شده",
    timelineStep: 5,
    delivery: {
      method: "خاور باربری اختصاصی",
      carrier: "ترابری سریع سنگ شمال",
      trackingNumber: "BL-552190",
      shippingCost: 3_500_000,
      address: "تهران، خیابان ولیعصر، بعد از پارک ملت، کوچه آرامش، پلاک ۱۲",
      receiverName: "مشتری نمونه",
      receiverPhone: "۰۹۱۲۰۰۰۰۰۰۴",
      estimatedDeliveryDate: "۴ مرداد ۱۴۰۳ (تحویل گردید)",
      craneAccess: false,
      forkliftAccess: false,
      floor: "پارکینگ ساختمان",
      deliveryNotes: "تحویل شد و صورت‌جلسه سلامت سنگ‌ها امضا گردید.",
    },
    summary: {
      subtotal: 67_000_000,
      shippingCost: 3_500_000,
      discount: 3_500_000,
      tax: 0,
      total: 67_000_000,
    },
    items: [
      {
        id: "item-301",
        productId: "p5",
        name: "تراورتن کرم آتشکوه موج‌دار نما",
        image: "/test_images/stones/test_5.jpg",
        stoneType: "تراورتن",
        stoneColor: "کرم روشن",
        finish: "رزین اپوکسی پولیش‌شده",
        form: "تایل ۴۰ طولی",
        dimensions: "۴۰ × ۱۲۰-۱۸۰ سانتی‌متر",
        thickness: "۱.۷ سانتی‌متر",
        grade: "سوپر آتشکوه",
        quantity: 58,
        unit: "متر مربع",
        unitPrice: 1_155_000,
        totalPrice: 67_000_000,
        sku: "TRV-AT-040",
      },
    ],
  },
  {
    id: "ord-c-1004",
    orderNumber: "ORD-10310",
    productName: "سنگ اُنیکس سبز ایرانی",
    productImage: "/test_images/stones/test_6.jpg",
    tenantName: "سنگ و سرامیک صنعت",
    tenantId: "tenant-001",
    status: "sourcing",
    total: 240_000_000,
    date: "2024-08-15T08:45:00Z",
    ownerId: "u-user-1",
    packaging: "صندوق چوبی ضربه‌گیر VIP با لایه‌های اسفنجی عایق ارتعاش",
    shippingMethod: "حمل اختصاصی ایمن با تریلی پنوماتیک",
    freightBillNumber: "BL-991204",
    estimatedDeliveryDate: "۱۴۰۳/۰۷/۰۵",
    estimatedPrepTime: "۸ تا ۱۲ روز کاری (انتخاب کوپ خام)",
    timelineStep: 1,
    delivery: {
      method: "کامیون کفی ویژه سنگ‌های تزیینی و قیمتی",
      carrier: "ناوگان باربری سفارشی سنگ ایران",
      trackingNumber: "BL-991204",
      shippingCost: 12_000_000,
      address: "تهران، شهرک غرب، فاز ۱، خیابان ایران‌زمین، برج الماس",
      receiverName: "مشتری نمونه",
      receiverPhone: "۰۹۱۲۰۰۰۰۰۰۴",
      estimatedDeliveryDate: "۵ مهر ۱۴۰۳",
      craneAccess: true,
      forkliftAccess: true,
      floor: "لابی مرکزی",
      deliveryNotes: "سنگ نورگذر لوکس — نیازمند تخلیه با تسمه برزنتی نرم و نظارت کارشناس فنی.",
    },
    summary: {
      subtotal: 240_000_000,
      shippingCost: 12_000_000,
      discount: 10_000_000,
      tax: 0,
      total: 242_000_000,
    },
    items: [
      {
        id: "item-401",
        productId: "p6",
        name: "اسلب مرمر (اُنیکس) سبز زمردی با رگه‌های طلایی",
        image: "/test_images/stones/test_6.jpg",
        stoneType: "آنیکس",
        stoneColor: "سبز یشمی شفاف",
        finish: "ساب فوق شفاف آینه‌ای (پشت توری رزین)",
        form: "اسلب بوک‌مچ جفت",
        dimensions: "۲۷۰ × ۱۸۰ سانتی‌متر",
        thickness: "۲ سانتی‌متر",
        grade: "صادراتی خاص",
        quantity: 2,
        unit: "اسلب (۹.۷ متر مربع)",
        unitPrice: 120_000_000,
        totalPrice: 240_000_000,
        sku: "ONX-GR-002",
      },
    ],
  },
  {
    id: "ord-c-1005",
    orderNumber: "ORD-10340",
    productName: "سنگ مرمریت دهبید شایان",
    productImage: "/test_images/stones/test_7.jpg",
    tenantName: "تجارت سنگ‌های قیمتی",
    tenantId: "tenant-002",
    status: "ready_to_ship",
    total: 115_200_000,
    date: "2024-08-16T16:20:00Z",
    ownerId: "u-user-1",
    packaging: "پالت صادراتی فوم‌دار با تسمه نایلونی مقاوم",
    shippingMethod: "کامیون ده چرخ بنز مجهز به مهاربند",
    freightBillNumber: "BL-993108",
    estimatedDeliveryDate: "۱۴۰۳/۰۶/۲۴",
    estimatedPrepTime: "بسته‌بندی و پالتیزه شده",
    timelineStep: 3,
    delivery: {
      method: "کامیون ده چرخ سنگبری",
      carrier: "باربری اتحاد سنگ صفاشهر",
      trackingNumber: "BL-993108",
      shippingCost: 6_000_000,
      address: "اصفهان، مرداویج، خیابان ملاصدرا، کوچه ۱۲",
      receiverName: "مهندس فرهمند",
      receiverPhone: "۰۹۱۲۰۰۰۰۰۰۴",
      estimatedDeliveryDate: "۲۴ شهریور ۱۴۰۳",
      craneAccess: true,
      forkliftAccess: true,
      floor: "همکف حیاط جنوبی",
      deliveryNotes: "هماهنگی با باربری ساعت ۸ صبح روز شنبه انجام شود.",
    },
    summary: {
      subtotal: 115_200_000,
      shippingCost: 6_000_000,
      discount: 2_000_000,
      tax: 0,
      total: 119_200_000,
    },
    items: [
      {
        id: "item-501",
        productId: "p7",
        name: "مرمریت دهبید کرم رویال شایان",
        image: "/test_images/stones/test_7.jpg",
        stoneType: "مرمریت",
        stoneColor: "کرم بژ یکدست",
        finish: "ساب نانو کریستالیزه براق",
        form: "تایل اسلب‌تایل",
        dimensions: "۱۰۰ × ۱۰۰ سانتی‌متر",
        thickness: "۲ سانتی‌متر",
        grade: "سوپر ممتاز",
        quantity: 72,
        unit: "متر مربع",
        unitPrice: 1_600_000,
        totalPrice: 115_200_000,
        sku: "DHB-100-CR",
      },
    ],
  },
  {
    id: "ord-c-1006",
    orderNumber: "ORD-10042",
    productName: "سنگ لایم استون بوکان",
    productImage: "/test_images/stones/test_8.jpg",
    tenantName: "کارخانه سرامیک شمال",
    tenantId: "tenant-003",
    status: "refunded",
    total: 38_000_000,
    date: "2024-07-10T12:00:00Z",
    ownerId: "u-user-1",
    packaging: "بسته‌بندی کارتنی روی پالت",
    shippingMethod: "وانت نیسان بار",
    freightBillNumber: "BL-441098",
    estimatedDeliveryDate: "۱۴۰۳/۰۴/۱۸",
    estimatedPrepTime: "لغو و عودت وجه",
    timelineStep: -1,
    delivery: {
      method: "وانت باربری",
      carrier: "باربری بوکان ترابر",
      trackingNumber: "BL-441098",
      shippingCost: 1_800_000,
      address: "تهران، فرمانیه، خیابان دسیان، بن‌بست سوم",
      receiverName: "مشتری نمونه",
      receiverPhone: "۰۹۱۲۰۰۰۰۰۰۴",
      estimatedDeliveryDate: "۱۸ تیر ۱۴۰۳ (مرجوع گردید)",
      deliveryNotes: "به دلیل تغییر در طراحی پروژه مرجوع و مبلغ عودت داده شد.",
    },
    summary: {
      subtotal: 38_000_000,
      shippingCost: 0,
      discount: 0,
      tax: 0,
      total: 38_000_000,
    },
    items: [
      {
        id: "item-601",
        productId: "p8",
        name: "لایم استون بوکان سفید نمای داخلی",
        image: "/test_images/stones/test_8.jpg",
        stoneType: "سنگ آهک (لایم استون)",
        stoneColor: "سفید استخوانی",
        finish: "مات صیقلی نرم",
        form: "تایل ۴۰ طولی",
        dimensions: "۴۰ × آزاد سانتی‌متر",
        thickness: "۱.۶ سانتی‌متر",
        grade: "درجه ۲",
        quantity: 40,
        unit: "متر مربع",
        unitPrice: 950_000,
        totalPrice: 38_000_000,
        sku: "LMS-BK-040",
      },
    ],
  },
];

export interface CustomerInquiry {
  id: string;
  productName: string;
  tenantName: string;
  tenantId: string;
  status: "pending" | "answered";
  date: string;
  ownerId: string;
}

export const inquiryStatusLabel: Record<CustomerInquiry["status"], string> = {
  pending: "در انتظار پاسخ",
  answered: "پاسخ داده‌شده",
};

export const mockInquiries: CustomerInquiry[] = [
  {
    id: "inq-2001",
    productName: "سنگ مرمریت استاندارد برای نمای ساختمان",
    tenantName: "سنگ و سرامیک صنعت",
    tenantId: "tenant-001",
    status: "pending",
    date: "2024-08-14T10:00:00Z",
    ownerId: "u-user-1",
  },
  {
    id: "inq-2002",
    productName: "تراورتن کف — پروژه ویلایی",
    tenantName: "کارخانه سرامیک شمال",
    tenantId: "tenant-003",
    status: "answered",
    date: "2024-08-11T09:00:00Z",
    ownerId: "u-user-1",
  },
];

export interface CustomerAddress {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
  floor?: string;
  hasFreightElevator?: boolean;
  craneAccess?: boolean;
  deliveryType?: "curbside" | "crane" | "forklift";
}

export const deliveryTypeLabel: Record<NonNullable<CustomerAddress["deliveryType"]>, string> = {
  curbside: "تحویل پیاده‌رو",
  crane: "با جرثقیل",
  forklift: "با لیفتراک",
};

export const mockAddresses: CustomerAddress[] = [
  {
    id: "addr-1",
    label: "محل کار",
    address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
    isDefault: true,
    floor: "۳",
    hasFreightElevator: true,
    craneAccess: false,
    deliveryType: "forklift",
  },
  {
    id: "addr-2",
    label: "کارگاه",
    address: "کرج، شهرک صنعتی، بلوار ۵",
    isDefault: false,
    floor: "همکف",
    hasFreightElevator: false,
    craneAccess: true,
    deliveryType: "crane",
  },
];

export interface FavoriteItem {
  id: string;
  productName: string;
  productImage: string;
  tenantName: string;
  tenantId: string;
  addedAt: string;
  ownerId: string;
}

export const mockFavorites: FavoriteItem[] = [
  {
    id: "fav-1",
    productName: "سنگ مرمریت کالاتا گلد",
    productImage: "https://placehold.co/80x80/f1f5f9/475569?text=Calacatta",
    tenantName: "سنگ و سرامیک صنعت",
    tenantId: "tenant-001",
    addedAt: "2024-08-09T12:00:00Z",
    ownerId: "u-user-1",
  },
  {
    id: "fav-2",
    productName: "سنگ گرانیت ناتانس مشکی",
    productImage: "https://placehold.co/80x80/1e293b/f8fafc?text=Granite",
    tenantName: "تجارت سنگ‌های قیمتی",
    tenantId: "tenant-002",
    addedAt: "2024-08-13T15:00:00Z",
    ownerId: "u-user-1",
  },
];


export interface TechnicalDocument {
  id: string;
  title: string;
  type: "quality_certificate" | "spec_sheet";
  productName: string;
  tenantName: string;
  date: string;
}

export const documentTypeLabel: Record<TechnicalDocument["type"], string> = {
  quality_certificate: "گواهی کیفیت",
  spec_sheet: "برگه مشخصات فنی",
};

export const mockDocuments: TechnicalDocument[] = [
  {
    id: "doc-1",
    title: "گواهی کیفیت سنگ مرمریت کالاتا",
    type: "quality_certificate",
    productName: "سنگ مرمریت کالاتا گلد",
    tenantName: "سنگ و سرامیک صنعت",
    date: "2024-08-10T09:00:00Z",
  },
  {
    id: "doc-2",
    title: "برگه مشخصات فنی گرانیت ناتانس",
    type: "spec_sheet",
    productName: "سنگ گرانیت ناتانس مشکی",
    tenantName: "تجارت سنگ‌های قیمتی",
    date: "2024-08-12T14:30:00Z",
  },
];
