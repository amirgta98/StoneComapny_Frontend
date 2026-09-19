"use client";

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
import { useSupportStore } from "../stores/support-store";

export type EventListener = (event: SupportEvent) => void;

export interface ISupportMessageService {
  fetchConversations(filters?: {
    status?: SupportStatus | "ALL";
    query?: string;
  }): Promise<SupportConversation[]>;

  fetchConversationById(id: string): Promise<SupportConversation | null>;

  createConversation(data: CreateConversationValues): Promise<SupportConversation>;

  fetchMessages(
    conversationId: string,
    options?: { cursor?: string; limit?: number }
  ): Promise<{ messages: SupportMessage[]; nextCursor?: string; hasMore: boolean }>;

  sendMessage(
    conversationId: string,
    data: SendMessageValues
  ): Promise<SupportMessage>;

  closeConversation(conversationId: string, reason?: string): Promise<boolean>;

  subscribeToConversation(
    conversationId: string,
    listener: EventListener
  ): () => void;

  subscribeToInbox(listener: EventListener): () => void;

  /**
   * Future WebSocket extension point:
   * When WebSocket client is initialized, it pipes inbound socket messages
   * into this dispatcher to notify UI subscribers without UI rewrites.
   */
  dispatchRemoteEvent(event: SupportEvent): void;
}

class HttpSupportMessageService implements ISupportMessageService {
  private conversationListeners = new Map<string, Set<EventListener>>();
  private inboxListeners = new Set<EventListener>();

