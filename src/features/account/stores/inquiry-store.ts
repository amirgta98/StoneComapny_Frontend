"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CustomerInquiry } from "../types/inquiry";
import type { InquiryFormValues } from "../schemas/inquiry-schema";

const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: "inq-1001",
    inquiryNumber: "INQ-1403-8820",
    userId: "u-user-1",
    requestedStoneName: "اسلب تراورتن نقره‌ای (سیلور) تکاب موج کبریتی",
    stoneType: "تراورتن",
    stoneColor: "سیلور و دودی",
    application: "نمای خارجی و دیوار لابی",
    productFormat: "اسلب بوک‌مچ",
    quantity: 250,
    unit: "متر مربع",
    dimensions: "۲۸۰ × ۱۷۰ سانتی‌متر",
    thickness: "۲ سانتی‌متر کالیبره",
    grade: "سوپر صادراتی",
    quarryOrigin: "معادن تکاب",
    description:
      "برای یک پروژه مسکونی لوکس نیازمند ۲۵۰ متر مربع اسلب بوک‌مچ با رگه‌های موازی و بدون خلل و فرج ماستیک‌خورده اپوکسی با کیفیت صادراتی هستیم.",
    referenceImage: "/test_images/stones/test_5.jpg",
    contactName: "مهندس کاظمی",
    contactPhone: "09120000004",
    status: "RESPONDED",
    managerResponse: {
      responseText:
        "درود و احترام. کوپ‌های درجه‌یک و سوپر تراورتن سیلور تکاب با رگه کبریتی منظم در کارخانه موجود است. فرآوری با ضخامت ۲ سانتی‌متر دقیق و رزین ایتالیایی UV امکان‌پذیر بوده و نمونه شمش سنگ جهت بازبینی کارگاهی آماده ارائه است.",
      respondedAt: "2024-08-15T14:30:00Z",
      isAvailable: true,
      estimatedPricePerUnit: 1850000,
      estimatedTotalPrice: 462500000,
      estimatedPrepDays: "۷ تا ۱۰ روز کاری پس از تأیید سفارش",
      deliveryTerms: "بارگیری در محل کارخانه با پالت چوبی تقویت‌شده و مهار تسمه فولادی",
      managerNotes: "در صورت سفارش متراژ کامل، هزینه بسته‌بندی پالت صادراتی رایگان محاسبه خواهد شد.",
    },
    createdAt: "2024-08-14T09:10:00Z",
    updatedAt: "2024-08-15T14:30:00Z",
  },
  {
    id: "inq-1002",
    inquiryNumber: "INQ-1403-8815",
    userId: "u-user-1",
    requestedStoneName: "کوپ سنگ مرمر صورتی نقده جهت ساخت آب‌نما و المان دکوراتیو",
    stoneType: "مرمر (آنیکس)",
    stoneColor: "صورتی پاستلی رگه‌دار",
    application: "المان دکوراتیو و مجسمه‌سازی",
    productFormat: "کوپ خام سنگ",
    quantity: 18,
    unit: "تن",
    dimensions: "ابعاد آزاد قواره‌دار",
    thickness: "یکپارچه کوپ",
    grade: "درجه یک بدون ترک",
    quarryOrigin: "معدن نقده",
    description:
      "نیاز به یک قطعه کوپ مرمر صورتی خوش‌رنگ با بافت متراکم بلورین و بدون گره‌های تیره برای تراش آب‌نمای لابی هتل.",
    referenceImage: "/test_images/stones/test_6.jpg",
    contactName: "مهندس کاظمی",
    contactPhone: "09120000004",
    status: "IN_REVIEW",
    createdAt: "2024-08-16T11:20:00Z",
    updatedAt: "2024-08-17T08:00:00Z",
  },
  {
    id: "inq-1003",
    inquiryNumber: "INQ-1403-8802",
    userId: "u-user-1",
    requestedStoneName: "تایل مرمریت مشکی نجف‌آباد خط‌دار ۴۰×۴۰ با ضخامت ۳ سانتی‌متر",
    stoneType: "مرمریت",
    stoneColor: "مشکی با خطوط سفید",
    application: "کف فرش سالن اجتماعات",
    productFormat: "تایل کالیبره",
    quantity: 140,
    unit: "متر مربع",
    dimensions: "۴۰ × ۴۰ سانتی‌متر",
    thickness: "۳ سانتی‌متر",
    grade: "ممتاز",
    quarryOrigin: "نجف‌آباد اصفهان",
    description:
      "ضخامت ۳ سانتی‌متر حتماً دقیق رعایت شود زیرا تردد بالا است و ساب باید کاملاً صیقلی و بدون حفره باشد.",
    referenceImage: "/test_images/stones/test_3.jpg",
    contactName: "مهندس کاظمی",
    contactPhone: "09120000004",
    status: "PENDING",
    createdAt: "2024-08-18T16:00:00Z",
    updatedAt: "2024-08-18T16:00:00Z",
  },
  {
    id: "inq-1004",
    inquiryNumber: "INQ-1403-8790",
    userId: "u-user-1",
    requestedStoneName: "گرانیت سبز جنگلی بیرجند ۶۰×۶۰",
    stoneType: "گرانیت",
    stoneColor: "سبز تیره",
    application: "محوطه ورودی ساختمان",
    productFormat: "تایل مربعی فلیم‌شده",
    quantity: 80,
    unit: "متر مربع",
    dimensions: "۶۰ × ۶۰ سانتی‌متر",
    thickness: "۲ سانتی‌متر",
    grade: "درجه ۱",
    quarryOrigin: "بیرجند",
    description: "برای محوطه ورودی شیب‌دار، فرآوری فلیم شده و ضدلغزش مدنظر بود.",
    contactName: "مهندس کاظمی",
    contactPhone: "09120000004",
    status: "CANCELLED",
    cancellationReason: "تغییر طرح معماری پروژه و جایگزینی با گرانیت مشکی نطنز",
    createdAt: "2024-08-01T10:00:00Z",
    updatedAt: "2024-08-02T12:00:00Z",
  },
];

