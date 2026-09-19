export type TechnicalDocumentType =
  | "quality_certificate" // گواهی کیفیت و اصالت
  | "spec_sheet"          // برگه مشخصات فنی سنگ (TDS)
  | "lab_analysis";       // آزمون آنالیز فیزیکی و شیمیایی آزمایشگاه

export interface PhysicalPropertySpec {
  name: string;          // جذب آب، مقاومت فشاری، وزن مخصوص، مقاومت سایشی و...
  standard: string;      // ASTM C97, ASTM C170, ISIRI 5695...
  measuredValue: string; // 0.14%, 1,420 kg/cm², 2.71 g/cm³...
  referenceLimit: string;// حداقل / حداکثر استاندارد
  status: "optimal" | "standard" | "warning";
}

export interface TechnicalDocument {
  id: string;
  docNumber: string;               // e.g. QC-1403-9082
  title: string;                   // گواهی کنترل کیفیت و تأییدیه آنالیز اسلب کالاتا
  type: TechnicalDocumentType;
  productId: string;
  productName: string;             // سنگ مرمریت کالاتا گلد
  productImage: string;
  stoneType: string;               // مرمریت، گرانیت، تراورتن، آنیکس...
  stoneForm: string;               // اسلب ۲۸۰×۱۶۰ سانتی‌متر
  finish: string;                  // ساب صیقلی آینه‌ای
  grade: string;                   // سوپر صادراتی
  orderId: string;                 // ord-c-1001
  orderNumber: string;             // ORD-10245
  batchNumber: string;             // BATCH-KL-9821
  quarryOrigin: string;            // معدن کاشان
  issuedAt: string;                // تاریخ صدور
  validUntil?: string;             // تاریخ اعتبار
  labName: string;                 // مرجع آزمایشگاهی و صادرکننده
  accreditationNumber: string;     // شناسه اعتباربخشی استاندارد
  fileSize: string;                // e.g. ۲.۴ مگابایت
  fileFormat: "PDF";
  description: string;
  keySpecs: PhysicalPropertySpec[];
  applications: string[];          // کاربردهای تأییدشده
  maintenanceNotes?: string[];     // توصیه‌های فنی نگهداری و نصب
  verified: boolean;
}
