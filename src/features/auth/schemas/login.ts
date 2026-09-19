import { z } from "zod";

/**
 * Iranian mobile number: 11 digits, starting with `09`.
 * Example: 09121234567
 */
export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "شماره موبایل را وارد کنید")
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09121234567)"),
});

export type PhoneFormValues = z.infer<typeof phoneSchema>;