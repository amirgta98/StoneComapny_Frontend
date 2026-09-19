"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  CreditCard,
  Edit,
  Printer,
  Plus,
  Layers,
  HardHat,
  Compass,
  Store,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  FileSpreadsheet,
  ShoppingBag,
  MessageSquareText,
  FileText,
  BadgePercent,
  Check,
  Ban,
  Receipt,
  UserCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useFactoryCustomersStore } from "../../stores/factory-customers-store";
import { CustomerFormDialog } from "./customer-form-dialog";
import { CustomerStatementPrintDialog } from "./customer-statement-print-dialog";
import { exportCustomerStatementToCSV } from "../../lib/export-customers";
import type {
  FactoryCustomer,
  CustomerRole,
  CreditStatus,
  CustomerCheck,
  CustomerNote,
} from "../../types";

const ROLE_CONFIG: Record<
  CustomerRole,
  { label: string; badgeClass: string; icon: typeof Users }
> = {
  CONTRACTOR: {
    label: "پیمانکار و مجری ساختمانی (B2B)",
    badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
    icon: HardHat,
  },
  ARCHITECT: {
    label: "معمار و طراح داخلی (B2B)",
    badgeClass: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
    icon: Compass,
  },
  SHOWROOM: {
    label: "نمایشگاه‌دار و سنگ‌فروشی (B2B)",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: Store,
  },
  RETAIL: {
    label: "خریدار خرد / شخصی / ویلایی",
    badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    icon: Users,
  },
};

const CREDIT_CONFIG: Record<
  CreditStatus,
  { label: string; badgeClass: string; icon: typeof ShieldCheck }
> = {
  safe: {
    label: "اعتبار مجاز و فعال",
    badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    icon: ShieldCheck,
  },
  warning: {
    label: "نزدیک به سقف اعتبار (>۸۰٪)",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: AlertTriangle,
  },
  blocked: {
    label: "مسدود اعتباری",
    badgeClass: "bg-destructive/15 text-destructive border-destructive/30",
    icon: ShieldAlert,
  },
};

const NOTE_TYPE_LABELS: Record<CustomerNote["type"], string> = {
  call: "تماس تلفنی",
  meeting: "جلسه حضوری",
  visit: "بازدید از کارخانه",
  agreement: "توافق مالی / قرارداد",
  note: "یادداشت داخلی",
};

interface CustomerDetailViewProps {
  customerId: string;
}

