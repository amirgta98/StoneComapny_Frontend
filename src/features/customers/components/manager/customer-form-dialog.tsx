"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Building2,
  Phone,
  CreditCard,
  Layers,
  MapPin,
  FileText,
  UserCheck,
  Check,
  Plus,
  X,
} from "lucide-react";
import type { FactoryCustomer, CustomerRole, CustomerStatus, CreditStatus } from "../../types";

const STONE_OPTIONS = [
  "مرمریت",
  "تراورتن",
  "گرانیت",
  "مرمر / آنیکس",
  "لایم‌استون",
  "چینی و کریستال",
  "سنداستون",
];

const PAYMENT_TERMS_PRESETS = [
  "۳۰٪ نقد، مابقی چک صیادی ۶۰ روزه",
  "اعتباری ۴۵ روزه با ضمانت چک صیادی معتبر",
  "تسویه ۱۰۰٪ نقدی پیش از بارگیری و اعزام",
  "تسویه با ال‌سی بانکی و ضمانت‌نامه حسن انجام کار",
  "تسویه دومرحله‌ای با تأیید نمونه کارگاهی",
];

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: FactoryCustomer | null; // If provided, edit mode
  tenantId: string;
  onSave: (
    customerData: Omit<
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
  ) => void;
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  tenantId,
  onSave,
}: CustomerFormDialogProps) {
  const isEdit = !!customer;

  const [name, setName] = useState("");
  const [role, setRole] = useState<CustomerRole>("CONTRACTOR");
  const [status, setStatus] = useState<CustomerStatus>("active");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [economicCode, setEconomicCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [city, setCity] = useState("تهران");
  const [address, setAddress] = useState("");
  const [creditLimit, setCreditLimit] = useState<number>(500_000_000);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [pendingChecksTotal, setPendingChecksTotal] = useState<number>(0);
  const [creditStatus, setCreditStatus] = useState<CreditStatus>("safe");
  const [paymentTerms, setPaymentTerms] = useState(PAYMENT_TERMS_PRESETS[0]);
  const [preferredStones, setPreferredStones] = useState<string[]>(["مرمریت", "تراورتن"]);
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setRole(customer.role || "CONTRACTOR");
      setStatus(customer.status || "active");
      setPhone(customer.phone || "");
      setEmail(customer.email || "");
      setNationalId(customer.nationalId || "");
      setEconomicCode(customer.economicCode || "");
      setCompanyName(customer.companyName || "");
      setProjectName(customer.projectName || "");
      setProjectLocation(customer.projectLocation || "");
      setCity(customer.city || "تهران");
      setAddress(customer.address || "");
      setCreditLimit(customer.creditLimit ?? 500_000_000);
      setCurrentBalance(customer.currentBalance ?? 0);
      setPendingChecksTotal(customer.pendingChecksTotal ?? 0);
      setCreditStatus(customer.creditStatus || "safe");
      setPaymentTerms(customer.paymentTerms || PAYMENT_TERMS_PRESETS[0]);
      setPreferredStones(customer.preferredStones || ["مرمریت", "تراورتن"]);
      setNotes(customer.notes || "");
    } else {
      setName("");
      setRole("CONTRACTOR");
      setStatus("active");
      setPhone("");
      setEmail("");
      setNationalId("");
      setEconomicCode("");
      setCompanyName("");
      setProjectName("");
      setProjectLocation("");
      setCity("تهران");
      setAddress("");
      setCreditLimit(500_000_000);
      setCurrentBalance(0);
      setPendingChecksTotal(0);
      setCreditStatus("safe");
      setPaymentTerms(PAYMENT_TERMS_PRESETS[0]);
      setPreferredStones(["مرمریت", "تراورتن"]);
      setNotes("");
    }
    setErrors({});
  }, [customer, open]);

  const toggleStone = (stone: string) => {
    setPreferredStones((prev) =>
      prev.includes(stone) ? prev.filter((s) => s !== stone) : [...prev, stone]
    );
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = "نام مشتری یا شرکت الزامی است.";
    if (!phone.trim()) {
      err.phone = "شماره تماس الزامی است.";
    } else if (!/^[۰-۹0-9\-+ ]{8,15}$/.test(phone.trim())) {
      err.phone = "فرمت شماره تماس نامعتبر است.";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      err.email = "فرمت پست الکترونیکی نامعتبر است.";
    }
    if (nationalId.trim() && !/^[۰-۹0-9]{10,11}$/.test(nationalId.trim())) {
      err.nationalId = "کد ملی باید ۱۰ رقم و شناسه ملی حقوقی ۱۱ رقم باشد.";
    }
    if (creditLimit < 0) {
      err.creditLimit = "سقف اعتبار نمی‌تواند منفی باشد.";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("لطفاً خطاهای فرم را برطرف کنید.");
      return;
    }

    onSave({
      tenantId,
      name: name.trim(),
      role,
      status,
      phone: phone.trim(),
      email: email.trim() || undefined,
      nationalId: nationalId.trim() || undefined,
      economicCode: economicCode.trim() || undefined,
      companyName: companyName.trim() || undefined,
      projectName: projectName.trim() || undefined,
      projectLocation: projectLocation.trim() || undefined,
      city: city.trim() || "تهران",
      address: address.trim() || undefined,
      creditLimit: Number(creditLimit) || 0,
      currentBalance: Number(currentBalance) || 0,
      pendingChecksTotal: Number(pendingChecksTotal) || 0,
      creditStatus,
      paymentTerms: paymentTerms.trim(),
      preferredStones,
      notes: notes.trim() || undefined,
    });

    toast.success(
      isEdit
        ? `مشخصات مشتری «${name}» با موفقیت به‌روزرسانی شد.`
        : `پرونده مشتری جدید «${name}» با موفقیت ثبت شد.`
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" dir="rtl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-6 pb-2 border-b">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              {isEdit ? "ویرایش مشخصات مشتری و همکار پروژه‌ای" : "ثبت مشتری یا همکار پروژه‌ای جدید"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              اطلاعات هویتی، نوع همکاری B2B، شرایط اعتباری و متریال‌های سنگ پرمصرف را تکمیل فرمایید.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-5 text-xs">
            {/* 1. Identity & Role */}
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-foreground flex items-center gap-1.5 border-b pb-1.5">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                اطلاعات عمومی و نوع همکاری
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="customer-name" className="text-xs font-medium">
                    نام کامل مشتری یا نماینده <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customer-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: مهندس کاظمی"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="customer-role" className="text-xs font-medium">
                    دسته‌بندی و نقش همکاری
                  </Label>
                  <Select value={role} onValueChange={(val) => setRole(val as CustomerRole)}>
                    <SelectTrigger id="customer-role">
                      <SelectValue placeholder="انتخاب نقش" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONTRACTOR">پیمانکار و مجری ساختمانی (B2B)</SelectItem>
                      <SelectItem value="ARCHITECT">معمار و طراح داخلی (B2B)</SelectItem>
                      <SelectItem value="SHOWROOM">نمایشگاه‌دار و سنگ‌فروشی (B2B)</SelectItem>
                      <SelectItem value="RETAIL">خریدار خرد / شخصی / ویلایی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="customer-company" className="text-xs font-medium">
                    نام شرکت / دفتر مهندسی / شوروم
                  </Label>
                  <Input
                    id="customer-company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="مثال: گروه مهندسی سازه‌گستر"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="customer-phone" className="text-xs font-medium">
                    شماره تماس مستقیم <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customer-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                    dir="ltr"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-[11px] text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="customer-email" className="text-xs font-medium">
                    پست الکترونیکی (اختیاری)
                  </Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-[11px] text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="customer-national" className="text-xs font-medium">
                    شناسه ملی / کد اقتصادی / کدملی
                  </Label>
                  <Input
                    id="customer-national"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="شناسه ملی یا کدملی شخص"
                    dir="ltr"
                    className={errors.nationalId ? "border-destructive" : ""}
                  />
                  {errors.nationalId && <p className="text-[11px] text-destructive">{errors.nationalId}</p>}
                </div>
              </div>
            </div>

            {/* 2. Project Location & Scope */}
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-foreground flex items-center gap-1.5 border-b pb-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                مشخصات پروژه و موقعیت کارگاه
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="customer-project" className="text-xs font-medium">
                    نام پروژه فعال
                  </Label>
                  <Input
                    id="customer-project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="مثال: برج نیلوفر، هتل ارگ، ویلای لواسان"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="customer-city" className="text-xs font-medium">
                    شهر پروژه
                  </Label>
                  <Input
                    id="customer-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثال: تهران، کیش، مشهد، اصفهان"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="customer-address" className="text-xs font-medium">
                    آدرس کارگاه یا انبار تخلیه سنگ
                  </Label>
                  <Input
                    id="customer-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="آدرس دقیق جهت برنامه‌ریزی تریلی و جرثقیل تخلیه"
                  />
                </div>
              </div>
            </div>

            {/* 3. Credit Limit & Financial Terms */}
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-foreground flex items-center gap-1.5 border-b pb-1.5">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                سقف اعتبار و شرایط تسویه حساب (B2B)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="credit-limit" className="text-xs font-medium">
                    سقف اعتبار مجاز (تومان)
                  </Label>
                  <Input
                    id="credit-limit"
                    type="number"
                    step={10_000_000}
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    dir="ltr"
                    className={errors.creditLimit ? "border-destructive" : ""}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    معادل: {(creditLimit || 0).toLocaleString("fa-IR")} تومان
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="credit-status" className="text-xs font-medium">
                    وضعیت اعتبار
                  </Label>
                  <Select
                    value={creditStatus}
                    onValueChange={(val) => setCreditStatus(val as CreditStatus)}
                  >
                    <SelectTrigger id="credit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe">معتبر و خوش‌حساب (سقف باز)</SelectItem>
                      <SelectItem value="warning">هشدار (نزدیک به سقف اعتبار)</SelectItem>
                      <SelectItem value="blocked">مسدود اعتباری (عدم صدور پیش‌فاکتور)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="payment-terms" className="text-xs font-medium">
                    شرایط پرداخت و تسویه
                  </Label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {PAYMENT_TERMS_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setPaymentTerms(preset)}
                        className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${
                          paymentTerms === preset
                            ? "bg-primary/15 border-primary text-primary font-medium"
                            : "bg-secondary/60 hover:bg-secondary border-border text-muted-foreground"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <Input
                    id="payment-terms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="شرح شرایط تسویه"
                  />
                </div>
              </div>
            </div>

            {/* 4. Preferred Stone Varieties */}
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-foreground flex items-center gap-1.5 border-b pb-1.5">
                <Layers className="h-4 w-4 text-muted-foreground" />
                سنگ‌های پرمصرف و مورد علاقه (Stone Varieties)
              </h4>
              <div className="flex flex-wrap gap-2">
                {STONE_OPTIONS.map((stone) => {
                  const selected = preferredStones.includes(stone);
                  return (
                    <button
                      type="button"
                      key={stone}
                      onClick={() => toggleStone(stone)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs font-medium"
                          : "bg-secondary/50 text-foreground hover:bg-secondary border-border"
                      }`}
                    >
                      {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      {stone}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Notes */}
            <div className="space-y-2">
              <Label htmlFor="customer-notes" className="text-xs font-medium flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                یادداشت‌ها و توضیحات تکمیلی
              </Label>
              <Textarea
                id="customer-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="توضیحات مربوط به نحوه تخلیه، ترجیحات کنترل کیفی، نام سرپرست کارگاه و..."
                rows={3}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="p-4 border-t gap-2 bg-muted/20">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              انصراف
            </Button>
            <Button type="submit" size="sm">
              {isEdit ? "ذخیره تغییرات" : "ثبت پرونده مشتری"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