  async fetchConversations(filters?: {
    status?: SupportStatus | "ALL";
    query?: string;
  }): Promise<SupportConversation[]> {
    try {
      const searchParams = new URLSearchParams();
      if (filters?.status && filters.status !== "ALL") {
        searchParams.set("status", filters.status);
      }
      if (filters?.query) {
        searchParams.set("q", filters.query);
      }

      const res = await fetch(
        `/api/account/support/conversations?${searchParams.toString()}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch from API");
      }
      const data = await res.json();
      return data.conversations || [];
    } catch {
      // Fallback to local store
      return useSupportStore
        .getState()
        .getUserConversations(
          undefined,
          filters?.status || "ALL",
          filters?.query || ""
        );
    }
  }

  async fetchConversationById(id: string): Promise<SupportConversation | null> {
    try {
      const res = await fetch(`/api/account/support/conversations/${id}`);
      if (!res.ok) throw new Error("Conversation not found");
      const data = await res.json();
      return data.conversation;
    } catch {
      return (
        useSupportStore.getState().getConversationById(id) || null
      );
    }
  }

  async createConversation(
    data: CreateConversationValues
  ): Promise<SupportConversation> {
    try {
      const res = await fetch(`/api/account/support/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Creation failed on API");
      const resData = await res.json();
      const createdConv = resData.conversation as SupportConversation;

      // Sync with local store
      useSupportStore.getState().createConversation(data);

      this.notifyInbox({
        type: "MESSAGE_CREATED",
        conversationId: createdConv.id,
        payload: createdConv,
        timestamp: new Date().toISOString(),
      });

      return createdConv;
    } catch {
      // Local store fallback
      const created = useSupportStore.getState().createConversation(data);
      this.notifyInbox({
        type: "MESSAGE_CREATED",
        conversationId: created.id,
        payload: created,
        timestamp: new Date().toISOString(),
      });
      return created;
    }
  }

  async fetchMessages(
    conversationId: string,
    options?: { cursor?: string; limit?: number }
  ): Promise<{ messages: SupportMessage[]; nextCursor?: string; hasMore: boolean }> {
    try {
      const params = new URLSearchParams();
      if (options?.cursor) params.set("cursor", options.cursor);
      if (options?.limit) params.set("limit", options.limit.toString());

      const res = await fetch(
        `/api/account/support/conversations/${conversationId}/messages?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      return {
        messages: data.messages || [],
        nextCursor: data.nextCursor,
        hasMore: !!data.hasMore,
      };
    } catch {
      const localMessages = useSupportStore
        .getState()
        .getMessagesByConversationId(conversationId);
      return {
        messages: localMessages,
        hasMore: false,
      };
    }
  }

  async sendMessage(
    conversationId: string,
    data: SendMessageValues
  ): Promise<SupportMessage> {
    try {
      const res = await fetch(
        `/api/account/support/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to send message via API");
      const resData = await res.json();
      const message = resData.message as SupportMessage;

      // Sync local store
      useSupportStore.getState().sendMessage(conversationId, data);

      const event: SupportEvent = {
        type: "MESSAGE_CREATED",
        conversationId,
        payload: message,
        timestamp: new Date().toISOString(),
      };
      this.notifyConversation(conversationId, event);
      this.notifyInbox(event);

      return message;
    } catch {
      const message = useSupportStore
        .getState()
        .sendMessage(conversationId, data);
      if (!message) {
        throw new Error("امکان ارسال پیام در این گفتگو وجود ندارد.");
      }

      const event: SupportEvent = {
        type: "MESSAGE_CREATED",
        conversationId,
        payload: message,
        timestamp: new Date().toISOString(),
      };
      this.notifyConversation(conversationId, event);
      this.notifyInbox(event);

      return message;
    }
  }

  async closeConversation(
    conversationId: string,
    reason?: string
  ): Promise<boolean> {
    try {
      const res = await fetch(
        `/api/account/support/conversations/${conversationId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "CLOSED", reason }),
        }
      );
      if (!res.ok) throw new Error("Failed to close conversation");

      useSupportStore.getState().closeConversation(conversationId, reason);

      const event: SupportEvent = {
        type: "CONVERSATION_STATUS_CHANGED",
        conversationId,
        payload: { status: "CLOSED" },
        timestamp: new Date().toISOString(),
      };
      this.notifyConversation(conversationId, event);
      this.notifyInbox(event);

      return true;
    } catch {
      const success = useSupportStore
        .getState()
        .closeConversation(conversationId, reason);
      if (success) {
        const event: SupportEvent = {
          type: "CONVERSATION_STATUS_CHANGED",
          conversationId,
          payload: { status: "CLOSED" },
          timestamp: new Date().toISOString(),
        };
        this.notifyConversation(conversationId, event);
        this.notifyInbox(event);
      }
      return success;
    }
  }

  subscribeToConversation(
    conversationId: string,
    listener: EventListener
  ): () => void {
    if (!this.conversationListeners.has(conversationId)) {
      this.conversationListeners.set(conversationId, new Set());
    }
    const set = this.conversationListeners.get(conversationId)!;
    set.add(listener);

    return () => {
      set.delete(listener);
      if (set.size === 0) {
        this.conversationListeners.delete(conversationId);
      }
    };
  }

  subscribeToInbox(listener: EventListener): () => void {
    this.inboxListeners.add(listener);
    return () => {
      this.inboxListeners.delete(listener);
    };
  }

  dispatchRemoteEvent(event: SupportEvent): void {
    useSupportStore.getState().applyRealtimeEvent(event);
    this.notifyConversation(event.conversationId, event);
    this.notifyInbox(event);
  }

  private notifyConversation(conversationId: string, event: SupportEvent) {
    const listeners = this.conversationListeners.get(conversationId);
    if (listeners) {
      listeners.forEach((fn) => {
        try {
          fn(event);
        } catch (e) {
          console.error("Error in support conversation event listener:", e);
        }
      });
    }
  }

  private notifyInbox(event: SupportEvent) {
    this.inboxListeners.forEach((fn) => {
      try {
        fn(event);
      } catch (e) {
        console.error("Error in support inbox event listener:", e);
      }
    });
  }
}

export const supportService: ISupportMessageService =
  new HttpSupportMessageService();
