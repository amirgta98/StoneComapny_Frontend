"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FactoryOrder } from "@/features/manager/types";
import type { OrderItem, OrderDelivery, OrderSummary } from "@/features/account/data/mock-data";

export interface ExtendedFactoryOrder extends FactoryOrder {
  items?: OrderItem[];
  delivery?: OrderDelivery;
  summary?: OrderSummary;
  destinationCity?: string;
  projectName?: string;
  notes?: string;
  timelineStep?: number; // 0 to 5
}

export interface FactoryOrdersStats {
  totalOrders: number;
  inProductionCount: number;
  inProductionSqm: number;
  readyToShipCount: number;
  totalSalesValue: number;
  urgentCount: number;
  deliveredCount: number;
}

interface FactoryOrdersState {
  orders: ExtendedFactoryOrder[];
  updateOrderStatus: (
    orderId: string,
    status: FactoryOrder["status"],
    trackingInfo?: {
      carrier?: string;
      trackingNumber?: string;
      deliveryDate?: string;
      notes?: string;
    }
  ) => void;
  addOrder: (order: ExtendedFactoryOrder) => void;
  getOrderById: (orderId: string) => ExtendedFactoryOrder | undefined;
  getOrdersByTenant: (tenantId: string) => ExtendedFactoryOrder[];
  getStats: (tenantId: string) => FactoryOrdersStats;
}

export const FACTORY_STATUS_LABELS: Record<FactoryOrder["status"], string> = {
  sourcing: "تأمین کوپ خام",
  cutting: "برش اسلب / تایل",
  processing_surface: "ساب و رزین نانو",
  ready_to_ship: "آماده بارگیری و پالت‌بندی",
  shipping: "در حال ترابری و حمل",
  delivered: "تحویل کارگاه شد",
  cancelled: "لغو شده",
};

