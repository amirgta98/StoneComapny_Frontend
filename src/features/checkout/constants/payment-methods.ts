import type {
  PaymentMethodOption,
  PaymentGateway,
  CouponInfo,
} from "../types";

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "online",
    title: "پرداخت اینترنتی آنلاین شاپرک",
    description:
      "پرداخت آنی و امن با کلیه کارت‌های عضو شبکه بانکی شتاب از طریق درگاه‌های معتبر بانکی کشور.",
    badge: "تسویه آنی و امن",
    icon: "CreditCard",
    enabled: true,
  },
  {
    id: "bank_transfer",
    title: "حواله بانکی پایا / ساتنا (مخصوص سفارش‌های عمده و پروژه‌ای)",
    description:
      "واریز به شماره شبای رسمی شرکت و ثبت فیش حواله بانکی. تایید نهایی سفارش پس از تایید واحد مالی انجام می‌پذیرد.",
    badge: "ویژه پروژه‌ها و شرکت‌ها",
    icon: "Building2",
    enabled: true,
  },
  {
    id: "on_delivery",
    title: "پرداخت در محل (هنگام تحویل بار در انبار کارخانه)",
    description:
      "تسویه حساب از طریق کارت‌خوان اختصاصی هنگام حضور در انبار و بازرسی نهایی سلامت و سورت سنگ‌ها.",
    badge: "فقط تحویل حضوری",
    icon: "BadgeDollarSign",
    enabled: true,
  },
];

export const ONLINE_GATEWAYS: PaymentGateway[] = [
  {
    id: "saman",
    name: "درگاه پرداخت بانک سامان (سپ)",
    description: "پرداخت پایدار و امن با سامانه پرداخت الکترونیک سامان",
    isDefault: true,
  },
  {
    id: "mellat",
    name: "درگاه به‌پرداخت ملت",
    description: "سامانه رسمی پرداخت اینترنتی بانک ملت",
  },
  {
    id: "zarinpal",
    name: "درگاه پرداخت زرین‌پال",
    description: "سامانه پرداخت امن شاپرک با ضمانت بازگشت وجه",
  },
];

export const VALID_COUPONS: Record<string, CouponInfo> = {
  STONE10: {
    code: "STONE10",
    discountType: "percent",
    amount: 10, // 10%
    description: "تخفیف ۱۰ درصدی جشنواره سنگ طبیعی",
    minOrderSubtotal: 1_000_000,
  },
  NOROOZ: {
    code: "NOROOZ",
    discountType: "fixed",
    amount: 500_000, // 500,000 تومان
    description: "تخفیف پانصد هزار تومانی ویژه بهاره",
    minOrderSubtotal: 3_000_000,
  },
  MEMAR: {
    code: "MEMAR",
    discountType: "percent",
    amount: 5, // 5%
    description: "تخفیف ۵ درصدی معماران و طراحان ساختمانی",
    minOrderSubtotal: 2_000_000,
  },
  VIP: {
    code: "VIP",
    discountType: "fixed",
    amount: 1_000_000, // 1,000,000 تومان
    description: "تخفیف ویژه مشتریان وفادار برای خریدهای بالای ۱۰ میلیون تومان",
    minOrderSubtotal: 10_000_000,
  },
};
