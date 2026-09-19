/**
 * Customer Account feature (skill: Customer Dashboard).
 *
 * Data/logic:
 * - `data/mock-data.ts` — mock orders, inquiries, favorites, addresses etc.
 *
 * UI:
 * - `components/overview.tsx`         — account summary + latest orders
 * - `components/orders-list.tsx`      — order history
 * - `components/inquiries-list.tsx`   — price inquiries
 * - `components/favorites-list.tsx`   — favorites + comparison history
 * - `components/addresses-list.tsx`   — delivery addresses
 * - `components/documents-list.tsx`   — technical documents
 * - `components/security-settings.tsx`— account security
 * - `components/support.tsx`          — contact support
 */
export { Overview } from "./components/overview";
export { OrdersList } from "./components/orders-list";
export { OrderDetail } from "./components/orders/order-detail";
export { InquiriesList } from "./components/inquiries-list";
export { InquiryDetail } from "./components/inquiries/inquiry-detail";
export { NewInquiryForm } from "./components/inquiries/new-inquiry-form";
export { useInquiryStore } from "./stores/inquiry-store";
export { inquiryFormSchema, type InquiryFormValues } from "./schemas/inquiry-schema";
export type {
  CustomerInquiry,
  InquiryStatus,
  ManagerQuoteResponse,
} from "./types/inquiry";
export { FavoritesList } from "./components/favorites-list";
export { AddressesList } from "./components/addresses/address-list";
export { NewAddress } from "./components/addresses/new-address";
export { EditAddress } from "./components/addresses/edit-address";
export { AddressCard } from "./components/addresses/address-card";
export { AddressForm } from "./components/addresses/address-form";
export { useAddressStore } from "./stores/address-store";
export type { CustomerAddress, AddressCardMode } from "./types/address";
export { addressFormSchema, type AddressFormValues } from "./schemas/address-schema";
export { DocumentsList } from "./components/documents-list";
export type { TechnicalDocument, TechnicalDocumentType } from "./types/document";
export { mockCustomerDocuments } from "./data/mock-documents";
export { SecuritySettings } from "./components/security-settings";
export { ChangePhoneFlow, ChangePhoneFlow as PhoneChangeForm } from "./components/security/change-phone-flow";
export { useSecurityStore } from "./stores/security-store";
export type { Session, UserSession, SecurityEvent } from "./types/security";
export { Support } from "./components/support";
export { SupportInbox } from "./components/support/support-inbox";
export { NewConversationForm } from "./components/support/new-conversation-form";
export { SupportChat } from "./components/support/support-chat";
export { SupportStatusBadge } from "./components/support/support-status-badge";
export { SupportCategoryBadge } from "./components/support/support-category-badge";
export { SupportConversationCard } from "./components/support/support-conversation-card";
export { useSupportStore } from "./stores/support-store";
export { supportService } from "./services/support-service";
export {
  createConversationSchema,
  sendMessageSchema,
  closeConversationSchema,
  type CreateConversationValues,
  type SendMessageValues,
  type CloseConversationValues,
} from "./schemas/support-schema";
export type {
  SupportStatus,
  SupportCategory,
  SupportPriority,
  SupportSenderType,
  SupportAttachment,
  SupportMessage,
  SupportConversation,
  SupportEvent,
} from "./types/support";

