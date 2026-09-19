/**
 * Inquiries feature.
 *
 * Manages B2B architectural stone inquiries, RFQs, quotes, pre-invoices, and audit logs.
 */

// Components
export { InquiriesManagerView } from "./components/inquiries-manager-view";
export { InquiryDetailDialog } from "./components/inquiry-detail-dialog";
export { InquiryQuoteDialog } from "./components/inquiry-quote-dialog";
export { InquiryPrintPreviewDialog } from "./components/inquiry-print-preview-dialog";
export { NewInquiryDialog } from "./components/new-inquiry-dialog";

// Store
export { useFactoryInquiriesStore } from "./stores/factory-inquiries-store";

// Types
export type {
  FactoryInquiryItem,
  InquiryQuotation,
  InquiryStatus,
  CustomerRole,
  StoneCategory,
  StoneForm,
  InquiryUrgency,
  InquiryAttachment,
  InquiryHistoryEvent,
  InquiryStats,
} from "./types";
