import { z } from "zod";

export const supportAttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  size: z.number().max(5 * 1024 * 1024, "حجم فایل نباید بیشتر از ۵ مگابایت باشد"),
  mimeType: z.string(),
});

export const createConversationSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, "موضوع گفتگو باید حداقل ۳ کاراکتر باشد")
    .max(120, "موضوع گفتگو نمی‌تواند بیشتر از ۱۲۰ کاراکتر باشد"),
  category: z.enum(
    [
      "ORDER",
      "PRODUCT",
      "PAYMENT",
      "SHIPPING",
      "RETURN",
      "ACCOUNT",
      "TECHNICAL",
      "OTHER",
    ],
    {
      error: "لطفاً دسته‌بندی مناسب را انتخاب نمایید",
    }
  ),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
  initialMessage: z
    .string()
    .trim()
    .min(5, "متن پیام اولیه باید حداقل ۵ کاراکتر باشد")
    .max(3000, "متن پیام نمی‌تواند بیشتر از ۳۰۰۰ کاراکتر باشد"),
  orderId: z.string().trim().optional(),
  productId: z.string().trim().optional(),
  attachments: z.array(supportAttachmentSchema).optional(),
});

export type CreateConversationValues = z.infer<typeof createConversationSchema>;

export const sendMessageSchema = z
  .object({
    body: z
      .string()
      .trim()
      .max(3000, "متن پیام نمی‌تواند بیشتر از ۳۰۰۰ کاراکتر باشد"),
    attachments: z.array(supportAttachmentSchema).optional(),
  })
  .refine(
    (data) => {
      const hasText = data.body.length > 0;
      const hasAttachment = (data.attachments?.length ?? 0) > 0;
      return hasText || hasAttachment;
    },
    {
      message: "لطفاً متن پیام یا فایل پیوست را وارد کنید",
      path: ["body"],
    }
  );

export type SendMessageValues = z.infer<typeof sendMessageSchema>;

export const closeConversationSchema = z.object({
  reason: z.string().trim().max(500, "دلیل بستن گفتگو حداکثر ۵۰۰ کاراکتر است").optional(),
});

export type CloseConversationValues = z.infer<typeof closeConversationSchema>;
