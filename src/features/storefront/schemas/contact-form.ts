import { z } from "zod";

/**
 * Contact form validation schema (client + shared).
 *
 * Persian-first storefront: name and message are required, phone must be a
 * valid Iranian mobile number, email is optional. Error messages are in
 * Persian and are rendered directly under the fields by `ContactForm`.
 */
export const contactFormSchema = z.object({
  name: z.string().min(3, "نام را کامل وارد کنید (حداقل ۳ حرف)."),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید (مثال: 09121234567)."),
  email: z
    .string()
    .email("ایمیل معتبر وارد کنید.")
    .optional()
    .or(z.literal("")),
  subject: z.enum(["consultation", "price", "cooperation", "other"], {
    message: "موضوع درخواست را انتخاب کنید.",
  }),
  message: z.string().min(10, "پیام باید حداقل ۱۰ حرف باشد."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Persian labels for the subject select — kept next to the schema. */
export const CONTACT_SUBJECTS: Record<ContactFormValues["subject"], string> = {
  consultation: "مشاوره انتخاب سنگ",
  price: "استعلام قیمت",
  cooperation: "درخواست همکاری",
  other: "سایر موارد",
};