export const INITIAL_FACTORY_ORDERS: ExtendedFactoryOrder[] = [
  {
    id: "ord-1001",
    orderNumber: "ORD-SC-1021",
    tenantId: "tenant-001",
    customerName: "مهندس کاظمی",
    customerPhone: "۰۹۱۲۰۰۰۰۰۰۴",
    projectName: "پروژه ویلایی نیلوفر لواسان",
    destinationCity: "لواسان، تهران",
    productName: "سنگ مرمریت کالاتا گلد (اسلب بوک‌مچ)",
    productImage: "/test_images/stones/test_1.jpg",
    stoneType: "مرمریت لوکس",
    form: "اسلب",
    dimensions: "۲۸۰ × ۱۶۰ سانتی‌متر",
    thickness: "۲ سانتی‌متر",
    volume: "۴ اسلب (۱۸ مترمربع)",
    totalPrice: 184_800_000,
    status: "processing_surface",
    statusLabel: "فرآوری، رزین و ساب آینه‌ای",
    createdAt: "۱۴۰۳/۰۶/۱۸",
    deliveryDate: "۱۴۰۳/۰۶/۲۸",
    isUrgent: true,
    timelineStep: 2,
    notes: "نیاز به اجرای اپوکسی توری‌دار پشت اسلب جهت استحکام هنگام نصب روی دیوار لابی.",
    delivery: {
      method: "تریلی کفی اختصاصی سنگ مجهز به پالت A-Frame",
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
      deliveryNotes: "تخلیه اسلب‌ها نیاز به جرثقیل حداقل ۵ تن و تسمه برزنتی پهن دارد.",
    },
    items: [
      {
        id: "item-101",
        name: "اسلب مرمریت کالاتا گلد بوک‌مچ صادراتی",
        image: "/test_images/stones/test_1.jpg",
        stoneType: "مرمریت",
        stoneColor: "سفید زرین رگه‌دار",
        finish: "ساب پولیش فوق آینه‌ای",
        form: "اسلب",
        dimensions: "۲۸۰ × ۱۶۰ سانتی‌متر",
        thickness: "۲ سانتی‌متر",
        grade: "سوپر صادراتی",
        quantity: 4,
        unit: "اسلب (۱۸ مترمربع)",
        unitPrice: 46_200_000,
        totalPrice: 184_800_000,
        sku: "CAL-SLB-001",
      },
    ],
    summary: {
      subtotal: 184_800_000,
      shippingCost: 8_500_000,
      discount: 0,
      tax: 0,
      total: 193_300_000,
    },
  },
  {
    id: "ord-1002",
    orderNumber: "ORD-SC-1022",
    tenantId: "tenant-001",
    customerName: "شرکت مهندسی ابنیه پایدار",
    customerPhone: "۰۹۱۲۳۴۵۶۷۸۹",
    projectName: "مجتمع تجاری اداری الماس اندرزگو",
    destinationCity: "تهران",
    productName: "تایل مرمریت کالاتا گلد کف سالن",
    productImage: "/test_images/stones/test_2.jpg",
    stoneType: "مرمریت",
    form: "تایل",
    dimensions: "۸۰ × ۸۰ سانتی‌متر",
    thickness: "۱.۸ سانتی‌متر",
    volume: "۱۲۰ مترمربع",
    totalPrice: 134_400_000,
    status: "cutting",
    statusLabel: "در حال برش دقیق تایل و کالیبره",
    createdAt: "۱۴۰۳/۰۶/۱۹",
    deliveryDate: "۱۴۰۳/۰۷/۰۲",
    isUrgent: false,
    timelineStep: 1,
    notes: "گونیا بودن و کالیبره بودن زوایا به دقت با کولیس دیجیتال بررسی شود.",
    delivery: {
      method: "کامیون تک ۱۰ تن مسقف",
      carrier: "باربری تخصصی سنگ اصفهان ترابر",
      trackingNumber: "BL-982488",
      shippingCost: 6_200_000,
      address: "تهران، اندرزگو، خیابان سلیمی شمالی، پلاک ۳۲",
      receiverName: "مهندس ناصری",
      receiverPhone: "۰۹۱۲۳۴۵۶۷۸۹",
      estimatedDeliveryDate: "۲ مهر ۱۴۰۳",
      craneAccess: false,
      forkliftAccess: true,
      floor: "طبقه منفی یک (پارکینگ)",
      deliveryNotes: "ورودی پارکینگ ارتفاع ۳.۲۰ متر دارد. تخلیه با جک پالت صورت پذیرد.",
    },
    items: [
      {
        id: "item-102",
        name: "تایل مرمریت کالاتا گلد ابعاد ۸۰×۸۰ کالیبره",
        image: "/test_images/stones/test_2.jpg",
        stoneType: "مرمریت",
        stoneColor: "سفید و عسلی",
        finish: "هون ابریشمی مات",
        form: "تایل",
        dimensions: "۸۰ × ۸۰ سانتی‌متر",
        thickness: "۱.۸ سانتی‌متر",
        grade: "درجه یک صادراتی",
        quantity: 120,
        unit: "مترمربع",
        unitPrice: 1_120_000,
        totalPrice: 134_400_000,
        sku: "CAL-TL-080",
      },
    ],
    summary: {
      subtotal: 134_400_000,
      shippingCost: 6_200_000,
      discount: 4_000_000,
      tax: 0,
      total: 136_600_000,
    },
  },
  {
    id: "ord-1003",
    orderNumber: "ORD-SC-1023",
    tenantId: "tenant-001",
    customerName: "پروژه هتل بین‌المللی ارگ",
    customerPhone: "۰۹۱۲۹۸۷۶۵۴۳",
    projectName: "طراحی لابی و وال پشت رسپشن هتل ارگ",
    destinationCity: "مشهد",
    productName: "اسلب مرمر (آنیکس) سبز زمردی نورگذر",
    productImage: "/test_images/stones/test_6.jpg",
    stoneType: "آنیکس نورگذر",
    form: "اسلب",
    dimensions: "۲۷۰ × ۱۸۰ سانتی‌متر",
    thickness: "۲ سانتی‌متر",
    volume: "۲ اسلب (۹.۷ مترمربع)",
    totalPrice: 240_000_000,
    status: "sourcing",
    statusLabel: "تأمین و انتخاب کوپ مرمر خاص در معدن",
    createdAt: "۱۴۰۳/۰۶/۲۰",
    deliveryDate: "۱۴۰۳/۰۷/۱۰",
    isUrgent: true,
    timelineStep: 0,
    notes: "سنگ مرمر شفاف با تراکم نوری بالا؛ فیلم و عکس کوپ قبل از برش به تایید آرشیتکت پروژه برسد.",
    delivery: {
      method: "کامیون کفی ویژه سنگ‌های فوق قیمتی با صندوق ضربه‌گیر VIP",
      carrier: "ناوگان ویژه سنگ‌های تزیینی ایران",
      trackingNumber: "BL-993021",
      shippingCost: 14_000_000,
      address: "مشهد، بلوار امام رضا، جنب میدان بیت‌المقدس، هتل ارگ",
      receiverName: "مهندس داوودی",
      receiverPhone: "۰۹۱۲۹۸۷۶۵۴۳",
      estimatedDeliveryDate: "۱۰ مهر ۱۴۰۳",
      craneAccess: true,
      forkliftAccess: true,
      floor: "لابی اصلی هتل",
      deliveryNotes: "صندوق چوبی محافظ به هیچ عنوان کج نشود و با لیفتراک لاستیک‌بادی جابجا گردد.",
    },
    items: [
      {
        id: "item-103",
        name: "اسلب مرمر آنیکس سبز زمردی با رگه‌های طلایی",
        image: "/test_images/stones/test_6.jpg",
        stoneType: "آنیکس",
        stoneColor: "سبز یشمی شفاف",
        finish: "ساب شیشه‌ای نانو ضد لک",
        form: "اسلب",
        dimensions: "۲۷۰ × ۱۸۰ سانتی‌متر",
        thickness: "۲ سانتی‌متر",
        grade: "سوپر ممتاز صادراتی",
        quantity: 2,
        unit: "اسلب (۹.۷ مترمربع)",
        unitPrice: 120_000_000,
        totalPrice: 240_000_000,
        sku: "ONX-EM-270",
      },
    ],
    summary: {
      subtotal: 240_000_000,
      shippingCost: 14_000_000,
      discount: 0,
      tax: 0,
      total: 254_000_000,
    },
  },
  {
    id: "ord-1004",
    orderNumber: "ORD-SC-1024",
    tenantId: "tenant-001",
    customerName: "مهندس رضایی (ساختمان دیپلمات)",
    customerPhone: "۰۹۱۲۱۱۱۱۱۱۱",
    projectName: "نمای رومی ساختمان دیپلمات سعادت‌آباد",
    destinationCity: "تهران",
    productName: "تراورتن دره بخاری سوپر موج‌دار",
    productImage: "/test_images/stones/test_5.jpg",
    stoneType: "تراورتن نما",
    form: "تایل",
    dimensions: "۴۰ طولی آزاد",
    thickness: "۱.۸ سانتی‌متر",
    volume: "۳۱۰ مترمربع",
    totalPrice: 217_000_000,
    status: "ready_to_ship",
    statusLabel: "پالت‌بندی شده و آماده بارگیری",
    createdAt: "۱۴۰۳/۰۶/۱۵",
    deliveryDate: "۱۴۰۳/۰۶/۲۴",
    isUrgent: false,
    timelineStep: 3,
    notes: "رزین اپوکسی بی‌رنگ ماستیک شده، سورت سنگ یکدست بدون رگه‌های تیره.",
    delivery: {
      method: "تریلی کفی هجده‌چرخ با ظرفیت ۲۴ تن",
      carrier: "باربری حمل سنگ محلات ترابر",
      trackingNumber: "BL-981105",
      shippingCost: 9_000_000,
      address: "تهران، سعادت‌آباد، میدان کاج، خیابان مروارید، کوچه نهم، پلاک ۴",
      receiverName: "مهندس رضایی",
      receiverPhone: "۰۹۱۲۱۱۱۱۱۱۱",
      estimatedDeliveryDate: "۲۴ شهریور ۱۴۰۳",
      craneAccess: true,
      forkliftAccess: false,
      floor: "پای کارگاه نما",
      deliveryNotes: "خیابان عریض است و تردد تریلی تا ساعت ۱۸ با هماهنگی پلیس راهور بلامانع است.",
    },
    items: [
      {
        id: "item-104",
        name: "تراورتن سفید کرم دره بخاری سوپر ۴۰ طولی",
        image: "/test_images/stones/test_5.jpg",
        stoneType: "تراورتن",
        stoneColor: "کرم روشن مایل به سفید",
        finish: "رزین اپوکسی براق و ساب کله‌بری شده",
        form: "تایل",
        dimensions: "۴۰ × آزاد سانتی‌متر",
        thickness: "۱.۸ سانتی‌متر",
        grade: "سوپر ممتاز",
        quantity: 310,
        unit: "مترمربع",
        unitPrice: 700_000,
        totalPrice: 217_000_000,
        sku: "TRV-DB-040",
      },
    ],
    summary: {
      subtotal: 217_000_000,
      shippingCost: 9_000_000,
      discount: 5_000_000,
      tax: 0,
      total: 221_000_000,
    },
  },
  {
    id: "ord-1005",
    orderNumber: "ORD-SC-1025",
    tenantId: "tenant-001",
    customerName: "پیمانکاری ابنیه آرمان",
    customerPhone: "۰۹۱۲۷۷۷۸۸۹۹",
    projectName: "پلکان و مشاعات برج پارک‌وی",
    destinationCity: "تهران",
    productName: "سنگ گرانیت مشکی نطنز چرمی",
    productImage: "/test_images/stones/test_3.jpg",
    stoneType: "گرانیت",
    form: "پله",
    dimensions: "۱۲۰ × ۳۵ سانتی‌متر",
    thickness: "۳ سانتی‌متر",
    volume: "۸۰ عدد (۳۳.۶ مترمربع)",
    totalPrice: 96_000_000,
    status: "shipping",
    statusLabel: "بارگیری شده و در مسیر حمل به پروژه",
    createdAt: "۱۴۰۳/۰۶/۱۳",
    deliveryDate: "۱۴۰۳/۰۶/۲۳",
    isUrgent: false,
    timelineStep: 4,
    notes: "لبه سنگ‌ها ابزار نیم‌گرد خورده و خطوط ضد لغزش اسکن شده است.",
    delivery: {
      method: "کامیون ۹۱۱ کفی مسقف",
      carrier: "باربری تخصصی گرانیت نطنز",
      trackingNumber: "BL-872019",
      shippingCost: 4_500_000,
      address: "تهران، تقاطع پارک‌وی، خیابان فرشته، بن‌بست آناهیتا",
      receiverName: "آقای کمالی",
      receiverPhone: "۰۹۱۲۷۷۷۸۸۹۹",
      estimatedDeliveryDate: "۲۳ شهریور ۱۴۰۳",
      craneAccess: false,
      forkliftAccess: true,
      floor: "پارکینگ منفی دو",
      deliveryNotes: "راننده با تحویل‌گیرنده هماهنگ است و حواله انبار همراه بارنامه است.",
    },
    items: [
      {
        id: "item-105",
        name: "پله گرانیت مشکی نطنز ۳ سانت ابزار دوبل چرمی",
        image: "/test_images/stones/test_3.jpg",
        stoneType: "گرانیت",
        stoneColor: "مشکی دانه ریز",
        finish: "چرمی ضد سایش با ابزار لب‌گرد",
        form: "پله",
        dimensions: "۱۲۰ × ۳۵ سانتی‌متر",
        thickness: "۳ سانتی‌متر",
        grade: "صادراتی درجه یک",
        quantity: 80,
        unit: "عدد پله",
        unitPrice: 1_200_000,
        totalPrice: 96_000_000,
        sku: "GRN-PL-120",
      },
    ],
    summary: {
      subtotal: 96_000_000,
      shippingCost: 4_500_000,
      discount: 0,
      tax: 0,
      total: 100_500_000,
    },
  },
  {
    id: "ord-1006",
    orderNumber: "ORD-SC-1026",
    tenantId: "tenant-001",
    customerName: "مهندس بهرامی",
    customerPhone: "۰۹۱۲۵۵۵۴۴۳۳",
    projectName: "ویلا مدرن کردان کرج",
    destinationCity: "کردان، البرز",
    productName: "سنگ چینی الیگودرز کریستال سفید",
    productImage: "/test_images/stones/test_7.jpg",
    stoneType: "چینی کریستال",
    form: "اسلب",
    dimensions: "۲۹۰ × ۱۷۵ سانتی‌متر",
    thickness: "۲ سانتی‌متر",
    volume: "۶ اسلب (۳۰.۴ مترمربع)",
    totalPrice: 228_000_000,
    status: "delivered",
    statusLabel: "تحویل کارگاه شد و تایید گردید",
    createdAt: "۱۴۰۳/۰۶/۰۵",
    deliveryDate: "۱۴۰۳/۰۶/۱۷",
    isUrgent: false,
    timelineStep: 5,
    notes: "تحویل سلامت با حضور نماینده کنترل کیفیت کارخانه و سرپرست کارگاه امضا شد.",
    delivery: {
      method: "تریلی کفی پالت‌دار",
      carrier: "ترابری سنگین البرز سنگ",
      trackingNumber: "BL-761203",
      shippingCost: 7_800_000,
      address: "البرز، کردان، خیابان چناران، باغ‌ویلای یاس",
      receiverName: "مهندس بهرامی",
      receiverPhone: "۰۹۱۲۵۵۵۴۴۳۳",
      estimatedDeliveryDate: "۱۷ شهریور ۱۴۰۳ (تحویل شد)",
      craneAccess: true,
      forkliftAccess: true,
      floor: "محوطه ورودی ویلا",
      deliveryNotes: "اسلب‌ها روی خرک فلزی کارگاه قرار گرفتند.",
    },
    items: [
      {
        id: "item-106",
        name: "اسلب چینی الیگودرز کریستال ساب آینه‌ای",
        image: "/test_images/stones/test_7.jpg",
        stoneType: "چینی و کریستال",
        stoneColor: "سفید یخچالی با خطوط طوسی",
        finish: "ساب پولیش شیشه‌ای",
        form: "اسلب",
        dimensions: "۲۹۰ × ۱۷۵ سانتی‌متر",
        thickness: "۲ سانتی‌متر",
        grade: "سوپر ممتاز",
        quantity: 6,
        unit: "اسلب (۳۰.۴ مترمربع)",
        unitPrice: 38_000_000,
        totalPrice: 228_000_000,
        sku: "CRY-AL-290",
      },
    ],
    summary: {
      subtotal: 228_000_000,
      shippingCost: 7_800_000,
      discount: 8_000_000,
      tax: 0,
      total: 227_800_000,
    },
  },
];

