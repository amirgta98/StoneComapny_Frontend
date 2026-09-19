import { z } from "zod";

export const addressFormSchema = z.object({
  title: z
    .string()
    .min(2, "عنوان آدرس باید حداقل ۲ کاراکتر باشد")
    .max(50, "عنوان آدرس نمی‌تواند بیش از ۵۰ کاراکتر باشد"),
  firstName: z
    .string()
    .min(2, "نام تحویل‌گیرنده باید حداقل ۲ کاراکتر باشد"),
  lastName: z
    .string()
    .min(2, "نام خانوادگی تحویل‌گیرنده باید حداقل ۲ کاراکتر باشد"),
  phone: z
    .string()
    .regex(
      /^09[0-9]{9}$/,
      "شماره تماس باید یک شماره موبایل معتبر ۱۱ رقمی باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"
    ),
  country: z.string().min(1, "انتخاب کشور الزامی است"),
  province: z.string().min(1, "انتخاب استان الزامی است"),
  city: z.string().min(1, "انتخاب یا ورود نام شهر الزامی است"),
  address: z
    .string()
    .min(10, "آدرس کامل پستی باید حداقل ۱۰ کاراکتر باشد"),
  plaque: z.string().min(1, "ورود پلاک الزامی است"),
  unit: z.string().optional(),
  postalCode: z
    .string()
    .regex(/^[0-9]{10}$/, "کد پستی باید دقیقاً ۱۰ رقم عددی باشد"),
  isDefaultShipping: z.boolean(),
  isDefaultBilling: z.boolean(),
  // Stone delivery logistics
  floor: z.string().optional(),
  hasFreightElevator: z.boolean().optional(),
  craneAccess: z.boolean().optional(),
  deliveryType: z.enum(["curbside", "crane", "forklift"]).optional(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
