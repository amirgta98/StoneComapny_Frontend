"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  FactoryInquiryItem,
  InquiryQuotation,
  InquiryStats,
  InquiryUrgency,
} from "../types";
import { INITIAL_INQUIRIES } from "../data/mock-inquiries-data";

interface FactoryInquiriesState {
  inquiries: FactoryInquiryItem[];
  submitQuote: (
    inquiryId: string,
    quotation: Omit<InquiryQuotation, "quoteDate" | "quotedBy"> & {
      quotedBy?: string;
    }
  ) => void;
  acceptInquiry: (inquiryId: string, notes?: string) => void;
  rejectInquiry: (inquiryId: string, reason: string) => void;
  updateUrgency: (inquiryId: string, urgency: InquiryUrgency) => void;
  addInquiry: (item: Omit<FactoryInquiryItem, "id" | "rfqNumber" | "history">) => void;
  getInquiryById: (id: string) => FactoryInquiryItem | undefined;
  getStats: (tenantId: string) => InquiryStats;
  resetToDefault: () => void;
}

export const useFactoryInquiriesStore = create<FactoryInquiriesState>()(
  persist(
    (set, get) => ({
      inquiries: INITIAL_INQUIRIES,

      submitQuote: (inquiryId, quotationData) => {
        const now = new Date();
        const dateStr = new Intl.DateTimeFormat("fa-IR", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(now);

        set((state) => {
          return {
            inquiries: state.inquiries.map((inq) => {
              if (inq.id !== inquiryId) return inq;

              const fullQuotation: InquiryQuotation = {
                ...quotationData,
                quoteDate: `امروز، ${dateStr}`,
                quotedBy: quotationData.quotedBy || "مدیر کارخانه سنگ",
              };

              const newHistory = [
                {
                  id: `h-${Date.now()}`,
                  timestamp: `امروز، ${dateStr}`,
                  actor: fullQuotation.quotedBy,
                  action: "صدور و ارسال پیش‌فاکتور رسمی",
                  notes: `پیش‌فاکتور به مبلغ ${(
                    fullQuotation.finalPrice / 1_000_000
                  ).toLocaleString("fa-IR")} میلیون تومان صادر شد.`,
                },
                ...inq.history,
              ];

              return {
                ...inq,
                status: "quoted",
                quotation: fullQuotation,
                history: newHistory,
              };
            }),
          };
        });
      },

      acceptInquiry: (inquiryId, notes) => {
        const now = new Date();
        const dateStr = new Intl.DateTimeFormat("fa-IR", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(now);

        set((state) => ({
          inquiries: state.inquiries.map((inq) => {
            if (inq.id !== inquiryId) return inq;

            const newHistory = [
              {
                id: `h-${Date.now()}`,
                timestamp: `امروز، ${dateStr}`,
                actor: "مدیریت کارخانه",
                action: "تایید و تبدیل استعلام به سفارش جاری",
                notes: notes || "استعلام تایید شد و جهت فرآوری و برش ثبت گردید.",
              },
              ...inq.history,
            ];

            return {
              ...inq,
              status: "approved",
              history: newHistory,
            };
          }),
        }));
      },

      rejectInquiry: (inquiryId, reason) => {
        const now = new Date();
        const dateStr = new Intl.DateTimeFormat("fa-IR", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(now);

        set((state) => ({
          inquiries: state.inquiries.map((inq) => {
            if (inq.id !== inquiryId) return inq;

            const newHistory = [
              {
                id: `h-${Date.now()}`,
                timestamp: `امروز، ${dateStr}`,
                actor: "مدیر فروش",
                action: "رد یا بایگانی استعلام",
                notes: reason || "به علت عدم توافق یا عدم تطابق فنی رد شد.",
              },
              ...inq.history,
            ];

            return {
              ...inq,
              status: "rejected",
              history: newHistory,
            };
          }),
        }));
      },

      updateUrgency: (inquiryId, urgency) => {
        set((state) => ({
          inquiries: state.inquiries.map((inq) =>
            inq.id === inquiryId ? { ...inq, urgency } : inq
          ),
        }));
      },

      addInquiry: (item) => {
        const randNum = Math.floor(100 + Math.random() * 900);
        const newId = `inq-${Date.now()}`;
        const newRfqNumber = `RFQ-1403-${randNum}`;
        const now = new Date();
        const dateStr = new Intl.DateTimeFormat("fa-IR", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(now);

        const newInquiry: FactoryInquiryItem = {
          ...item,
          id: newId,
          rfqNumber: newRfqNumber,
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp: `امروز، ${dateStr}`,
              actor: "مدیر کارخانه (ثبت دستی)",
              action: "ثبت استعلام دستی جدید",
              notes: "استعلام توسط پرسنل کارخانه در سیستم ثبت گردید.",
            },
          ],
        };

        set((state) => ({
          inquiries: [newInquiry, ...state.inquiries],
        }));
      },

      getInquiryById: (id) => {
        return get().inquiries.find((inq) => inq.id === id);
      },

      getStats: (tenantId) => {
        const tenantInquiries = get().inquiries.filter(
          (inq) => inq.tenantId === tenantId || (!inq.tenantId && tenantId === "tenant-001")
        );

        let pending = 0;
        let quoted = 0;
        let approved = 0;
        let rejected = 0;
        let urgent = 0;
        let totalVolumeSqm = 0;
        let estimatedTotalValue = 0;

        tenantInquiries.forEach((inq) => {
          if (inq.status === "pending") pending += 1;
          if (inq.status === "quoted") quoted += 1;
          if (inq.status === "approved") approved += 1;
          if (inq.status === "rejected") rejected += 1;
          if (inq.urgency === "high") urgent += 1;

          if (inq.volumeNumber && inq.volumeUnit === "مترمربع") {
            totalVolumeSqm += inq.volumeNumber;
          }

          if (inq.quotation?.finalPrice) {
            estimatedTotalValue += inq.quotation.finalPrice;
          }
        });

        return {
          total: tenantInquiries.length,
          pending,
          quoted,
          approved,
          rejected,
          urgent,
          totalVolumeSqm,
          estimatedTotalValue,
        };
      },

      resetToDefault: () => {
        set({ inquiries: INITIAL_INQUIRIES });
      },
    }),
    {
      name: "factory-inquiries-storage",
    }
  )
);
