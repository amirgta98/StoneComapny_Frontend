import type {
  SupportConversation,
  SupportMessage,
} from "@/features/account/types/support";
import {
  INITIAL_SUPPORT_CONVERSATIONS,
  INITIAL_SUPPORT_MESSAGES,
} from "@/features/account/data/mock-support";

// In-memory runtime storage for API requests (shared within server instance)
export const runtimeConversations = new Map<string, SupportConversation>();
export const runtimeMessages = new Map<string, SupportMessage[]>();

// Initialize with mock seed data
INITIAL_SUPPORT_CONVERSATIONS.forEach((c) => runtimeConversations.set(c.id, c));
Object.entries(INITIAL_SUPPORT_MESSAGES).forEach(([convId, msgs]) =>
  runtimeMessages.set(convId, [...msgs])
);
