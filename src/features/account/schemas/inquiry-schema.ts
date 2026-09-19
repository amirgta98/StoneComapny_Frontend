import { z } from "zod";

export const inquiryFormSchema = z.object({
  requestedStoneName: z
    .string()
    .min(2, "لطفاً نام یا نوع سنگ درخواستی را وارد کنید (حداقل ۲ کاراکتر)")
    .max(120, "نام سنگ نمی‌تواند بیش از ۱۲۰ کاراکتر باشد"),
  stoneType: z.string().min(1, "انتخاب نوع سنگ الزامی است"),
  stoneColor: z.string().min(1, "انتخاب رنگ سنگ الزامی است"),
  application: z.string().min(1, "انتخاب کاربرد موردنظر الزامی است"),
  productFormat: z.string().min(1, "انتخاب فرم و ابعاد سنگ الزامی است"),
  quantity: z
    .number({
      message: "وارد کردن مقدار به صورت عدد الزامی است",
    })
    .positive("مقدار درخواستی باید بزرگتر از صفر باشد")
    .max(1000000, "مقدار واردشده بیش از حد مجاز است"),
  unit: z.string().min(1, "انتخاب واحد اندازه‌گیری الزامی است"),
  dimensions: z.string().max(80, "طول متن ابعاد بیش از حد مجاز است").optional(),
  thickness: z.string().max(40, "طول متن ضخامت بیش از حد مجاز است").optional(),
  grade: z.string().max(60, "طول متن درجه کیفی بیش از حد مجاز است").optional(),
  quarryOrigin: z.string().max(100, "طول متن معدن یا خاستگاه بیش از حد مجاز است").optional(),
  description: z
    .string()
    .min(5, "لطفاً توضیحات تکمیلی یا ویژگی‌های خاص مورد نیاز را شرح دهید (حداقل ۵ کاراکتر)")
    .max(1500, "توضیحات نمی‌تواند بیش از ۱۵۰۰ کاراکتر باشد"),
  referenceImage: z.string().optional().nullable(),
  contactName: z.string().max(80).optional(),
  contactPhone: z
    .string()
    .regex(/^09\d{9}$/, "شماره تماس باید یک شماره موبایل معتبر ۱۱ رقمی باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;
