import { NextRequest, NextResponse } from "next/server";
import {
  decodeSessionCookie,
  MOCK_SESSION_COOKIE,
} from "@/auth/session-codec";
import { sendMessageSchema } from "@/features/account/schemas/support-schema";
import type {
  SupportMessage,
  SupportStatus,
} from "@/features/account/types/support";
import {
  runtimeConversations,
  runtimeMessages,
} from "../../../runtime-store";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/account/support/conversations/:id/messages
 * Retrieves paginated message history for a conversation.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const rawCookie = req.cookies.get(MOCK_SESSION_COOKIE)?.value;
  const payload = decodeSessionCookie(rawCookie);

  if (!payload || payload.exp <= Date.now()) {
    return NextResponse.json(
      { error: "احراز هویت انجام نشده است." },
      { status: 401 }
    );
  }

  const conversation = Array.from(runtimeConversations.values()).find(
    (c) => c.id === id || c.conversationNumber === id
  );

  if (!conversation) {
    return NextResponse.json(
      { error: "گفتگوی مورد نظر یافت نشد." },
      { status: 404 }
    );
  }

  if (conversation.userId !== payload.uid && payload.role === "USER") {
    return NextResponse.json(
      { error: "شما اجازه دسترسی به پیام‌های این گفتگو را ندارید." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    parseInt(searchParams.get("limit") || "50", 10),
    100
  );
  const cursor = searchParams.get("cursor");

  const allMessages = runtimeMessages.get(conversation.id) || [];
  // Sort chronological
  const sorted = [...allMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  let startIndex = 0;
  if (cursor) {
    const cursorIndex = sorted.findIndex((m) => m.id === cursor);
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  }

  const paged = sorted.slice(startIndex, startIndex + limit);
  const nextCursor =
    startIndex + limit < sorted.length
      ? paged[paged.length - 1]?.id
      : undefined;

  return NextResponse.json({
    messages: paged,
    hasMore: startIndex + limit < sorted.length,
    nextCursor,
  });
}

/**
 * POST /api/account/support/conversations/:id/messages
 * Appends a new message to the conversation.
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const rawCookie = req.cookies.get(MOCK_SESSION_COOKIE)?.value;
  const payload = decodeSessionCookie(rawCookie);

  if (!payload || payload.exp <= Date.now()) {
    return NextResponse.json(
      { error: "احراز هویت انجام نشده است." },
      { status: 401 }
    );
  }

  const conversation = Array.from(runtimeConversations.values()).find(
    (c) => c.id === id || c.conversationNumber === id
  );

  if (!conversation) {
    return NextResponse.json(
      { error: "گفتگوی مورد نظر یافت نشد." },
      { status: 404 }
    );
  }

  if (conversation.userId !== payload.uid && payload.role === "USER") {
    return NextResponse.json(
      { error: "شما اجازه ارسال پیام در این گفتگو را ندارید." },
      { status: 403 }
    );
  }

  if (conversation.status === "CLOSED") {
    return NextResponse.json(
      { error: "این گفتگو بسته شده است و امکان ارسال پیام جدید وجود ندارد." },
      { status: 400 }
    );
  }

  if (conversation.status === "REJECTED") {
    return NextResponse.json(
      { error: "این گفتگو رد شده است و امکان ارسال پیام جدید در آن وجود ندارد." },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const validation = sendMessageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "داده‌های ورودی نامعتبر است.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { body: messageText, attachments } = validation.data;
    const now = new Date().toISOString();
    const newMsgId = `msg-${Date.now()}`;

    const newMessage: SupportMessage = {
      id: newMsgId,
      conversationId: conversation.id,
      senderId: payload.uid, // Server enforced
      senderName: "مشتری گرامی",
      senderType: "CUSTOMER",
      body: messageText.trim(),
      attachments: attachments || [],
      createdAt: now,
    };

    const existingMessages = runtimeMessages.get(conversation.id) || [];
    runtimeMessages.set(conversation.id, [...existingMessages, newMessage]);

    // Update conversation metadata
    const nextStatus: SupportStatus =
      conversation.status === "RESPONDED" ||
      conversation.status === "WAITING_USER"
        ? "WAITING_SUPPORT"
        : conversation.status;

    const updatedPreview = messageText.trim() || "فایل پیوست ارسال شد";

    const updatedConversation = {
      ...conversation,
      status: nextStatus,
      lastMessagePreview: updatedPreview,
      lastMessageAt: now,
      updatedAt: now,
      unreadCountSupport: (conversation.unreadCountSupport || 0) + 1,
    };

    runtimeConversations.set(conversation.id, updatedConversation);

    return NextResponse.json(
      {
        message: newMessage,
        conversation: updatedConversation,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "خطا در ارسال پیام." },
      { status: 500 }
    );
  }
}
