"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  SupportConversation,
  SupportMessage,
  SupportStatus,
  SupportEvent,
} from "../types/support";
import type {
  CreateConversationValues,
  SendMessageValues,
} from "../schemas/support-schema";
import {
  INITIAL_SUPPORT_CONVERSATIONS,
  INITIAL_SUPPORT_MESSAGES,
} from "../data/mock-support";

interface SupportStoreState {
  conversations: SupportConversation[];
  messagesByConvId: Record<string, SupportMessage[]>;

  // Queries
  getUserConversations: (
    userId?: string,
    statusFilter?: SupportStatus | "ALL",
    query?: string
  ) => SupportConversation[];
  getConversationById: (
    id: string,
    userId?: string
  ) => SupportConversation | undefined;
  getMessagesByConversationId: (conversationId: string) => SupportMessage[];

  // Mutations
  createConversation: (
    data: CreateConversationValues,
    userId?: string,
    userName?: string
  ) => SupportConversation;
  sendMessage: (
    conversationId: string,
    data: SendMessageValues,
    userId?: string,
    userName?: string
  ) => SupportMessage | null;
  closeConversation: (
    conversationId: string,
    reason?: string,
    userId?: string
  ) => boolean;
  markConversationAsRead: (conversationId: string, userId?: string) => void;

  // Real-time Event Receiver (Future WebSocket Ready)
  applyRealtimeEvent: (event: SupportEvent) => void;
}