export function CustomerDetailView({ customerId }: CustomerDetailViewProps) {
  const router = useRouter();

  const customers = useFactoryCustomersStore((s) => s.customers);
  const updateCustomer = useFactoryCustomersStore((s) => s.updateCustomer);
  const deleteCustomer = useFactoryCustomersStore((s) => s.deleteCustomer);
  const addCustomerNote = useFactoryCustomersStore((s) => s.addCustomerNote);
  const addCustomerCheck = useFactoryCustomersStore((s) => s.addCustomerCheck);
  const addFinancialEntry = useFactoryCustomersStore((s) => s.addFinancialEntry);
  const updateCheckStatus = useFactoryCustomersStore((s) => s.updateCheckStatus);

  const customer = useMemo(() => {
    if (!customerId) return undefined;
    const normalized = customerId.trim().toLowerCase();
    return customers.find(
      (c) =>
        c.id === customerId ||
        c.code === customerId ||
        c.id.toLowerCase() === normalized ||
        c.code.toLowerCase() === normalized
    );
  }, [customers, customerId]);

  // Modal states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddCheckOpen, setIsAddCheckOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isStatementPrintOpen, setIsStatementPrintOpen] = useState(false);

  // New Note state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("مدیر فروش");
  const [noteType, setNoteType] = useState<CustomerNote["type"]>("call");
  const [noteContent, setNoteContent] = useState("");

  // New Check form state
  const [checkNumber, setCheckNumber] = useState("");
  const [checkSayadId, setCheckSayadId] = useState("");
  const [checkBank, setCheckBank] = useState("بانک ملت");
  const [checkBranch, setCheckBranch] = useState("");
  const [checkDueDate, setCheckDueDate] = useState("۱۴۰۳/۰۸/۱۵");
  const [checkAmount, setCheckAmount] = useState<number>(50_000_000);
  const [checkDrawer, setCheckDrawer] = useState("");
  const [checkNotes, setCheckNotes] = useState("");

  // New Transaction form state
  const [transType, setTransType] = useState<"payment" | "invoice">("payment");
  const [transDocNo, setTransDocNo] = useState("");
  const [transDesc, setTransDesc] = useState("");
  const [transAmount, setTransAmount] = useState<number>(0);
  const [transMethod, setTransMethod] = useState("حواله بانکی ساتنا / پایا");

  if (!customer) {
    return (
      <div className="p-8 text-center space-y-4" dir="rtl">
        <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
          <Users className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold">مشتری مورد نظر یافت نشد</h2>
        <p className="text-xs text-muted-foreground">
          ممکن است این پرونده حذف شده باشد یا شناسه وارد شده اشتباه باشد.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/customers" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            <span>بازگشت به لیست مشتریان</span>
          </Link>
        </Button>
      </div>
    );
  }

  const roleMeta = ROLE_CONFIG[customer.role] ?? ROLE_CONFIG.CONTRACTOR;
  const creditMeta = CREDIT_CONFIG[customer.creditStatus] ?? CREDIT_CONFIG.safe;
  const CreditIcon = creditMeta.icon;
  const RoleIcon = roleMeta.icon;

  const creditUsagePercent =
    customer.creditLimit > 0
      ? Math.min(100, Math.round((customer.currentBalance / customer.creditLimit) * 100))
      : 0;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast.error("لطفاً عنوان و شرح یادداشت را وارد کنید.");
      return;
    }

    addCustomerNote(customer.id, {
      title: noteTitle.trim(),
      author: noteAuthor.trim() || "مدیر فروش",
      type: noteType,
      typeLabel: NOTE_TYPE_LABELS[noteType],
      content: noteContent.trim(),
    });

    toast.success("یادداشت پیگیری با موفقیت ثبت شد.");
    setNoteTitle("");
    setNoteContent("");
  };

  const handleSaveCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkNumber.trim() || checkAmount <= 0) {
      toast.error("لطفاً شماره چک و مبلغ معتبر را وارد کنید.");
      return;
    }

    addCustomerCheck(customer.id, {
      checkNumber: checkNumber.trim(),
      sayadId: checkSayadId.trim() || undefined,
      bankName: checkBank.trim(),
      branch: checkBranch.trim() || undefined,
      dueDate: checkDueDate.trim(),
      amount: Number(checkAmount),
      drawerName: checkDrawer.trim() || customer.name,
      status: "pending",
      statusLabel: "در جریان وصول",
      registeredDate: new Date().toLocaleDateString("fa-IR"),
      notes: checkNotes.trim() || undefined,
    });

    toast.success("چک صیادی با موفقیت در پرونده ثبت شد.");
    setIsAddCheckOpen(false);
    setCheckNumber("");
    setCheckSayadId("");
    setCheckBank("بانک ملت");
    setCheckBranch("");
    setCheckAmount(50_000_000);
    setCheckDrawer("");
    setCheckNotes("");
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transDesc.trim() || transAmount <= 0) {
      toast.error("لطفاً شرح و مبلغ تراکنش را وارد کنید.");
      return;
    }

    const isPayment = transType === "payment";
    const debit = isPayment ? 0 : transAmount;
    const credit = isPayment ? transAmount : 0;
    const newBalance = customer.currentBalance + debit - credit;

    addFinancialEntry(customer.id, {
      date: new Date().toLocaleDateString("fa-IR"),
      type: transType,
      typeLabel: isPayment ? "واریز وجه / سند تسویه" : "فاکتور فروش سنگ",
      documentNumber: transDocNo.trim() || `DOC-${Date.now().toString().slice(-6)}`,
      description: transDesc.trim(),
      debit,
      credit,
      balance: Math.max(0, newBalance),
      paymentMethod: isPayment ? transMethod : undefined,
    });

    toast.success("تراکنش مالی با موفقیت ثبت و مانده حساب به‌روزرسانی شد.");
    setIsAddTransactionOpen(false);
    setTransDocNo("");
    setTransDesc("");
    setTransAmount(0);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs">
            <Link href="/dashboard/customers">
              <ArrowRight className="h-4 w-4" />
              <span>بازگشت به مشتریان</span>
            </Link>
          </Button>

          <span className="text-muted-foreground text-sm">/</span>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {customer.code}
            </Badge>
            <h1 className="text-lg font-bold text-foreground">{customer.name}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsStatementPrintOpen(true)}
            className="gap-1.5 text-xs h-8"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>چاپ صورت‌حساب</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCustomerStatementToCSV(customer)}
            className="gap-1.5 text-xs h-8"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>خروجی اکسل</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="gap-1.5 text-xs h-8"
          >
            <Edit className="h-3.5 w-3.5 text-muted-foreground" />
            <span>ویرایش مشخصات</span>
          </Button>

          <Button asChild size="sm" className="gap-1.5 text-xs h-8">
            <a href={`tel:${customer.phone}`}>
              <Phone className="h-3.5 w-3.5" />
              <span>تماس مستقیم</span>
            </a>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (
                window.confirm(
                  `آیا از حذف پرونده مشتری «${customer.name}» با کد ${customer.code} اطمینان دارید؟`
                )
              ) {
                deleteCustomer(customer.id);
                toast.success("پرونده مشتری با موفقیت حذف شد.");
                router.push("/dashboard/customers");
              }
            }}
            className="gap-1.5 text-xs h-8 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>حذف</span>
          </Button>
        </div>
      </div>

      {/* 2. Customer Banner & Profile Summary */}
      <Card className="border-border/80 shadow-2xs overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xl shadow-xs border border-primary/30">
                <RoleIcon className="h-7 w-7" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{customer.name}</h2>
                  <Badge variant="outline" className={`text-xs ${roleMeta.badgeClass}`}>
                    {roleMeta.label}
                  </Badge>
                  <Badge variant="outline" className={`text-xs flex items-center gap-1 ${creditMeta.badgeClass}`}>
                    <CreditIcon className="h-3 w-3" />
                    {creditMeta.label}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  {customer.companyName && (
                    <span className="flex items-center gap-1 font-medium text-foreground/80">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {customer.companyName}
                    </span>
                  )}
                  {customer.projectName && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      پروژه فعال: {customer.projectName} ({customer.city})
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-mono" dir="ltr">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    {customer.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    عضویت: {customer.createdAt}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Balance Status */}
            <div className="flex flex-col sm:items-end gap-1 bg-card/80 backdrop-blur-xs p-3 rounded-xl border border-border/70">
              <span className="text-xs text-muted-foreground">مانده حساب جاری (بدهی):</span>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {customer.currentBalance.toLocaleString("fa-IR")} <span className="text-xs font-normal text-muted-foreground">تومان</span>
              </span>
              <span className="text-[11px] text-muted-foreground">
                سقف مصوب: {customer.creditLimit.toLocaleString("fa-IR")} تومان ({creditUsagePercent}٪ مصرف‌شده)
              </span>
            </div>
          </div>
        </div>

        {/* 3. Customer Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-border/60 bg-muted/10 text-xs">
          <div className="p-4 space-y-1">
            <span className="text-muted-foreground">مجموع متراژ خریداری‌شده</span>
            <p className="text-lg font-bold text-foreground">
              {customer.totalPurchasedSqm.toLocaleString("fa-IR")} <span className="text-xs font-normal text-muted-foreground">مترمربع</span>
            </p>
            <p className="text-[11px] text-muted-foreground">{customer.totalOrdersCount.toLocaleString("fa-IR")} پارت سفارش تحویل‌شده</p>
          </div>

          <div className="p-4 space-y-1">
            <span className="text-muted-foreground">چک‌های در جریان وصول</span>
            <p className="text-lg font-bold text-sky-600 dark:text-sky-400">
              {customer.pendingChecksTotal.toLocaleString("fa-IR")} <span className="text-xs font-normal text-muted-foreground">تومان</span>
            </p>
            <p className="text-[11px] text-muted-foreground">{customer.checks.filter(c => c.status === "pending").length.toLocaleString("fa-IR")} فقره چک صیادی</p>
          </div>

          <div className="p-4 space-y-1">
            <span className="text-muted-foreground">مجموع گردش مالی ثبت‌شده</span>
            <p className="text-lg font-bold text-foreground">
              {(customer.totalSpentTomans / 1_000_000).toLocaleString("fa-IR")} <span className="text-xs font-normal text-muted-foreground">میلیون تومان</span>
            </p>
            <p className="text-[11px] text-muted-foreground">ارزش کل فاکتورها</p>
          </div>

          <div className="p-4 space-y-1">
            <span className="text-muted-foreground">شرایط پرداخت مصوب</span>
            <p className="text-xs font-semibold text-foreground line-clamp-2 leading-relaxed">
              {customer.paymentTerms || "تسویه نقدی"}
            </p>
          </div>
        </div>
      </Card>

      {/* 4. Tabbed Sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="overview" className="gap-2 text-xs py-2">
            <UserCheck className="h-3.5 w-3.5" />
            <span>مشخصات و اعتبار</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2 text-xs py-2">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>سفارش‌های سنگ ({customer.orders.length.toLocaleString("fa-IR")})</span>
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="gap-2 text-xs py-2">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>استعلام‌های RFQ ({customer.inquiries.length.toLocaleString("fa-IR")})</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-2 text-xs py-2">
            <Receipt className="h-3.5 w-3.5" />
            <span>صورت‌حساب و چک‌ها</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2 text-xs py-2">
            <MessageSquareText className="h-3.5 w-3.5" />
            <span>یادداشت‌ها و مذاکرات ({customer.interactions.length.toLocaleString("fa-IR")})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview & Profile */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identity & Legal Info */}
            <Card className="border-border/70 shadow-2xs">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>اطلاعات هویتی و ثبتی</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">نام کامل مشتری:</span>
                    <span className="font-semibold text-foreground">{customer.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">نام شرکت / گروه:</span>
                    <span className="font-semibold text-foreground">{customer.companyName || "-"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">نقش تجاری:</span>
                    <span className="font-medium text-foreground">{roleMeta.label}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">کد پرونده مشتری:</span>
                    <span className="font-mono font-medium text-foreground">{customer.code}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">کد ملی / شناسه ملی:</span>
                    <span className="font-mono text-foreground">{customer.nationalId || "-"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">کد اقتصادی:</span>
                    <span className="font-mono text-foreground">{customer.economicCode || "-"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">شماره تماس مستقیم:</span>
                    <a href={`tel:${customer.phone}`} className="font-mono text-primary hover:underline" dir="ltr">
                      {customer.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">پست الکترونیکی:</span>
                    <span className="font-mono text-foreground">{customer.email || "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project & Logistics Info */}
            <Card className="border-border/70 shadow-2xs">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>مشخصات پروژه و ترابری</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">نام پروژه در حال اجرا:</span>
                  <span className="font-semibold text-foreground text-sm">{customer.projectName || "بدون پروژه فعال"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">شهر و موقعیت پروژه:</span>
                  <span className="font-medium text-foreground">{customer.projectLocation || customer.city}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">آدرس کامل انبار / کارگاه جهت اعزام تریلی:</span>
                  <span className="text-foreground/90">{customer.address || "آدرس دقیق ثبت نشده است."}</span>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <span className="text-muted-foreground block text-[11px] mb-1.5">سنگ‌های پرمصرف این مشتری:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.preferredStones.map((stone) => (
                      <Badge key={stone} variant="secondary" className="text-xs px-2.5 py-0.5">
                        <Layers className="h-3 w-3 ms-1 text-primary" />
                        {stone}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit & Risk Details */}
            <Card className="border-border/70 shadow-2xs md:col-span-2">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>سقف اعتبار، تضامین و شرایط تسویه</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/60">
                    <span className="text-muted-foreground block text-[11px]">سقف اعتبار مصوب کارخانه:</span>
                    <span className="text-base font-bold text-foreground">
                      {customer.creditLimit.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/60">
                    <span className="text-muted-foreground block text-[11px]">مانده بدهی در این لحظه:</span>
                    <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                      {customer.currentBalance.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/60">
                    <span className="text-muted-foreground block text-[11px]">اعتبار آزاد باقی‌مانده:</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.max(0, customer.creditLimit - customer.currentBalance).toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">میزان استفاده از سقف اعتبار</span>
                    <span className="font-bold tabular-nums">{creditUsagePercent}٪</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        creditUsagePercent >= 100
                          ? "bg-destructive"
                          : creditUsagePercent >= 80
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(creditUsagePercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] mb-1">توضیحات و شرایط تسویه قرارداد:</span>
                  <p className="bg-secondary/40 p-3 rounded-lg border border-border/60 text-foreground leading-relaxed">
                    {customer.paymentTerms}
                  </p>
                </div>

                {customer.notes && (
                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-1">یادداشت کلی پرونده:</span>
                    <p className="text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/40 leading-relaxed">
                      {customer.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Orders History */}
        <TabsContent value="orders" className="space-y-4">
          <Card className="border-border/70 shadow-2xs">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">سوابق سفارش‌های سنگ</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  فهرست پارت‌های سنگ خریداری‌شده، ابعاد، متراژ و وضعیت فرآوری
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline" className="gap-1 text-xs">
                <Link href="/dashboard/orders">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>کارتابل کل سفارش‌ها</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {customer.orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  هیچ سفارشی تاکنون برای این مشتری در سامانه ثبت نشده است.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-border/70 bg-secondary/30 text-muted-foreground">
                        <th className="py-3 px-3 text-start font-medium">شماره سفارش</th>
                        <th className="py-3 px-3 text-start font-medium">نام و مشخصات سنگ</th>
                        <th className="py-3 px-3 text-start font-medium">ابعاد و نوع</th>
                        <th className="py-3 px-3 text-start font-medium">متراژ / حجم</th>
                        <th className="py-3 px-3 text-start font-medium">مبلغ کل فاکتور</th>
                        <th className="py-3 px-3 text-start font-medium">وضعیت فرآوری</th>
                        <th className="py-3 px-3 text-start font-medium">تاریخ سفارش</th>
                        <th className="py-3 ps-3 pe-4 text-end font-medium">مشاهده</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {customer.orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3 font-mono font-medium text-foreground">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-foreground">{ord.productName}</p>
                            <p className="text-[10px] text-muted-foreground">{ord.stoneType}</p>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{ord.dimensions}</td>
                          <td className="py-3 px-3 font-medium text-foreground">{ord.volume}</td>
                          <td className="py-3 px-3 font-bold text-foreground">
                            {ord.totalPrice.toLocaleString("fa-IR")} تومان
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant="outline" className="text-[10px] bg-secondary">
                              {ord.statusLabel}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground font-mono">{ord.orderDate}</td>
                          <td className="py-3 ps-3 pe-4 text-end">
                            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                              <Link href={`/dashboard/orders/${ord.id}`}>جزئیات</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Inquiries / RFQs */}
        <TabsContent value="inquiries" className="space-y-4">
          <Card className="border-border/70 shadow-2xs">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">استعلام‌های قیمت معماران (RFQ)</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  درخواست‌های برآورد متراژ و قیمت پروژه‌های این مشتری
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline" className="gap-1 text-xs">
                <Link href="/dashboard/inquiries">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>کارتابل استعلام‌ها</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {customer.inquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  هیچ استعلام قیمتی برای این مشتری ثبت نشده است.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-border/70 bg-secondary/30 text-muted-foreground">
                        <th className="py-3 px-3 text-start font-medium">شماره RFQ</th>
                        <th className="py-3 px-3 text-start font-medium">عنوان سنگ استعلامی</th>
                        <th className="py-3 px-3 text-start font-medium">دسته سنگ</th>
                        <th className="py-3 px-3 text-start font-medium">متراژ درخواستی</th>
                        <th className="py-3 px-3 text-start font-medium">وضعیت پاسخ</th>
                        <th className="py-3 px-3 text-start font-medium">تاریخ استعلام</th>
                        <th className="py-3 px-3 text-start font-medium">یادداشت فنی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {customer.inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3 font-mono font-medium text-foreground">
                            {inq.rfqNumber}
                          </td>
                          <td className="py-3 px-3 font-semibold text-foreground">
                            {inq.stoneTitle}
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{inq.stoneType}</td>
                          <td className="py-3 px-3 font-medium text-foreground">{inq.volume}</td>
                          <td className="py-3 px-3">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                inq.status === "approved"
                                  ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                                  : inq.status === "quoted"
                                  ? "bg-sky-500/15 text-sky-700 border-sky-500/30"
                                  : "bg-amber-500/15 text-amber-700 border-amber-500/30"
                              }`}
                            >
                              {inq.statusLabel}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground font-mono">{inq.date}</td>
                          <td className="py-3 px-3 text-muted-foreground max-w-xs truncate">
                            {inq.notes || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Financial Ledger & Checks */}
        <TabsContent value="financial" className="space-y-6">
          {/* Checks Sub-section */}
          <Card className="border-border/70 shadow-2xs">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>چک‌های صیادی دریافت شده</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  چک‌های در جریان وصول، وصول‌شده و سررسیدها
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddCheckOpen(true)}
                className="gap-1.5 text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>ثبت چک صیادی جدید</span>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {customer.checks.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  هیچ چکی برای این مشتری ثبت نشده است.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-border/70 bg-secondary/30 text-muted-foreground">
                        <th className="py-3 px-3 text-start font-medium">شماره چک</th>
                        <th className="py-3 px-3 text-start font-medium">شناسه صیاد (۱۶ رقمی)</th>
                        <th className="py-3 px-3 text-start font-medium">بانک و شعبه</th>
                        <th className="py-3 px-3 text-start font-medium">تاریخ سررسید</th>
                        <th className="py-3 px-3 text-start font-medium">مبلغ چک</th>
                        <th className="py-3 px-3 text-start font-medium">صادرکننده</th>
                        <th className="py-3 px-3 text-start font-medium">وضعیت وصول</th>
                        <th className="py-3 ps-3 pe-4 text-end font-medium">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {customer.checks.map((chk) => (
                        <tr key={chk.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3 font-mono font-semibold text-foreground">
                            {chk.checkNumber}
                          </td>
                          <td className="py-3 px-3 font-mono text-muted-foreground text-[11px]" dir="ltr">
                            {chk.sayadId || "-"}
                          </td>
                          <td className="py-3 px-3 text-foreground">
                            {chk.bankName} {chk.branch && `(${chk.branch})`}
                          </td>
                          <td className="py-3 px-3 font-mono font-medium text-foreground">
                            {chk.dueDate}
                          </td>
                          <td className="py-3 px-3 font-bold text-sky-600 dark:text-sky-400">
                            {chk.amount.toLocaleString("fa-IR")} تومان
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{chk.drawerName}</td>
                          <td className="py-3 px-3">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                chk.status === "cleared"
                                  ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                                  : chk.status === "bounced"
                                  ? "bg-destructive/15 text-destructive border-destructive/30"
                                  : "bg-sky-500/15 text-sky-700 border-sky-500/30"
                              }`}
                            >
                              {chk.statusLabel}
                            </Badge>
                          </td>
                          <td className="py-3 ps-3 pe-4 text-end">
                            {chk.status === "pending" && (
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    updateCheckStatus(customer.id, chk.id, "cleared");
                                    toast.success(
                                      `چک شماره ${chk.checkNumber} وصول شد و مبلغ ${chk.amount.toLocaleString("fa-IR")} تومان از مانده بدهی کسر گردید.`
                                    );
                                  }}
                                  className="h-7 px-2 text-[11px] text-emerald-600 hover:text-emerald-700"
                                >
                                  ثبت وصول
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    updateCheckStatus(customer.id, chk.id, "bounced");
                                    toast.error(
                                      `چک شماره ${chk.checkNumber} برگشت خورد و وضعیت اعتباری مشتری مسدود گردید.`
                                    );
                                  }}
                                  className="h-7 px-2 text-[11px] text-destructive hover:text-destructive"
                                >
                                  برگشت
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ledger Transactions Sub-section */}
          <Card className="border-border/70 shadow-2xs">
            <CardHeader className="pb-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" />
                  <span>ریز صورت‌حساب مالی و گردش حساب</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  تراز بدهکار، بستانکار و مانده حساب نهایی مشتری
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportCustomerStatementToCSV(customer)}
                  className="gap-1.5 text-xs h-8"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>خروجی اکسل</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsStatementPrintOpen(true)}
                  className="gap-1.5 text-xs h-8"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>چاپ رسمی صورت‌حساب</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsAddTransactionOpen(true)}
                  className="gap-1.5 text-xs h-8"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>ثبت سند مالی جدید</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {customer.financialLedger.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  هیچ تراکنش مالی برای این مشتری ثبت نشده است.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-border/70 bg-secondary/30 text-muted-foreground">
                        <th className="py-3 px-3 text-start font-medium">تاریخ</th>
                        <th className="py-3 px-3 text-start font-medium">نوع سند</th>
                        <th className="py-3 px-3 text-start font-medium">شماره سند</th>
                        <th className="py-3 px-3 text-start font-medium">شرح تراکنش</th>
                        <th className="py-3 px-3 text-start font-medium">بدهکار (افزایش بدهی)</th>
                        <th className="py-3 px-3 text-start font-medium">بستانکار (پرداخت)</th>
                        <th className="py-3 px-3 text-start font-medium">مانده بدهی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {customer.financialLedger.map((led) => (
                        <tr key={led.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3 font-mono text-muted-foreground">{led.date}</td>
                          <td className="py-3 px-3">
                            <Badge variant="outline" className="text-[10px] bg-secondary">
                              {led.typeLabel}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 font-mono text-muted-foreground">{led.documentNumber}</td>
                          <td className="py-3 px-3 font-medium text-foreground">{led.description}</td>
                          <td className="py-3 px-3 font-semibold text-foreground">
                            {led.debit > 0 ? `${led.debit.toLocaleString("fa-IR")} تومان` : "-"}
                          </td>
                          <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                            {led.credit > 0 ? `${led.credit.toLocaleString("fa-IR")} تومان` : "-"}
                          </td>
                          <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                            {led.balance.toLocaleString("fa-IR")} تومان
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Notes & Interactions */}
        <TabsContent value="notes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Form to add note */}
            <Card className="border-border/70 shadow-2xs md:col-span-1">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" />
                  <span>ثبت یادداشت مذاکره جدید</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleAddNote} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <Label htmlFor="note-type" className="text-xs">نوع تعامل</Label>
                    <Select value={noteType} onValueChange={(v) => setNoteType(v as any)}>
                      <SelectTrigger id="note-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">تماس تلفنی</SelectItem>
                        <SelectItem value="meeting">جلسه حضوری</SelectItem>
                        <SelectItem value="visit">بازدید از کارخانه</SelectItem>
                        <SelectItem value="agreement">توافق مالی / قرارداد</SelectItem>
                        <SelectItem value="note">یادداشت فنی داخلی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="note-title" className="text-xs">عنوان موضوع</Label>
                    <Input
                      id="note-title"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="مثال: توافق قیمت پارت دوم"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="note-author" className="text-xs">مسئول پیگیری</Label>
                    <Input
                      id="note-author"
                      value={noteAuthor}
                      onChange={(e) => setNoteAuthor(e.target.value)}
                      placeholder="نام ثبت‌کننده"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="note-content" className="text-xs">شرح مذاکره</Label>
                    <Textarea
                      id="note-content"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="جزئیات مذاکرات، تصمیمات اتخاذ شده و اقدامات بعدی..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="sm" className="w-full text-xs">
                    ذخیره یادداشت در پرونده
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Timeline of existing notes */}
            <Card className="border-border/70 shadow-2xs md:col-span-2">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>تاریخچه مذاکرات و پیگیری‌ها</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {customer.interactions.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    هیچ یادداشتی برای این مشتری ثبت نشده است.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customer.interactions.map((nt) => (
                      <div
                        key={nt.id}
                        className="p-3.5 rounded-xl border border-border/60 bg-secondary/20 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] bg-secondary">
                              {nt.typeLabel}
                            </Badge>
                            <span className="font-semibold text-foreground">{nt.title}</span>
                          </div>
                          <span className="text-muted-foreground font-mono text-[11px]">{nt.date}</span>
                        </div>

                        <p className="text-foreground/90 leading-relaxed text-xs">{nt.content}</p>

                        <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                          مسئول: {nt.author}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Customer Dialog */}
      <CustomerFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        customer={customer}
        tenantId={customer.tenantId}
        onSave={(updatedData) => {
          updateCustomer(customer.id, updatedData);
        }}
      />

      {/* Add Check Dialog */}
      <Dialog open={isAddCheckOpen} onOpenChange={setIsAddCheckOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <form onSubmit={handleSaveCheck}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                ثبت چک صیادی جدید
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                مشخصات چک صیادی دریافتی از مشتری {customer.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div className="space-y-1">
                <Label htmlFor="chk-number" className="text-xs">شماره چک</Label>
                <Input
                  id="chk-number"
                  value={checkNumber}
                  onChange={(e) => setCheckNumber(e.target.value)}
                  placeholder="مثال: ۲۳۴۱/۹۸"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="chk-sayad" className="text-xs">شناسه صیاد (۱۶ رقمی)</Label>
                <Input
                  id="chk-sayad"
                  value={checkSayadId}
                  onChange={(e) => setCheckSayadId(e.target.value)}
                  placeholder="کد ۱۶ رقمی بالای چک صیادی"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="chk-bank" className="text-xs">نام بانک</Label>
                  <Input
                    id="chk-bank"
                    value={checkBank}
                    onChange={(e) => setCheckBank(e.target.value)}
                    placeholder="مثال: بانک ملت"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="chk-due" className="text-xs">تاریخ سررسید</Label>
                  <Input
                    id="chk-due"
                    value={checkDueDate}
                    onChange={(e) => setCheckDueDate(e.target.value)}
                    placeholder="۱۴۰۳/۰۸/۱۵"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="chk-amount" className="text-xs">مبلغ چک (تومان)</Label>
                <Input
                  id="chk-amount"
                  type="number"
                  value={checkAmount}
                  onChange={(e) => setCheckAmount(Number(e.target.value))}
                  dir="ltr"
                />
                <p className="text-[10px] text-muted-foreground">
                  معادل: {(checkAmount || 0).toLocaleString("fa-IR")} تومان
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="chk-drawer" className="text-xs">نام صاحب حساب / صادرکننده</Label>
                <Input
                  id="chk-drawer"
                  value={checkDrawer}
                  onChange={(e) => setCheckDrawer(e.target.value)}
                  placeholder={customer.name}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddCheckOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" size="sm">
                ثبت چک در پرونده
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <form onSubmit={handleSaveTransaction}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                ثبت تراکنش مالی جدید
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                ثبت سند واریز، فاکتور، یا سند تعدیل در حساب {customer.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div className="space-y-1">
                <Label htmlFor="trans-type" className="text-xs">نوع سند</Label>
                <Select value={transType} onValueChange={(v) => setTransType(v as any)}>
                  <SelectTrigger id="trans-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">واریز وجه / تسویه بدهی (بستانکار)</SelectItem>
                    <SelectItem value="invoice">فاکتور فروش سنگ (بدهکار)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="trans-doc" className="text-xs">شماره سند / ارجاع</Label>
                <Input
                  id="trans-doc"
                  value={transDocNo}
                  onChange={(e) => setTransDocNo(e.target.value)}
                  placeholder="مثال: PAY-1048 یا فاکتور ۱۲۳"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="trans-desc" className="text-xs">شرح تراکنش</Label>
                <Input
                  id="trans-desc"
                  value={transDesc}
                  onChange={(e) => setTransDesc(e.target.value)}
                  placeholder="مثال: واریز پیش‌پرداخت اسلب کالاتا گلد"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="trans-amount" className="text-xs">مبلغ (تومان)</Label>
                <Input
                  id="trans-amount"
                  type="number"
                  value={transAmount}
                  onChange={(e) => setTransAmount(Number(e.target.value))}
                  dir="ltr"
                />
                <p className="text-[10px] text-muted-foreground">
                  معادل: {(transAmount || 0).toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddTransactionOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" size="sm">
                ثبت سند مالی
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer Financial Statement Print Dialog */}
      <CustomerStatementPrintDialog
        customer={customer}
        open={isStatementPrintOpen}
        onOpenChange={setIsStatementPrintOpen}
      />
    </div>
  );
}
