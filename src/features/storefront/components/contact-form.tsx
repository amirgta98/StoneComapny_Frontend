"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  CONTACT_SUBJECTS,
  contactFormSchema,
  type ContactFormValues,
} from "../schemas/contact-form";

/**
 * Contact request form — the only client-hydrated part of the contact form
 * section.
 *
 * Follows the project's established form pattern (see
 * `features/users/components/create-user-form.tsx`): React Hook Form +
 * `zodResolver` over the shared `contactFormSchema`, Persian error messages
 * under each field, RTL inputs (phone field is LTR), loading state on the
 * submit button and a success card after submission.
 *
 * Note: no backend endpoint exists yet (no Prisma schema/route handler), so
 * submission is simulated with a short delay. When the messages table and
 * server action are introduced, only `onSubmit` needs to change.
 */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      subject: undefined,
      message: "",
    },
  });

  const selectedSubject = watch("subject");

  async function onSubmit() {
    setIsSubmitting(true);
    try {
      // TODO: replace with a Server Action once the messages table exists.
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSuccess(true);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border bg-card px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Send className="size-6" aria-hidden="true" />
        </div>
        <h3 className="mt-5 text-lg font-bold">درخواست شما ثبت شد</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          کارشناسان ما در اولین فرصت — معمولاً حداکثر یک روز کاری — با شما
          تماس می‌گیرند.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setSuccess(false)}
        >
          ثبت درخواست جدید
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="contact-name">نام و نام خانوادگی</Label>
          <Input
            id="contact-name"
            placeholder="نام کامل خود را وارد کنید"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="contact-phone">شماره موبایل</Label>
          <Input
            id="contact-phone"
            type="tel"
            inputMode="numeric"
            placeholder="09121234567"
            dir="ltr"
            className="text-left"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Email (optional) */}
        <div className="space-y-2">
          <Label htmlFor="contact-email">ایمیل (اختیاری)</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            dir="ltr"
            className="text-left"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-subject">موضوع درخواست</Label>
          <Select
            value={selectedSubject}
            onValueChange={(value) =>
              setValue("subject", value as ContactFormValues["subject"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              id="contact-subject"
              dir="rtl"
              aria-label="موضوع درخواست"
            >
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(CONTACT_SUBJECTS) as [
                  ContactFormValues["subject"],
                  string,
                ][]
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subject && (
            <p className="text-sm text-destructive">{errors.subject.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-message">پیام شما</Label>
          <Textarea
            id="contact-message"
            placeholder="درباره پروژه یا سنگ موردنظرتان بنویسید؛ هرچه دقیق‌تر، پاسخ ما سریع‌تر."
            aria-invalid={Boolean(errors.message)}
            {...register("message")}
          />
          {errors.message && (
            <p className="text-sm text-destructive">{errors.message.message}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          با ارسال این فرم، با تماس کارشناسان ما موافقت می‌کنید.
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              در حال ارسال...
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              ارسال درخواست
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