export const useSupportStore = create<SupportStoreState>()(
  persist(
    (set, get) => ({
      conversations: INITIAL_SUPPORT_CONVERSATIONS,
      messagesByConvId: INITIAL_SUPPORT_MESSAGES,

      getUserConversations: (
        userId = "u-user-1",
        statusFilter = "ALL",
        query = ""
      ) => {
        let list = get().conversations.filter((c) => c.userId === userId);

        if (statusFilter !== "ALL") {
          list = list.filter((c) => c.status === statusFilter);
        }

        if (query.trim()) {
          const q = query.trim().toLowerCase();
          list = list.filter(
            (c) =>
              c.subject.toLowerCase().includes(q) ||
              c.conversationNumber.toLowerCase().includes(q) ||
              (c.lastMessagePreview &&
                c.lastMessagePreview.toLowerCase().includes(q))
          );
        }

        // Sort latest updated first
        return list.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      },

      getConversationById: (id: string, userId = "u-user-1") => {
        return get().conversations.find(
          (c) =>
            (c.id === id || c.conversationNumber === id) &&
            c.userId === userId
        );
      },

      getMessagesByConversationId: (conversationId: string) => {
        const messages = get().messagesByConvId[conversationId] || [];
        return [...messages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      },

      createConversation: (
        data: CreateConversationValues,
        userId = "u-user-1",
        userName = "مشتری نمونه"
      ) => {
        const now = new Date().toISOString();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const conversationNumber = `SUP-1403-${randomNum}`;
        const newConvId = `conv-${Date.now()}`;
        const newMsgId = `msg-${Date.now()}`;

        const initialMessage: SupportMessage = {
          id: newMsgId,
          conversationId: newConvId,
          senderId: userId,
          senderName: userName,
          senderType: "CUSTOMER",
          body: data.initialMessage.trim(),
          attachments: data.attachments || [],
          createdAt: now,
        };

        const newConversation: SupportConversation = {
          id: newConvId,
          conversationNumber,
          userId,
          tenantId: "tenant-001",
          subject: data.subject.trim(),
          category: data.category,
          status: "OPEN",
          priority: data.priority || "NORMAL",
          assignedDepartment: "واحد پشتیبانی امور مشتریان",
          assignedAgentName: "کارشناس برخط",
          orderId: data.orderId || undefined,
          productId: data.productId || undefined,
          lastMessagePreview: data.initialMessage.trim(),
          lastMessageAt: now,
          unreadCountCustomer: 0,
          unreadCountSupport: 1,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          messagesByConvId: {
            ...state.messagesByConvId,
            [newConvId]: [initialMessage],
          },
        }));

        return newConversation;
      },

      sendMessage: (
        conversationId: string,
        data: SendMessageValues,
        userId = "u-user-1",
        userName = "مشتری نمونه"
      ) => {
        const conv = get().conversations.find(
          (c) =>
            (c.id === conversationId || c.conversationNumber === conversationId) &&
            c.userId === userId
        );

        if (!conv) return null;
        if (conv.status === "CLOSED" || conv.status === "REJECTED") {
          return null;
        }

        const now = new Date().toISOString();
        const newMsgId = `msg-${Date.now()}`;
        const realConvId = conv.id;

        const newMessage: SupportMessage = {
          id: newMsgId,
          conversationId: realConvId,
          senderId: userId,
          senderName: userName,
          senderType: "CUSTOMER",
          body: data.body.trim(),
          attachments: data.attachments || [],
          createdAt: now,
        };

        const nextStatus: SupportStatus =
          conv.status === "RESPONDED" || conv.status === "WAITING_USER"
            ? "WAITING_SUPPORT"
            : conv.status;

        const updatedPreview = data.body.trim() || "فایل پیوست ارسال شد";

        set((state) => {
          const existingMessages = state.messagesByConvId[realConvId] || [];
          return {
            messagesByConvId: {
              ...state.messagesByConvId,
              [realConvId]: [...existingMessages, newMessage],
            },
            conversations: state.conversations.map((c) => {
              if (c.id === realConvId) {
                return {
                  ...c,
                  status: nextStatus,
                  lastMessagePreview: updatedPreview,
                  lastMessageAt: now,
                  updatedAt: now,
                  unreadCountSupport: (c.unreadCountSupport || 0) + 1,
                };
              }
              return c;
            }),
          };
        });

        return newMessage;
      },

      closeConversation: (
        conversationId: string,
        reason?: string,
        userId = "u-user-1"
      ) => {
        let updated = false;
        const now = new Date().toISOString();

        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (
              (c.id === conversationId || c.conversationNumber === conversationId) &&
              c.userId === userId &&
              c.status !== "CLOSED"
            ) {
              updated = true;
              return {
                ...c,
                status: "CLOSED" as const,
                closedAt: now,
                updatedAt: now,
                rejectionReason: reason?.trim() || c.rejectionReason,
              };
            }
            return c;
          }),
        }));

        return updated;
      },

      markConversationAsRead: (conversationId: string, userId = "u-user-1") => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (
              (c.id === conversationId || c.conversationNumber === conversationId) &&
              c.userId === userId
            ) {
              return {
                ...c,
                unreadCountCustomer: 0,
              };
            }
            return c;
          }),
        }));
      },

      applyRealtimeEvent: (event: SupportEvent) => {
        const { type, conversationId, payload } = event;
        const state = get();

        switch (type) {
          case "MESSAGE_CREATED": {
            const message = payload as SupportMessage;
            const existingMessages = state.messagesByConvId[conversationId] || [];
            if (existingMessages.some((m) => m.id === message.id)) return;

            set((s) => ({
              messagesByConvId: {
                ...s.messagesByConvId,
                [conversationId]: [...existingMessages, message],
              },
              conversations: s.conversations.map((c) => {
                if (c.id === conversationId) {
                  return {
                    ...c,
                    lastMessagePreview: message.body || "پیام جدید",
                    lastMessageAt: message.createdAt,
                    updatedAt: message.createdAt,
                  };
                }
                return c;
              }),
            }));
            break;
          }

          case "CONVERSATION_STATUS_CHANGED": {
            const { status } = payload as { status: SupportStatus };
            set((s) => ({
              conversations: s.conversations.map((c) =>
                c.id === conversationId
                  ? { ...c, status, updatedAt: new Date().toISOString() }
                  : c
              ),
            }));
            break;
          }

          default:
            break;
        }
      },
    }),
    {
      name: "stone_support_store",
    }
  )
);
