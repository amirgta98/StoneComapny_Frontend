"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { faIR } from "date-fns/locale";
import {
  ArrowRight,
  UserCheck,
  Building,
  AlertCircle,
  ExternalLink,
  Plus,
  Lock,
  XCircle,
  Clock,
  ShoppingBag,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { SupportStatusBadge } from "./support-status-badge";
import { SupportCategoryBadge } from "./support-category-badge";
import { SupportMessageBubble } from "./support-message-bubble";
import { SupportMessageComposer } from "./support-message-composer";
import { CloseConversationModal } from "./close-conversation-modal";
import { useSupportStore } from "../../stores/support-store";
import { supportService } from "../../services/support-service";
import type {
  SupportConversation,
  SupportMessage,
  SupportAttachment,
} from "../../types/support";
import { SUPPORT_STATUS_CONFIG } from "../../types/support";
import { toast } from "sonner";

interface SupportChatProps {
  conversationId: string;
}

export function SupportChat({ conversationId }: SupportChatProps) {
  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getConversationById = useSupportStore((state) => state.getConversationById);
  const getMessagesByConversationId = useSupportStore(
    (state) => state.getMessagesByConversationId
  );
  const markConversationAsRead = useSupportStore(
    (state) => state.markConversationAsRead
  );

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Fetch initial data and subscribe to real-time events
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const [conv, msgData] = await Promise.all([
          supportService.fetchConversationById(conversationId),
          supportService.fetchMessages(conversationId),
        ]);

        if (isMounted) {
          if (conv) {
            setConversation(conv);
            markConversationAsRead(conv.id);
          } else {
            // fallback to store
            const localConv = getConversationById(conversationId);
            if (localConv) {
              setConversation(localConv);
              markConversationAsRead(localConv.id);
            }
          }

          if (msgData?.messages?.length) {
            setMessages(msgData.messages);
          } else {
            setMessages(getMessagesByConversationId(conversationId));
          }
        }
      } catch {
        if (isMounted) {
          const localConv = getConversationById(conversationId);
          if (localConv) {
            setConversation(localConv);
            markConversationAsRead(localConv.id);
          }
          setMessages(getMessagesByConversationId(conversationId));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setTimeout(() => scrollToBottom("auto"), 50);
        }
      }
    }

    loadData();

    // Subscribe to real-time conversation events
    const unsubscribe = supportService.subscribeToConversation(
      conversationId,
      (event) => {
        if (event.type === "MESSAGE_CREATED") {
          const newMsg = event.payload as SupportMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          setTimeout(() => scrollToBottom("smooth"), 100);
        } else if (event.type === "CONVERSATION_STATUS_CHANGED") {
          const { status } = event.payload as { status: SupportConversation["status"] };
          setConversation((prev) => (prev ? { ...prev, status } : null));
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [
    conversationId,
    getConversationById,
    getMessagesByConversationId,
    markConversationAsRead,
    scrollToBottom,
  ]);

  const handleSendMessage = async (data: {
    body: string;
    attachments?: SupportAttachment[];
  }) => {
    if (!conversation) return;
    const sent = await supportService.sendMessage(conversation.id, data);
    setMessages((prev) => {
      if (prev.some((m) => m.id === sent.id)) return prev;
      return [...prev, sent];
    });
    setTimeout(() => scrollToBottom("smooth"), 100);
  };

  const handleCloseConversation = async (reason?: string) => {
    if (!conversation) return;
    try {
      await supportService.closeConversation(conversation.id, reason);
      setConversation((prev) =>
        prev
          ? {
              ...prev,
              status: "CLOSED",
              rejectionReason: reason || prev.rejectionReason,
            }
          : null
      );
      toast.success("گفتگو با موفقیت بسته شد.");
    } catch {
      toast.error("خطا در بستن گفتگو.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="h-16 rounded-2xl bg-muted/40 animate-pulse" />
        <div className="h-[450px] rounded-2xl bg-muted/20 animate-pulse" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <Card className="rounded-2xl border-dashed p-10 text-center max-w-md mx-auto my-12">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
        <h2 className="text-base font-bold">گفتگوی مورد نظر یافت نشد</h2>
        <p className="text-xs text-muted-foreground mt-1">
          ممکن است این گفتگو حذف شده یا به حساب کاربری دیگری تعلق داشته باشد.
        </p>
        <div className="mt-5">
          <Button asChild size="sm" className="rounded-xl text-xs">
            <Link href="/account/support">بازگشت به پشتیبانی</Link>
          </Button>
        </div>
      </Card>
    );
  }

  const statusConfig =
    SUPPORT_STATUS_CONFIG[conversation.status] || SUPPORT_STATUS_CONFIG.OPEN;

  let formattedDate = "";
  try {
    formattedDate = format(parseISO(conversation.createdAt), "dd MMMM yyyy", {
      locale: faIR,
    });
  } catch {
    formattedDate = "";
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[850px] min-h-[550px] max-w-4xl mx-auto rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
      {/* 1. Header Row */}
      <div className="p-3.5 sm:p-4 border-b border-border/70 bg-card/90 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <Link href="/account/support">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                {conversation.subject}
              </h2>
              <span className="font-mono text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/40">
                {conversation.conversationNumber}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground flex-wrap">
              <SupportCategoryBadge
                category={conversation.category}
                showIcon={false}
              />
              {conversation.assignedAgentName && (
                <span className="inline-flex items-center gap-1">
                  <UserCheck className="h-3 w-3 text-primary" />
                  <span>{conversation.assignedAgentName}</span>
                </span>
              )}
              {formattedDate && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px]">
                  <Clock className="h-3 w-3" />
                  <span>{formattedDate}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center gap-2 ms-auto sm:ms-0">
          <SupportStatusBadge status={conversation.status} />

          {statusConfig.canClose && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCloseModalOpen(true)}
              className="h-8 text-xs rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              بستن گفتگو
            </Button>
          )}
        </div>
      </div>

      {/* 2. Optional Context Reference Banner (Order or Product) */}
      {(conversation.orderId || conversation.productId) && (
        <div className="px-4 py-2 bg-secondary/30 border-b border-border/50 text-xs flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            {conversation.orderId ? (
              <>
                <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                <span>
                  مرتبط با سفارش شماره:{" "}
                  <strong className="text-foreground font-mono">
                    #{conversation.orderId}
                  </strong>
                </span>
              </>
            ) : (
              <>
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>
                  مرتبط با محصول:{" "}
                  <strong className="text-foreground">
                    {conversation.productId}
                  </strong>
                </span>
              </>
            )}
          </div>

          {conversation.orderId && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-6 text-[11px] text-primary gap-1 px-2 hover:bg-primary/10 rounded-lg"
            >
              <Link href={`/account/orders?id=${conversation.orderId}`}>
                مشاهده سفارش
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* 3. Special Status Alerts */}
      {conversation.status === "REJECTED" && (
        <div className="p-3 bg-rose-500/10 border-b border-rose-500/20 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2 shrink-0">
          <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">این درخواست رد شده است</p>
            {conversation.rejectionReason && (
              <p className="text-[11px] leading-relaxed">
                علت: {conversation.rejectionReason}
              </p>
            )}
          </div>
        </div>
      )}

      {conversation.status === "CLOSED" && (
        <div className="p-3 bg-stone-500/10 border-b border-stone-500/20 text-xs text-stone-700 dark:text-stone-300 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>این گفتگو بسته شده است و امکان ارسال پیام جدید وجود ندارد.</span>
          </div>
          <Button
            asChild
            size="sm"
            className="h-7 text-xs rounded-xl gap-1 px-3 shadow-xs"
          >
            <Link href="/account/support/new">
              <Plus className="h-3.5 w-3.5" />
              شروع گفتگوی جدید
            </Link>
          </Button>
        </div>
      )}

      {/* 4. Scrollable Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-muted/5 scrollbar-thin">
        {/* Initial Conversation Header Hint */}
        <div className="text-center py-2">
          <span className="inline-block rounded-full bg-secondary/80 px-3 py-1 text-[10px] text-muted-foreground border border-border/50">
            شروع گفتگو در تاریخ {formattedDate}
          </span>
        </div>

        {messages.map((message) => (
          <SupportMessageBubble
            key={message.id}
            message={message}
            isCustomer={message.senderType === "CUSTOMER"}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. Message Composer at Bottom */}
      <div className="p-3 sm:p-4 border-t border-border/70 bg-card shrink-0">
        <SupportMessageComposer
          onSendMessage={handleSendMessage}
          isDisabled={!statusConfig.canSendMessage}
          disabledReason={
            conversation.status === "CLOSED"
              ? "این گفتگو بسته شده است."
              : conversation.status === "REJECTED"
              ? "این گفتگو رد شده است."
              : undefined
          }
        />
      </div>

      {/* Close Conversation Modal */}
      <CloseConversationModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirm={handleCloseConversation}
        conversationNumber={conversation.conversationNumber}
      />
    </div>
  );
}
