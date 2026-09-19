"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  FactoryCustomer,
  CustomerStats,
  CustomerNote,
  CustomerFinancialLedgerItem,
  CustomerCheck,
  CreditStatus,
} from "../types";

interface FactoryCustomersState {
  customers: FactoryCustomer[];
  addCustomer: (
    data: Omit<
      FactoryCustomer,
      | "id"
      | "code"
      | "createdAt"
      | "totalPurchasedSqm"
      | "totalOrdersCount"
      | "totalSpentTomans"
      | "orders"
      | "inquiries"
      | "financialLedger"
      | "checks"
      | "interactions"
    >
  ) => FactoryCustomer;
  updateCustomer: (id: string, updates: Partial<FactoryCustomer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => FactoryCustomer | undefined;
  getCustomersByTenant: (tenantId: string) => FactoryCustomer[];
  getStats: (tenantId: string) => CustomerStats;
  addCustomerNote: (
    customerId: string,
    note: Omit<CustomerNote, "id" | "date">
  ) => void;
  addFinancialEntry: (
    customerId: string,
    entry: Omit<CustomerFinancialLedgerItem, "id">
  ) => void;
  addCustomerCheck: (
    customerId: string,
    check: Omit<CustomerCheck, "id">
  ) => void;
  updateCheckStatus: (
    customerId: string,
    checkId: string,
    status: CustomerCheck["status"]
  ) => void;
  resetToMockData: () => void;
}

export const INITIAL_CUSTOMERS: FactoryCustomer[] = [
  {
    id: "cust-1001",
    tenantId: "tenant-001",
    code: "CUST-1001",
    name: "مهندس کاظمی",
    role: "CONTRACTOR",
    status: "active",
    phone: "۰۹۱۲۰۰۰۰۰۰۴",
    email: "kazemi.niloufar@gmail.com",
    nationalId: "۰۰۷۸۴۵۱۲۹۰",
    economicCode: "۴۱۱۸۹۳۲۵۴۱۱",
    companyName: "گروه ساختمانی مهندسین کاظمی و شرکا",
    projectName: "برج باغ نیلوفر لواسان",
    projectLocation: "تهران، لواسان، بلوار باستی، پلاک ۱۸",
    city: "لواسان، تهران",
    address: "تهران، لواسان، بلوار باستی، پروژه ویلایی نیلوفر",
    creditLimit: 1_000_000_000,
    currentBalance: 184_800_000,
    pendingChecksTotal: 120_000_000,
    creditStatus: "safe",
    paymentTerms: "۳۰٪ نقد، مابقی چک صیادی ۶۰ روزه",
    preferredStones: ["مرمریت", "مرمر / آنیکس", "تراورتن"],
    totalPurchasedSqm: 338,
    totalOrdersCount: 2,
    totalSpentTomans: 420_000_000,
    createdAt: "۱۴۰۳/۰۱/۱۵",
    lastOrderDate: "۱۴۰۳/۰۶/۱۸",
    notes: "پیمانکار خوش‌حساب پروژه‌های لوکس منطقه لواسان و شمیرانات. تأکید روی ساب آینه‌ای و گونیا بودن اسلب‌ها.",
    orders: [
      {
        id: "ord-1001",
        orderNumber: "ORD-SC-1021",
        productName: "سنگ مرمریت کالاتا گلد (اسلب بوک‌مچ)",
        stoneType: "مرمریت لوکس",
        dimensions: "۲۸۰ × ۱۶۰ سانتی‌متر",
        volume: "۴ اسلب (۱۸ مترمربع)",
        volumeSqm: 18,
        totalPrice: 184_800_000,
        status: "processing_surface",
        statusLabel: "فرآوری، رزین و ساب آینه‌ای",
        orderDate: "۱۴۰۳/۰۶/۱۸",
      },
      {
        id: "ord-0982",
        orderNumber: "ORD-SC-0982",
        productName: "تراورتن شکلاتی کاشان ساب‌خورده موج‌دار",
        stoneType: "تراورتن نما",
        dimensions: "۴۰ طولی آزاد",
        volume: "۳۲۰ مترمربع",
        volumeSqm: 320,
        totalPrice: 235_200_000,
        status: "delivered",
        statusLabel: "تحویل کارگاه شد",
        orderDate: "۱۴۰۳/۰۴/۱۱",
      },
    ],
    inquiries: [
      {
        id: "inq-101",
        rfqNumber: "RFQ-24-0089",
        stoneTitle: "اسلب مرمریت لاشتر بوش‌همر چرمی",
        stoneType: "مرمریت",
        volume: "۴۵۰ مترمربع",
        status: "pending",
        statusLabel: "در انتظار صدور پیش‌فاکتور",
        date: "۱۴۰۳/۰۶/۲۰",
        urgency: "high",
        notes: "نیاز به ارسال نمونه سنگ فرآوری‌شده به دفتر پروژه لواسان تا پیش از عقد قرارداد نهایی.",
      },
    ],
    financialLedger: [
      {
        id: "led-1",
        date: "۱۴۰۳/۰۴/۱۱",
        type: "invoice",
        typeLabel: "فاکتور فروش سنگ",
        documentNumber: "INV-1403-0982",
        description: "فاکتور خرید ۳۲۰ متر تراورتن شکلاتی سفارش ORD-SC-0982",
        debit: 235_200_000,
        credit: 0,
        balance: 235_200_000,
      },
      {
        id: "led-2",
        date: "۱۴۰۳/۰۴/۱۵",
        type: "payment",
        typeLabel: "واریز حواله نقدی",
        documentNumber: "PAY-54120",
        description: "واریز پیش‌پرداخت نقدی به حساب کارخانه",
        debit: 0,
        credit: 70_560_000,
        balance: 164_640_000,
        paymentMethod: "حواله ساتنا بانک ملت",
      },
      {
        id: "led-3",
        date: "۱۴۰۳/۰۵/۲۵",
        type: "payment",
        typeLabel: "وصول چک صیادی",
        documentNumber: "CHK-CLR-901",
        description: "وصول چک شماره ۲۳۴۱/۹۸ راس‌المال",
        debit: 0,
        credit: 164_640_000,
        balance: 0,
        paymentMethod: "چک صیادی بانک صادرات",
      },
      {
        id: "led-4",
        date: "۱۴۰۳/۰۶/۱۸",
        type: "invoice",
        typeLabel: "فاکتور فروش سنگ",
        documentNumber: "INV-1403-1021",
        description: "فاکتور خرید ۴ اسلب بوک‌مچ کالاتا گلد سفارش ORD-SC-1021",
        debit: 184_800_000,
        credit: 0,
        balance: 184_800_000,
      },
    ],
    checks: [
      {
        id: "chk-101",
        checkNumber: "۲۳۴۱/۹۸۰۲",
        sayadId: "۷۸۹۲۳۴۵۶۱۰۹۲۳۴۸۱",
        bankName: "بانک ملت",
        branch: "شعبه لواسان (کد ۲۳۴)",
        dueDate: "۱۴۰۳/۰۷/۲۰",
        amount: 120_000_000,
        drawerName: "مهندس کاظمی",
        status: "pending",
        statusLabel: "در جریان وصول",
        registeredDate: "۱۴۰۳/۰۶/۱۹",
        notes: "بابت مابقی پیش‌فاکتور اسلب کالاتا گلد پروژه لواسان",
      },
    ],
    interactions: [
      {
        id: "nt-1",
        date: "۱۴۰۳/۰۶/۱۹",
        author: "مدیر فروش (مهندس رادمنش)",
        type: "call",
        typeLabel: "تماس تلفنی",
        title: "هماهنگی جرثقیل جهت تخلیه اسلب در کارگاه لواسان",
        content: "با سرپرست کارگاه صحبت شد. روز دوشنبه جرثقیل ۵ تن مستقر خواهد بود و کوچه باستی باز است.",
      },
      {
        id: "nt-2",
        date: "۱۴۰۳/۰۶/۱۸",
        author: "مدیر فروش (مهندس رادمنش)",
        type: "agreement",
        typeLabel: "توافق مالی",
        title: "تایید سفارش ۴ اسلب کالاتا گلد و دریافت چک صیادی",
        content: "اسلب‌ها با رگه‌های متقارن بوک‌مچ انتخاب و شماره‌گذاری شد. چک ۱۲۰ میلیونی در سامانه صیاد تایید گردید.",
      },
    ],
  },
  {
    id: "cust-1002",
    tenantId: "tenant-001",
    code: "CUST-1002",
    name: "شرکت مهندسی ابنیه پایدار",
    role: "CONTRACTOR",
    status: "active",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    email: "info@abnieh-paydar.ir",
    nationalId: "۱۰۱۰۳۸۲۴۵۹۱",
    economicCode: "۴۱۱۳۹۸۷۲۱۵۶",
    companyName: "شرکت مهندسی و ابنیه‌سازی پایدار",
    projectName: "مجتمع تجاری اداری صبا",
    projectLocation: "تهران، خیابان شریعتی، بالاتر از پل رومی",
    city: "تهران",
    address: "تهران، شریعتی، نرسیده به ظفر، برج تجاری پارس، طبقه ۸",
    creditLimit: 1_500_000_000,
    currentBalance: 268_800_000,
    pendingChecksTotal: 200_000_000,
    creditStatus: "safe",
    paymentTerms: "اعتباری ۴۵ روزه با ضمانت چک صیادی",
    preferredStones: ["مرمریت", "گرانیت", "تراورتن"],
    totalPurchasedSqm: 640,
    totalOrdersCount: 3,
    totalSpentTomans: 580_000_000,
    createdAt: "۱۴۰۲/۱۰/۲۰",
    lastOrderDate: "۱۴۰۳/۰۶/۱۹",
    notes: "قرارداد تأمین سنگ کف و مشاعات برج تجاری اداری صبا در ۳ فاز اجرایی.",
    orders: [
      {
        id: "ord-1002",
        orderNumber: "ORD-SC-1022",
        productName: "تایل مرمریت کالاتا گلد کف سالن (۸۰×۸۰)",
        stoneType: "مرمریت",
        dimensions: "۸۰ × ۸۰ سانتی‌متر",
        volume: "۱۲۰ مترمربع",
        volumeSqm: 120,
        totalPrice: 134_400_000,
        status: "cutting",
        statusLabel: "در حال برش دقیق تایل",
        orderDate: "۱۴۰۳/۰۶/۱۹",
      },
    ],
    inquiries: [
      {
        id: "inq-102",
        rfqNumber: "RFQ-24-0091",
        stoneTitle: "تراورتن شکلاتی کاشان ساب‌خورده",
        stoneType: "تراورتن",
        volume: "۸۰۰ متر طول",
        status: "pending",
        statusLabel: "در حال بررسی خط برش",
        date: "۱۴۰۳/۰۶/۲۱",
        urgency: "normal",
        notes: "استعلام قیمت نقدی و شرایط تحویل طی ۳ پارت مجزا به پای کارگاه خیابان شریعتی.",
      },
    ],
    financialLedger: [
      {
        id: "led-201",
        date: "۱۴۰۳/۰۵/۰۲",
        type: "invoice",
        typeLabel: "فاکتور فروش سنگ",
        documentNumber: "INV-1403-0850",
        description: "فاکتور پارت اول تایل گرانیت نهبندان ۵۲۰ متر",
        debit: 268_800_000,
        credit: 0,
        balance: 268_800_000,
      },
    ],
    checks: [
      {
        id: "chk-201",
        checkNumber: "۴۵۱۱/۱۲",
        sayadId: "۹۰۸۱۲۳۴۵۶۱۸۲۹۳۴۱",
        bankName: "بانک تجارت",
        branch: "شعبه میرداماد",
        dueDate: "۱۴۰۳/۰۸/۱۰",
        amount: 200_000_000,
        drawerName: "شرکت مهندسی ابنیه پایدار",
        status: "pending",
        statusLabel: "در جریان وصول",
        registeredDate: "۱۴۰۳/۰۶/۰۲",
      },
    ],
    interactions: [
      {
        id: "nt-201",
        date: "۱۴۰۳/۰۶/۱۹",
        author: "مهندس رضازاده (کنترل کیفیت)",
        type: "meeting",
        typeLabel: "جلسه حضوری",
        title: "بررسی تلورانس ضخامت تایل‌های ۸۰×۸۰",
        content: "نماینده شرکت در کارخانه حاضر شد و کالیبراسیون دستگاه کالیبر تایل‌ها مورد تأیید قرار گرفت.",
      },
    ],
  },
  {
    id: "cust-1003",
    tenantId: "tenant-001",
    code: "CUST-1003",
    name: "مهندس شفیعی (آرشیتکت)",
    role: "ARCHITECT",
    status: "active",
    phone: "۰۹۱۲۵۵۵۱۲۳۴",
    email: "shafiei.studio@architect.com",
    nationalId: "۰۰۸۱۴۵۲۹۰۱",
    companyName: "آتلیه معماری و دیزاین شفیعی",
    projectName: "پنت‌هاوس و بام سبز نیاوران",
    projectLocation: "تهران، نیاوران، خیابان یاسر",
    city: "تهران",
    address: "تهران، نیاوران، سه راه یاسر، برج آناهیتا، واحد ۴۰۲",
    creditLimit: 500_000_000,
    currentBalance: 45_000_000,
    pendingChecksTotal: 0,
    creditStatus: "safe",
    paymentTerms: "تسویه بر اساس پیش‌فاکتور و تایید نهایی نمونه کارگاهی",
    preferredStones: ["مرمریت", "لایم‌استون", "مرمر / آنیکس"],
    totalPurchasedSqm: 180,
    totalOrdersCount: 1,
    totalSpentTomans: 145_000_000,
    createdAt: "۱۴۰۳/۰۲/۱۰",
    lastOrderDate: "۱۴۰۳/۰۵/۱۵",
    notes: "طراح ارشد پروژه‌های شاخص منطقه ۱. نیازمند سنگ‌های دارای بافت خاص مانند بوش‌همر چرمی و اسلب‌های نورگذر.",
    orders: [
      {
        id: "ord-1005",
        orderNumber: "ORD-SC-0995",
        productName: "اسلب لایم‌استون گوهره خرم‌آباد چرمی",
        stoneType: "لایم‌استون",
        dimensions: "۲۶۰ × ۱۴۰ سانتی‌متر",
        volume: "۱۸۰ مترمربع",
        volumeSqm: 180,
        totalPrice: 145_000_000,
        status: "delivered",
        statusLabel: "تحویل کارگاه شد",
        orderDate: "۱۴۰۳/۰۵/۱۵",
      },
    ],
    inquiries: [
      {
        id: "inq-101-b",
        rfqNumber: "RFQ-24-0078",
        stoneTitle: "اسلب مرمریت لاشتر بوش‌همر چرمی",
        stoneType: "مرمریت",
        volume: "۴۵۰ مترمربع",
        status: "pending",
        statusLabel: "در حال بررسی ضخامت ۲ سانت",
        date: "۱۴۰۳/۰۶/۲۲",
        urgency: "high",
        notes: "ارسال ۱۰ پلاک نمونه بوش‌همر چرمی ۱۰×۱۰ به دفتر طراحی نیاوران الزامی است.",
      },
    ],
    financialLedger: [
      {
        id: "led-301",
        date: "۱۴۰۳/۰۵/۱۵",
        type: "invoice",
        typeLabel: "فاکتور فروش سنگ",
        documentNumber: "INV-1403-0995",
        description: "فاکتور ۱۸۰ متر لایم‌استون گوهره چرمی",
        debit: 145_000_000,
        credit: 0,
        balance: 145_000_000,
      },
      {
        id: "led-302",
        date: "۱۴۰۳/۰۵/۱۸",
        type: "payment",
        typeLabel: "واریز حواله نقدی",
        documentNumber: "PAY-65100",
        description: "واریز مرحله اول پرداخت نقدی",
        debit: 0,
        credit: 100_000_000,
        balance: 45_000_000,
        paymentMethod: "حواله پایا بانک پاسارگاد",
      },
    ],
    checks: [],
    interactions: [
      {
        id: "nt-301",
        date: "۱۴۰۳/۰۶/۲۲",
        author: "مدیر عامل",
        type: "visit",
        typeLabel: "بازدید از کارخانه",
        title: "بازدید مهندس شفیعی از خط ساب و خط بوش‌همر",
        content: "از دپوی اسلب لاشتر بازدید شد و بافت نمونه چرمی با لقمه‌های ۱۲۰ مورد تایید ایشان قرار گرفت.",
      },
    ],
  },
  {
    id: "cust-1004",
    tenantId: "tenant-001",
    code: "CUST-1004",
    name: "پروژه هتل بین‌المللی ارگ",
    role: "CONTRACTOR",
    status: "active",
    phone: "۰۹۱۲۹۸۷۶۵۴۳",
    email: "procurement@arg-hotel.com",
    nationalId: "۱۰۳۸۰۲۱۴۵۵۹",
    economicCode: "۴۱۱۶۸۲۳۴۹۱۱",
    companyName: "گروه توسعه هتل‌های بین‌المللی ارگ",
    projectName: "فاز توسعه و لابی هتل ارگ",
    projectLocation: "کیش، میدان غروب، مجموعه هتل ارگ",
    city: "کیش",
    address: "کیش، میدان غروب، بلوار دریا، هتل پنج ستاره ارگ",
    creditLimit: 2_500_000_000,
    currentBalance: 340_000_000,
    pendingChecksTotal: 350_000_000,
    creditStatus: "safe",
    paymentTerms: "اعتباری با ضمانت‌نامه بانکی و چک تضمین شرکتی",
    preferredStones: ["مرمر / آنیکس", "مرمریت", "گرانیت"],
    totalPurchasedSqm: 520,
    totalOrdersCount: 2,
    totalSpentTomans: 890_000_000,
    createdAt: "۱۴۰۲/۱۱/۰۵",
    lastOrderDate: "۱۴۰۳/۰۶/۲۰",
    notes: "پروژه هتل ۵ ستاره. نیازمند بسته‌بندی در پالت‌های فلزی مقاوم به رطوبت و نمک دریایی جهت بارگیری لندیگراف به جزیره کیش.",
    orders: [
      {
        id: "ord-1003",
        orderNumber: "ORD-SC-1023",
        productName: "اسلب مرمر (آنیکس) سبز زمردی نورگذر",
        stoneType: "آنیکس نورگذر",
        dimensions: "۲۷۰ × ۱۸۰ سانتی‌متر",
        volume: "۲ اسلب (۹.۷ مترمربع)",
        volumeSqm: 9.7,
        totalPrice: 240_000_000,
        status: "sourcing",
        statusLabel: "انتخاب کوپ مرمر خاص در معدن",
        orderDate: "۱۴۰۳/۰۶/۲۰",
      },
    ],
    inquiries: [],
    financialLedger: [
      {
        id: "led-401",
        date: "۱۴۰۳/۰۶/۲۰",
        type: "invoice",
        typeLabel: "فاکتور اسلب آنیکس",
        documentNumber: "INV-1403-1023",
        description: "فاکتور خرید ۲ اسلب مرمر سبز زمردی سفارش ORD-SC-1023",
        debit: 240_000_000,
        credit: 0,
        balance: 340_000_000,
      },
    ],
    checks: [
      {
        id: "chk-401",
        checkNumber: "۷۸۱۲/۳۰",
        sayadId: "۴۰۹۲۳۴۵۶۱۸۲۹۳۴۵۶",
        bankName: "بانک سامان",
        branch: "شعبه مرکزی کیش",
        dueDate: "۱۴۰۳/۰۸/۳۰",
        amount: 350_000_000,
        drawerName: "گروه توسعه هتل‌های ارگ",
        status: "pending",
        statusLabel: "در جریان وصول",
        registeredDate: "۱۴۰۳/۰۶/۰۵",
      },
    ],
    interactions: [
      {
        id: "nt-401",
        date: "۱۴۰۳/۰۶/۲۰",
        author: "مهندس کاوش",
        type: "call",
        typeLabel: "تماس تلفنی",
        title: "تأیید استخراج کوپ مرمر سبز در معدن",
        content: "تصاویر با کیفیت ۴K از بلوک معدنی مرمر ارسال و توسط ناظر فنی هتل ارگ تایید شد.",
      },
    ],
  },
  {
    id: "cust-1005",
    tenantId: "tenant-001",
    code: "CUST-1005",
    name: "سنگ‌بری و بازرگانی شمس",
    role: "SHOWROOM",
    status: "active",
    phone: "۰۹۱۲۲۲۲۳۳۴۴",
    email: "shams.stone@yahoo.com",
    nationalId: "۰۰۵۹۸۷۴۱۲۳",
    companyName: "شوروم و انبار مرکزی سنگ شمس",
    projectName: "نمایشگاه تخصصی بازار سنگ شمس‌آباد",
    projectLocation: "تهران، شهرک صنعتی شمس‌آباد، بلوار بوستان",
    city: "ری (شمس‌آباد)",
    address: "شهرک صنعتی شمس‌آباد، بلوار بوستان، گلبن دهم، پلاک ۲۴",
    creditLimit: 2_000_000_000,
    currentBalance: 1_780_000_000,
    pendingChecksTotal: 950_000_000,
    creditStatus: "warning",
    paymentTerms: "۳۰٪ نقد، مابقی چک‌های صیادی ۲ تا ۳ ماهه معتبر",
    preferredStones: ["تراورتن", "مرمریت", "لایم‌استون"],
    totalPurchasedSqm: 1850,
    totalOrdersCount: 6,
    totalSpentTomans: 2_450_000_000,
    createdAt: "۱۴۰۱/۰۸/۱۴",
    lastOrderDate: "۱۴۰۳/۰۶/۰۲",
    notes: "نمایشگاه‌دار معتبر و توزیع‌کننده عمده در بازار تهران. مانده حساب به سقف اعتبار نزدیک است؛ صدور فاکتور جدید منوط به وصول حداقل یک پارت چک می‌باشد.",
    orders: [],
    inquiries: [],
    financialLedger: [
      {
        id: "led-501",
        date: "۱۴۰۳/۰۶/۰۲",
        type: "invoice",
        typeLabel: "فاکتور عمده سنگ",
        documentNumber: "INV-1403-0940",
        description: "فاکتور خرید پالت‌های تراورتن کرم آتشکوه ۷۰۰ متر",
        debit: 750_000_000,
        credit: 0,
        balance: 1_780_000_000,
      },
    ],
    checks: [
      {
        id: "chk-501",
        checkNumber: "۶۶۱۱/۸۲",
        sayadId: "۲۳۰۹۸۴۵۶۱۲۹۸۳۴۵۱",
        bankName: "بانک ملی",
        branch: "شعبه شمس‌آباد",
        dueDate: "۱۴۰۳/۰۷/۱۵",
        amount: 450_000_000,
        drawerName: "رضا شمس",
        status: "pending",
        statusLabel: "در جریان وصول",
        registeredDate: "۱۴۰۳/۰۶/۰۳",
      },
      {
        id: "chk-502",
        checkNumber: "۶۶۱۲/۸۲",
        sayadId: "۲۳۰۹۸۴۵۶۱۲۹۸۳۴۵۲",
        bankName: "بانک ملی",
        branch: "شعبه شمس‌آباد",
        dueDate: "۱۴۰۳/۰۸/۱۵",
        amount: 500_000_000,
        drawerName: "رضا شمس",
        status: "pending",
        statusLabel: "در جریان وصول",
        registeredDate: "۱۴۰۳/۰۶/۰۳",
      },
    ],
    interactions: [
      {
        id: "nt-501",
        date: "۱۴۰۳/۰۶/۱۰",
        author: "حسابداری کارخانه",
        type: "call",
        typeLabel: "تماس تلفنی",
        title: "اعلام وضعیت اعتبار و هشدار سقف خرید",
        content: "به حاج آقا شمس اطلاع داده شد که مانده حساب به ۸۹٪ سقف رسیده است و پارت جدید بعد از پاس شدن چک ۱۵ مهر بارگیری می‌شود.",
      },
    ],
  },
  {
    id: "cust-1006",
    tenantId: "tenant-001",
    code: "CUST-1006",
    name: "مهندس رضایی",
    role: "CONTRACTOR",
    status: "active",
    phone: "۰۹۱۲۱۱۱۱۱۱۱",
    email: "rezaei.farmanieh@yahoo.com",
    nationalId: "۰۰۶۴۵۱۲۳۸۹",
    companyName: "شرکت مهندسین مشاور سازه‌گستر دیپلمات",
    projectName: "ساختمان دیپلمات فرمانیه",
    projectLocation: "تهران، فرمانیه، خیابان سنبل",
    city: "تهران",
    address: "تهران، فرمانیه غربی، خیابان سنبل، پلاک ۱۲",
    creditLimit: 800_000_000,
    currentBalance: 217_000_000,
    pendingChecksTotal: 90_000_000,
    creditStatus: "safe",
    paymentTerms: "۳۰٪ نقد هنگام عقد قرارداد، مابقی در زمان تحویل پالت‌ها",
    preferredStones: ["تراورتن", "مرمریت"],
    totalPurchasedSqm: 490,
    totalOrdersCount: 2,
    totalSpentTomans: 382_000_000,
    createdAt: "۱۴۰۳/۰۱/۲۵",
    lastOrderDate: "۱۴۰۳/۰۶/۱۵",
    notes: "پروژه مسکونی لوکس منطقه ۱ با نمای ترکیبی رومی مدرن تراورتن دره بخاری.",
    orders: [
      {
        id: "ord-1004",
        orderNumber: "ORD-SC-1024",
        productName: "تراورتن دره بخاری سوپر موج‌دار (۴۰ طولی)",
        stoneType: "تراورتن نما",
        dimensions: "۴۰ طولی آزاد",
        volume: "۳۱۰ مترمربع",
        volumeSqm: 310,
        totalPrice: 217_000_000,
        status: "ready_to_ship",
        statusLabel: "پالت‌بندی شده و آماده بارگیری",
        orderDate: "۱۴۰۳/۰۶/۱۵",
      },
    ],
    inquiries: [],
    financialLedger: [
      {
        id: "led-601",
        date: "۱۴۰۳/۰۶/۱۵",
        type: "invoice",
        typeLabel: "فاکتور فروش سنگ",
        documentNumber: "INV-1403-1024",
        description: "فاکتور تراورتن دره بخاری سوپر ۳۱۰ متر سفارش ORD-SC-1024",
        debit: 217_000_000,
        credit: 0,
        balance: 217_000_000,
      },
    ],
    checks: [
      {
        id: "chk-601",
        checkNumber: "۳۴۱۲/۰۹",
        sayadId: "۶۵۰۹۸۴۵۶۱۲۹۸۳۴۹۹",
        bankName: "بانک پارسیان",
        branch: "شعبه فرمانیه",
        dueDate: "۱۴۰۳/۰۷/۲۵",
        amount: 90_000_000,
        drawerName: "مهندس رضایی",
        status: "pending",
        statusLabel: "در جریان وصول",
        registeredDate: "۱۴۰۳/۰۶/۱۶",
      },
    ],
    interactions: [
      {
        id: "nt-601",
        date: "۱۴۰۳/۰۶/۱۷",
        author: "مسئول لجستیک کارخانه",
        type: "call",
        typeLabel: "هماهنگی ترابری",
        title: "برنامه‌ریزی اعزام تریلی به فرمانیه",
        content: "تریلی با بارنامه سراسری روز سه‌شنبه ساعت ۶ صبح سر پروژه حاضر خواهد بود.",
      },
    ],
  },
  {
    id: "cust-1007",
    tenantId: "tenant-001",
    code: "CUST-1007",
    name: "دکتر مهدوی (ویلای کردان)",
    role: "RETAIL",
    status: "active",
    phone: "۰۹۱۲۷۷۷۸۸۹۹",
    email: "mahdavi.kordan@gmail.com",
    nationalId: "۰۰۴۵۶۷۸۹۰۱",
    companyName: "شخصی / ویلایی",
    projectName: "ویلای شخصی کردان",
    projectLocation: "البرز، کردان، خیابان دهکده، کوچه سرو",
    city: "کرج (کردان)",
    address: "کرج، کردان غربی، دهکده آرامش، کوچه سرو، ویلای پلاک ۳",
    creditLimit: 100_000_000,
    currentBalance: 0,
    pendingChecksTotal: 0,
    creditStatus: "safe",
    paymentTerms: "تسویه ۱۰۰٪ نقدی پیش از بارگیری و اعزام خودرو",
    preferredStones: ["تراورتن", "گرانیت"],
    totalPurchasedSqm: 140,
    totalOrdersCount: 1,
    totalSpentTomans: 84_000_000,
    createdAt: "۱۴۰۳/۰۵/۰۱",
    lastOrderDate: "۱۴۰۳/۰۵/۱۰",
    notes: "خریدار ویلایی محوطه و استخر کردان. تسویه نقدی کامل صورت گرفته است.",
    orders: [
      {
        id: "ord-0955",
        orderNumber: "ORD-SC-0955",
        productName: "گرانیت مروارید مشهد فلیم‌شده ضد لغزش",
        stoneType: "گرانیت",
        dimensions: "۴۰ × ۴۰ سانتی‌متر",
        volume: "۱۴۰ مترمربع",
        volumeSqm: 140,
        totalPrice: 84_000_000,
        status: "delivered",
        statusLabel: "تحویل کارگاه شد",
        orderDate: "۱۴۰۳/۰۵/۱۰",
      },
    ],
    inquiries: [],
    financialLedger: [
      {
        id: "led-701",
        date: "۱۴۰۳/۰۵/۱۰",
        type: "invoice",
        typeLabel: "فاکتور خرید سنگ",
        documentNumber: "INV-1403-0955",
        description: "فاکتور خرید ۱۴۰ متر گرانیت مروارید فلیم",
        debit: 84_000_000,
        credit: 0,
        balance: 84_000_000,
      },
      {
        id: "led-702",
        date: "۱۴۰۳/۰۵/۱۰",
        type: "payment",
        typeLabel: "واریز کارت‌به‌کارت / درگاه",
        documentNumber: "PAY-ONLINE-981",
        description: "تسویه کامل فاکتور پیش از ارسال سنگ",
        debit: 0,
        credit: 84_000_000,
        balance: 0,
        paymentMethod: "پرداخت اینترنتی شتاب",
      },
    ],
    checks: [],
    interactions: [
      {
        id: "nt-701",
        date: "۱۴۰۳/۰۵/۱۱",
        author: "واحد پشتیبانی",
        type: "call",
        typeLabel: "نظرسنجی رضایت",
        title: "بررسی رضایت از کیفیت فلیم و تحویل",
        content: "مشتری از عدم لغزندگی سنگ دور استخر بسیار رضایت داشتند.",
      },
    ],
  },
  {
    id: "cust-1008",
    tenantId: "tenant-001",
    code: "CUST-1008",
    name: "شرکت بازرگانی خلیج فارس",
    role: "CONTRACTOR",
    status: "active",
    phone: "۰۹۱۲۶۶۶۷۷۸۸",
    email: "trade@pg-export.ir",
    nationalId: "۱۰۲۶۰۴۵۲۳۱۱",
    economicCode: "۴۱۱۷۳۲۱۹۸۲۲",
    companyName: "دفتر بازرگانی بین‌الملل خلیج فارس",
    projectName: "پایانه صادراتی بندرعباس (FOB)",
    projectLocation: "هرمزگان، بندر شهید رجایی، پایانه صادرات مواد معدنی",
    city: "بندرعباس",
    address: "بندرعباس، بلوار اسکله شهید رجایی، هلدینگ خلیج فارس",
    creditLimit: 3_000_000_000,
    currentBalance: 0,
    pendingChecksTotal: 0,
    creditStatus: "safe",
    paymentTerms: "حواله سوئیفت / ارزی پیش از تحویل گمرکی FOB",
    preferredStones: ["مرمر / آنیکس", "گرانیت", "چینی و کریستال"],
    totalPurchasedSqm: 210,
    totalOrdersCount: 1,
    totalSpentTomans: 620_000_000,
    createdAt: "۱۴۰۳/۰۳/۱۸",
    lastOrderDate: "۱۴۰۳/۰۴/۰۲",
    notes: "پارتنر صادرات سنگ مرمر و کوپ قروه به کشورهای حوزه خلیج فارس (قطر و امارات).",
    orders: [],
    inquiries: [
      {
        id: "inq-103",
        rfqNumber: "RFQ-24-0062",
        stoneTitle: "کوپ مرمر سفید قروه درجه یک صادراتی",
        stoneType: "مرمر (آنیکس)",
        volume: "۳ کوپ (حدود ۵۵ تن)",
        status: "pending",
        statusLabel: "در انتظار آزمایش جذب آب و تخلخل",
        date: "۱۴۰۳/۰۶/۱۹",
        urgency: "high",
        notes: "استعلام قیمت جهت صادرات به دوحه همراه با برگه آنالیز شیمیایی و عیار کلسیت.",
      },
    ],
    financialLedger: [],
    checks: [],
    interactions: [
      {
        id: "nt-801",
        date: "۱۴۰۳/۰۶/۱۹",
        author: "مدیر بازرگانی خارجی",
        type: "agreement",
        typeLabel: "مذاکره صادراتی",
        title: "هماهنگی تست‌های XRF در آزمایشگاه مرجع",
        content: "نمونه سنگ کوپ برای آزمایش خلوص کلسیت به دانشگاه تهران ارسال شد.",
      },
    ],
  },
  {
    id: "cust-1009",
    tenantId: "tenant-001",
    code: "CUST-1009",
    name: "مهندس میرزایی (استودیو سپهر)",
    role: "ARCHITECT",
    status: "active",
    phone: "۰۹۱۲۴۴۴۵۵۶۶",
    email: "sepehr.design@gmail.com",
    nationalId: "۰۰۸۷۴۳۲۱۹۰",
    companyName: "مهندسین مشاور معماری و منظر سپهر فضا",
    projectName: "طراحی دکوراسیون لابی برج رونیکا",
    projectLocation: "تهران، سعادت‌آباد، میدان کاج",
    city: "تهران (سعادت‌آباد)",
    address: "تهران، سعادت‌آباد، علامه شمالی، پلاک ۵۶، واحد ۲",
    creditLimit: 400_000_000,
    currentBalance: 0,
    pendingChecksTotal: 0,
    creditStatus: "safe",
    paymentTerms: "پرداخت دو مرحله‌ای با تحویل برگه اصالت و کنترل کیفی",
    preferredStones: ["مرمر / آنیکس", "مرمریت", "چینی و کریستال"],
    totalPurchasedSqm: 95,
    totalOrdersCount: 1,
    totalSpentTomans: 112_000_000,
    createdAt: "۱۴۰۳/۰۴/۱۰",
    lastOrderDate: "۱۴۰۳/۰۴/۲۲",
    notes: "معمار برجسته پروژه‌های تجاری و لابی‌های مدرن. علاقه‌مند به اسلب‌های کریستال ازنا و لایم‌استون کرم روشن.",
    orders: [],
    inquiries: [],
    financialLedger: [],
    checks: [],
    interactions: [],
  },
  {
    id: "cust-2001",
    tenantId: "tenant-002",
    code: "CUST-2001",
    name: "مهندس براتی (پروژه سیتی‌سنتر)",
    role: "CONTRACTOR",
    status: "active",
    phone: "۰۹۱۳۱۱۱۱۱۱۱",
    email: "barati.eng@gmail.com",
    nationalId: "۱۲۸۷۶۵۴۳۲۱",
    companyName: "سازندگان نگین زاینده‌رود",
    projectName: "برج تجاری اداری سیتی‌سنتر",
    projectLocation: "اصفهان، بزرگراه شهید دستجردی",
    city: "اصفهان",
    address: "اصفهان، کارگاه ساختمانی برج سیتی‌سنتر",
    creditLimit: 800_000_000,
    currentBalance: 120_000_000,
    pendingChecksTotal: 90_000_000,
    creditStatus: "safe",
    paymentTerms: "۴۰٪ نقد، مابقی چک صیادی ۴۵ روزه",
    preferredStones: ["لایم‌استون", "مرمریت", "تراورتن"],
    totalPurchasedSqm: 240,
    totalOrdersCount: 1,
    totalSpentTomans: 280_000_000,
    createdAt: "۱۴۰۳/۰۳/۱۵",
    lastOrderDate: "۱۴۰۳/۰۶/۱۰",
    notes: "پیمانکار خوش‌حساب پروژه‌های بزرگ تجاری اصفهان. نیاز مکرر به لایم‌استون کرم یکدست.",
    orders: [],
    inquiries: [],
    financialLedger: [],
    checks: [],
    interactions: [],
  },
  {
    id: "cust-2002",
    tenantId: "tenant-002",
    code: "CUST-2002",
    name: "شرکت سنگ‌آرا نقش‌جهان",
    role: "SHOWROOM",
    status: "active",
    phone: "۰۹۱۳۲۲۲۲۲۲۲",
    companyName: "شوروم تخصصی سنگ‌آرا",
    city: "اصفهان",
    address: "اصفهان، شهرک صنعتی محمودآباد، خیابان ۲۰",
    creditLimit: 500_000_000,
    currentBalance: 420_000_000,
    pendingChecksTotal: 150_000_000,
    creditStatus: "warning",
    paymentTerms: "اعتباری ۳۰ روزه با ضمانت چک صیادی",
    preferredStones: ["تراورتن", "گرانیت", "مرمریت"],
    totalPurchasedSqm: 180,
    totalOrdersCount: 2,
    totalSpentTomans: 350_000_000,
    createdAt: "۱۴۰۳/۰۲/۲۰",
    lastOrderDate: "۱۴۰۳/۰۶/۰۵",
    notes: "سنگ‌فروشی بزرگ محمودآباد با کشش بالای توزیع تایل و طولی.",
    orders: [],
    inquiries: [],
    financialLedger: [],
    checks: [],
    interactions: [],
  },
];

export function computeCreditStatus(
  currentBalance: number,
  creditLimit: number,
  hasBouncedCheck = false
): CreditStatus {
  if (hasBouncedCheck) return "blocked";
  if (creditLimit <= 0) {
    return currentBalance > 0 ? "warning" : "safe";
  }
  const ratio = currentBalance / creditLimit;
  if (ratio > 1) return "blocked";
  if (ratio >= 0.8) return "warning";
  return "safe";
}

export const useFactoryCustomersStore = create<FactoryCustomersState>()(
  persist(
    (set, get) => ({
      customers: INITIAL_CUSTOMERS,

      addCustomer: (data) => {
        const currentCustomers = get().customers;
        const newId = `cust-${Date.now()}`;
        const newCode = `CUST-${1000 + currentCustomers.length + 1}`;
        const today = new Date().toLocaleDateString("fa-IR");

        const newCustomer: FactoryCustomer = {
          ...data,
          id: newId,
          code: newCode,
          createdAt: today,
          totalPurchasedSqm: 0,
          totalOrdersCount: 0,
          totalSpentTomans: 0,
          orders: [],
          inquiries: [],
          financialLedger: [],
          checks: [],
          interactions: [],
        };

        set((state) => ({
          customers: [newCustomer, ...state.customers],
        }));

        return newCustomer;
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) => {
            if (c.id !== id) return c;
            const updated = { ...c, ...updates };
            const hasBounced = (updated.checks || []).some((k) => k.status === "bounced");
            if (!updates.creditStatus) {
              updated.creditStatus = computeCreditStatus(
                updated.currentBalance,
                updated.creditLimit,
                hasBounced
              );
            }
            return updated;
          }),
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        }));
      },

      getCustomerById: (id) => {
        const all = get().customers;
        const normalized = id.trim().toLowerCase();
        return all.find(
          (c) =>
            c.id === id ||
            c.code === id ||
            c.id.toLowerCase() === normalized ||
            c.code.toLowerCase() === normalized
        );
      },

      getCustomersByTenant: (tenantId) => {
        const all = get().customers;
        return all.filter(
          (c) => c.tenantId === tenantId || (!c.tenantId && tenantId === "tenant-001")
        );
      },

      getStats: (tenantId) => {
        const tenantCustomers = get().getCustomersByTenant(tenantId);

        let contractorsCount = 0;
        let architectsCount = 0;
        let showroomsCount = 0;
        let retailCount = 0;
        let totalPurchasedSqm = 0;
        let totalActiveReceivables = 0;
        let totalPendingChecks = 0;

        for (const c of tenantCustomers) {
          if (c.role === "CONTRACTOR") contractorsCount += 1;
          else if (c.role === "ARCHITECT") architectsCount += 1;
          else if (c.role === "SHOWROOM") showroomsCount += 1;
          else if (c.role === "RETAIL") retailCount += 1;

          totalPurchasedSqm += c.totalPurchasedSqm || 0;
          totalActiveReceivables += c.currentBalance || 0;
          totalPendingChecks += c.pendingChecksTotal || 0;
        }

        return {
          totalCustomers: tenantCustomers.length,
          contractorsCount,
          architectsCount,
          showroomsCount,
          retailCount,
          totalPurchasedSqm: Math.round(totalPurchasedSqm),
          totalActiveReceivables,
          totalPendingChecks,
        };
      },

      addCustomerNote: (customerId, note) => {
        const newNote: CustomerNote = {
          ...note,
          id: `note-${Date.now()}`,
          date: new Date().toLocaleDateString("fa-IR"),
        };

        set((state) => ({
          customers: state.customers.map((c) => {
            if (c.id !== customerId) return c;
            return {
              ...c,
              interactions: [newNote, ...(c.interactions || [])],
            };
          }),
        }));
      },

      addFinancialEntry: (customerId, entry) => {
        const newEntry: CustomerFinancialLedgerItem = {
          ...entry,
          id: `led-${Date.now()}`,
        };

        set((state) => ({
          customers: state.customers.map((c) => {
            if (c.id !== customerId) return c;
            const updatedLedger = [newEntry, ...(c.financialLedger || [])];
            const hasBounced = (c.checks || []).some((k) => k.status === "bounced");
            const newCreditStatus = computeCreditStatus(newEntry.balance, c.creditLimit, hasBounced);
            const addedSpent = entry.debit > 0 ? entry.debit : 0;

            return {
              ...c,
              currentBalance: newEntry.balance,
              creditStatus: newCreditStatus,
              totalSpentTomans: (c.totalSpentTomans || 0) + addedSpent,
              financialLedger: updatedLedger,
            };
          }),
        }));
      },

      addCustomerCheck: (customerId, check) => {
        const newCheck: CustomerCheck = {
          ...check,
          id: `chk-${Date.now()}`,
        };

        set((state) => ({
          customers: state.customers.map((c) => {
            if (c.id !== customerId) return c;
            const updatedChecks = [newCheck, ...(c.checks || [])];
            const pendingTotal = updatedChecks
              .filter((k) => k.status === "pending")
              .reduce((sum, k) => sum + k.amount, 0);

            return {
              ...c,
              pendingChecksTotal: pendingTotal,
              checks: updatedChecks,
            };
          }),
        }));
      },

      updateCheckStatus: (customerId, checkId, status) => {
        set((state) => ({
          customers: state.customers.map((c) => {
            if (c.id !== customerId) return c;
            let clearedCheck: CustomerCheck | undefined;
            const updatedChecks = (c.checks || []).map((chk) => {
              if (chk.id !== checkId) return chk;
              const statusLabels: Record<CustomerCheck["status"], string> = {
                cleared: "وصول شد",
                pending: "در جریان وصول",
                bounced: "برگشت خورده",
              };
              const updated = {
                ...chk,
                status,
                statusLabel: statusLabels[status],
              };
              if (status === "cleared" && chk.status !== "cleared") {
                clearedCheck = updated;
              }
              return updated;
            });

            const pendingTotal = updatedChecks
              .filter((k) => k.status === "pending")
              .reduce((sum, k) => sum + k.amount, 0);

            let newBalance = c.currentBalance;
            let newLedger = c.financialLedger || [];

            // When a check is cleared, deduct from balance and add clearance ledger entry
            if (clearedCheck) {
              newBalance = Math.max(0, c.currentBalance - clearedCheck.amount);
              const clearanceEntry: CustomerFinancialLedgerItem = {
                id: `led-${Date.now()}`,
                date: new Date().toLocaleDateString("fa-IR"),
                type: "payment",
                typeLabel: "وصول چک صیادی",
                documentNumber: `CHK-${clearedCheck.checkNumber}`,
                description: `وصول چک شماره ${clearedCheck.checkNumber} عهده ${clearedCheck.bankName}`,
                debit: 0,
                credit: clearedCheck.amount,
                balance: newBalance,
                paymentMethod: `چک صیادی ${clearedCheck.bankName}`,
              };
              newLedger = [clearanceEntry, ...newLedger];
            }

            const hasBounced = updatedChecks.some((k) => k.status === "bounced");
            const newCreditStatus = hasBounced
              ? "blocked"
              : computeCreditStatus(newBalance, c.creditLimit, false);

            return {
              ...c,
              currentBalance: newBalance,
              pendingChecksTotal: pendingTotal,
              creditStatus: newCreditStatus,
              financialLedger: newLedger,
              checks: updatedChecks,
            };
          }),
        }));
      },

      resetToMockData: () => {
        set({ customers: INITIAL_CUSTOMERS });
      },
    }),
    {
      name: "stone-factory-customers-storage",
    }
  )
);