export const useFactoryOrdersStore = create<FactoryOrdersState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_FACTORY_ORDERS,

      updateOrderStatus: (orderId, status, trackingInfo) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId && order.orderNumber !== orderId) {
              return order;
            }

            const statusLabel = FACTORY_STATUS_LABELS[status] || status;

            let step = order.timelineStep ?? 0;
            if (status === "sourcing") step = 0;
            else if (status === "cutting") step = 1;
            else if (status === "processing_surface") step = 2;
            else if (status === "ready_to_ship") step = 3;
            else if (status === "shipping") step = 4;
            else if (status === "delivered") step = 5;
            else if (status === "cancelled") step = -1;

            const updatedDelivery: OrderDelivery | undefined = order.delivery
              ? {
                  ...order.delivery,
                  ...(trackingInfo?.carrier && { carrier: trackingInfo.carrier }),
                  ...(trackingInfo?.trackingNumber && {
                    trackingNumber: trackingInfo.trackingNumber,
                  }),
                  ...(trackingInfo?.deliveryDate && {
                    estimatedDeliveryDate: trackingInfo.deliveryDate,
                  }),
                }
              : undefined;

            return {
              ...order,
              status,
              statusLabel,
              timelineStep: step,
              delivery: updatedDelivery,
              deliveryDate: trackingInfo?.deliveryDate ?? order.deliveryDate,
              notes: trackingInfo?.notes ? `${order.notes ? order.notes + " | " : ""}${trackingInfo.notes}` : order.notes,
            };
          }),
        }));
      },

      addOrder: (newOrder) => {
        set((state) => {
          const exists = state.orders.some((o) => o.id === newOrder.id);
          if (exists) {
            return {
              orders: state.orders.map((o) => (o.id === newOrder.id ? newOrder : o)),
            };
          }
          return {
            orders: [newOrder, ...state.orders],
          };
        });
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      },

      getOrdersByTenant: (tenantId) => {
        const all = get().orders;
        // Tenant scoping: default fallback to tenant-001 if order has tenant-001 or matching tenantId
        return all.filter((o) => o.tenantId === tenantId || (!o.tenantId && tenantId === "tenant-001"));
      },

      getStats: (tenantId) => {
        const tenantOrders = get().orders.filter(
          (o) => o.tenantId === tenantId || (!o.tenantId && tenantId === "tenant-001")
        );

        let inProductionCount = 0;
        let inProductionSqm = 0;
        let readyToShipCount = 0;
        let totalSalesValue = 0;
        let urgentCount = 0;
        let deliveredCount = 0;

        for (const o of tenantOrders) {
          totalSalesValue += o.totalPrice;
          if (o.isUrgent && o.status !== "delivered" && o.status !== "cancelled") {
            urgentCount += 1;
          }

          if (o.status === "sourcing" || o.status === "cutting" || o.status === "processing_surface") {
            inProductionCount += 1;
            // Parse approximate sqm from volume string if possible
            const match = o.volume.match(/([۰-۹0-9]+(?:\.[۰-۹0-9]+)?)/);
            if (match) {
              const num = parseFloat(
                match[1].replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
              );
              if (!isNaN(num)) {
                inProductionSqm += num;
              }
            }
          } else if (o.status === "ready_to_ship") {
            readyToShipCount += 1;
          } else if (o.status === "delivered") {
            deliveredCount += 1;
          }
        }

        return {
          totalOrders: tenantOrders.length,
          inProductionCount,
          inProductionSqm: Math.round(inProductionSqm),
          readyToShipCount,
          totalSalesValue,
          urgentCount,
          deliveredCount,
        };
      },
    }),
    {
      name: "stone-factory-orders-storage",
    }
  )
);
