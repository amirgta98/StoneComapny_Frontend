import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "نام الزامی است"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  role: z.enum(["admin", "user", "super_admin"]).default("user"),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  tenantId: z.string().min(1, "انتخاب شرکت الزامی است"),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
  name: z.string().min(1, "نام کاربر الزامی است"),
  phone: z
    .string()
    .min(1, "شماره تلفن الزامی است")
    .regex(/^09\d{9}$/, "شماره تلفن معتبر وارد کنید (مثال: 09121234567)"),
  role: z.enum(["admin", "user", "super_admin"]),
  tenantId: z.string(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