interface InquiryStoreState {
  inquiries: CustomerInquiry[];
  getUserInquiries: (userId?: string) => CustomerInquiry[];
  getInquiryById: (id: string, userId?: string) => CustomerInquiry | undefined;
  createInquiry: (data: InquiryFormValues, userId?: string) => CustomerInquiry;
  updateInquiry: (
    id: string,
    data: Partial<InquiryFormValues>,
    userId?: string
  ) => boolean;
  cancelInquiry: (id: string, reason?: string, userId?: string) => boolean;
  deleteInquiry: (id: string, userId?: string) => boolean;
}

export const useInquiryStore = create<InquiryStoreState>()(
  persist(
    (set, get) => ({
      inquiries: INITIAL_INQUIRIES,

      getUserInquiries: (userId = "u-user-1") => {
        return get().inquiries.filter((inq) => inq.userId === userId);
      },

      getInquiryById: (id: string, userId = "u-user-1") => {
        return get().inquiries.find(
          (inq) =>
            (inq.id === id || inq.inquiryNumber === id) &&
            inq.userId === userId
        );
      },

      createInquiry: (data: InquiryFormValues, userId = "u-user-1") => {
        const now = new Date().toISOString();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const inquiryNumber = `INQ-1403-${randomNum}`;
        const newId = `inq-${Date.now()}`;

        const newInquiry: CustomerInquiry = {
          id: newId,
          inquiryNumber,
          userId,
          requestedStoneName: data.requestedStoneName.trim(),
          stoneType: data.stoneType,
          stoneColor: data.stoneColor,
          application: data.application,
          productFormat: data.productFormat,
          quantity: data.quantity,
          unit: data.unit,
          dimensions: data.dimensions?.trim() || undefined,
          thickness: data.thickness?.trim() || undefined,
          grade: data.grade?.trim() || undefined,
          quarryOrigin: data.quarryOrigin?.trim() || undefined,
          description: data.description.trim(),
          referenceImage: data.referenceImage || null,
          contactName: data.contactName?.trim() || undefined,
          contactPhone: data.contactPhone.trim(),
          status: "PENDING",
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          inquiries: [newInquiry, ...state.inquiries],
        }));

        return newInquiry;
      },

      updateInquiry: (
        id: string,
        data: Partial<InquiryFormValues>,
        userId = "u-user-1"
      ) => {
        let updated = false;
        set((state) => ({
          inquiries: state.inquiries.map((inq) => {
            if (
              (inq.id === id || inq.inquiryNumber === id) &&
              inq.userId === userId &&
              inq.status === "PENDING"
            ) {
              updated = true;
              return {
                ...inq,
                ...data,
                updatedAt: new Date().toISOString(),
              };
            }
            return inq;
          }),
        }));
        return updated;
      },

      cancelInquiry: (id: string, reason?: string, userId = "u-user-1") => {
        let cancelled = false;
        set((state) => ({
          inquiries: state.inquiries.map((inq) => {
            if (
              (inq.id === id || inq.inquiryNumber === id) &&
              inq.userId === userId &&
              (inq.status === "PENDING" || inq.status === "IN_REVIEW")
            ) {
              cancelled = true;
              return {
                ...inq,
                status: "CANCELLED" as const,
                cancellationReason: reason?.trim() || "لغو شده به درخواست کاربر",
                updatedAt: new Date().toISOString(),
              };
            }
            return inq;
          }),
        }));
        return cancelled;
      },

      deleteInquiry: (id: string, userId = "u-user-1") => {
        let deleted = false;
        set((state) => ({
          inquiries: state.inquiries.filter((inq) => {
            if (
              (inq.id === id || inq.inquiryNumber === id) &&
              inq.userId === userId &&
              inq.status === "CANCELLED"
            ) {
              deleted = true;
              return false;
            }
            return true;
          }),
        }));
        return deleted;
      },
    }),
    {
      name: "stone_inquiries_store",
    }
  )
);
