export type SupportStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_USER"
  | "WAITING_SUPPORT"
  | "RESPONDED"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";

export type SupportCategory =
  | "ORDER"
  | "PRODUCT"
  | "PAYMENT"
  | "SHIPPING"
  | "RETURN"
  | "ACCOUNT"
  | "TECHNICAL"
  | "OTHER";

export type SupportPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type SupportSenderType =
  | "CUSTOMER"
  | "SUPPORT_AGENT"
  | "MANAGER"
  | "SUPER_ADMIN"
  | "SYSTEM";

export interface SupportAttachment {
  id: string;
  name: string;
  url: string;
  size: number; // bytes
  mimeType: string;
}

export interface SupportMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: SupportSenderType;
  body: string;
  attachments?: SupportAttachment[];
  createdAt: string;
  readAt?: string | null;
}

export interface SupportConversation {
  id: string;
  conversationNumber: string; // e.g. SUP-1403-9102
  userId: string;
  tenantId?: string | null;
  subject: string;
  category: SupportCategory;
  status: SupportStatus;
  priority?: SupportPriority;
  assignedDepartment?: string;
  assignedAgentName?: string;
  orderId?: string;
  productId?: string;
  lastMessagePreview?: string;
  lastMessageAt: string;
  unreadCountCustomer: number;
  unreadCountSupport: number;
  rejectionReason?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupportStatusConfig {
  label: string;
  description: string;
  badgeClass: string;
  dotClass: string;
  canSendMessage: boolean;
  canClose: boolean;
}

export const SUPPORT_STATUS_CONFIG: Record<SupportStatus, SupportStatusConfig> = {
  OPEN: {
    label: "باز",
    description: "درخواست ثبت شده و منتظر بررسی کارشناس است.",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-500",
    canSendMessage: true,
    canClose: true,
  },
  IN_PROGRESS: {
    label: "در حال پیگیری",
    description: "کارشناس پشتیبانی در حال پیگیری درخواست شما است.",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-500",
    canSendMessage: true,
    canClose: true,
  },
  WAITING_USER: {
    label: "منتظر پاسخ شما",
    description: "پشتیبانی به پیام شما پاسخ داده و منتظر ارسال توضیحات یا مدارک تکمیلی از طرف شماست.",
    badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    dotClass: "bg-purple-500",
    canSendMessage: true,
    canClose: true,
  },
  WAITING_SUPPORT: {
    label: "منتظر پاسخ پشتیبانی",
    description: "پیام شما ارسال شد و در صف پاسخ‌گویی کارشناسان قرار دارد.",
    badgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    dotClass: "bg-sky-500",
    canSendMessage: true,
    canClose: true,
  },
  RESPONDED: {
    label: "پاسخ داده شده",
    description: "پاسخ کامل کارشناس برای شما ارسال شده است.",
    badgeClass: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
    dotClass: "bg-teal-500",
    canSendMessage: true,
    canClose: true,
  },
  RESOLVED: {
    label: "حل شده",
    description: "درخواست با موفقیت حل و فصل شده است.",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-500",
    canSendMessage: true,
    canClose: true,
  },
  CLOSED: {
    label: "بسته شده",
    description: "این گفتگو بسته شده است و امکان ارسال پیام جدید وجود ندارد.",
    badgeClass: "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20",
    dotClass: "bg-stone-400",
    canSendMessage: false,
    canClose: false,
  },
  REJECTED: {
    label: "رد شده",
    description: "درخواست بنا به دلایل قید شده رد گردیده است.",
    badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    dotClass: "bg-rose-500",
    canSendMessage: false,
    canClose: false,
  },
};

export interface SupportCategoryConfig {
  label: string;
  iconName: string;
  description: string;
}

export const SUPPORT_CATEGORY_CONFIG: Record<SupportCategory, SupportCategoryConfig> = {
  ORDER: {
    label: "سفارش",
    iconName: "ShoppingBag",
    description: "پیگیری وضعیت تولید، برش، بارگیری یا تحویل سفارش سنگ",
  },
  PRODUCT: {
    label: "محصول و استعلام",
    iconName: "Layers",
    description: "مشخصات فنی سنگ، سورت، متراژ، قیمت و کوپ معدن",
  },
  PAYMENT: {
    label: "پرداخت و فاکتور",
    iconName: "CreditCard",
    description: "تراکنش‌های مالی، پیش‌فاکتور، فاکتور رسمی و تسویه حساب",
  },
  SHIPPING: {
    label: "ارسال و باربری",
    iconName: "Truck",
    description: "هماهنگی باربری، جراثقال، تخلیه کارگاهی و کرایه حمل",
  },
  RETURN: {
    label: "مرجوعی و خسارت",
    iconName: "RotateCcw",
    description: "مغایرت سورت، شکستگی سنگ در حمل یا درخواست عودت",
  },
  ACCOUNT: {
    label: "حساب کاربری",
    iconName: "User",
    description: "اطلاعات پروفایل، شماره همراه و دسترسی‌ها",
  },
  TECHNICAL: {
    label: "مشکل فنی و سایت",
    iconName: "AlertTriangle",
    description: "ایرادات فنی در ثبت سفارش، سبد خرید یا بارگذاری تصاویر",
  },
  OTHER: {
    label: "سایر موضوعات",
    iconName: "HelpCircle",
    description: "سایر سوالات و درخواست‌های متفرقه از مدیریت کارخانه",
  },
};

export type SupportEventType =
  | "MESSAGE_CREATED"
  | "MESSAGE_UPDATED"
  | "MESSAGE_DELETED"
  | "CONVERSATION_STATUS_CHANGED"
  | "MESSAGE_READ"
  | "AGENT_ASSIGNED";

export interface SupportEvent<T = unknown> {
  type: SupportEventType;
  conversationId: string;
  payload: T;
  timestamp: string;
}
