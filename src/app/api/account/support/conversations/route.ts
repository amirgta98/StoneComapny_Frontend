import { NextRequest, NextResponse } from "next/server";
import {
  decodeSessionCookie,
  MOCK_SESSION_COOKIE,
} from "@/auth/session-codec";
import { createConversationSchema } from "@/features/account/schemas/support-schema";
import type {
  SupportConversation,
  SupportMessage,
} from "@/features/account/types/support";
import {
  runtimeConversations,
  runtimeMessages,
} from "../runtime-store";

/**
 * GET /api/account/support/conversations
 * Returns conversations belonging to the authenticated user.
 */
export async function GET(req: NextRequest) {
  const rawCookie = req.cookies.get(MOCK_SESSION_COOKIE)?.value;
  const payload = decodeSessionCookie(rawCookie);

  if (!payload || payload.exp <= Date.now()) {
    return NextResponse.json(
      { error: "احراز هویت انجام نشده است." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");
  const query = searchParams.get("q")?.toLowerCase();

  // Strict ownership check (IDOR protection)
  let conversations = Array.from(runtimeConversations.values()).filter(
    (c) => c.userId === payload.uid
  );

  if (statusFilter && statusFilter !== "ALL") {
    conversations = conversations.filter((c) => c.status === statusFilter);
  }

  if (query) {
    conversations = conversations.filter(
      (c) =>
        c.subject.toLowerCase().includes(query) ||
        c.conversationNumber.toLowerCase().includes(query) ||
        (c.lastMessagePreview &&
          c.lastMessagePreview.toLowerCase().includes(query))
    );
  }

  // Sort by latest updated first
  conversations.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return NextResponse.json({
    userId: payload.uid,
    conversations,
  });
}

/**
 * POST /api/account/support/conversations
 * Creates a new support conversation and its initial message.
 */
export async function POST(req: NextRequest) {
  const rawCookie = req.cookies.get(MOCK_SESSION_COOKIE)?.value;
  const payload = decodeSessionCookie(rawCookie);

  if (!payload || payload.exp <= Date.now()) {
    return NextResponse.json(
      { error: "احراز هویت انجام نشده است." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const validation = createConversationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "داده‌های ورودی نامعتبر است.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      subject,
      category,
      priority,
      initialMessage,
      orderId,
      productId,
      attachments,
    } = validation.data;

    const now = new Date().toISOString();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const conversationNumber = `SUP-1403-${randomNum}`;
    const newConvId = `conv-${Date.now()}`;
    const newMsgId = `msg-${Date.now()}`;

    const firstMessage: SupportMessage = {
      id: newMsgId,
      conversationId: newConvId,
      senderId: payload.uid, // server-enforced identity
      senderName: "مشتری گرامی",
      senderType: "CUSTOMER",
      body: initialMessage.trim(),
      attachments: attachments || [],
      createdAt: now,
    };

    const newConversation: SupportConversation = {
      id: newConvId,
      conversationNumber,
      userId: payload.uid, // strict server-side owner assignment
      tenantId: payload.tenantId || "tenant-001",
      subject: subject.trim(),
      category,
      status: "OPEN",
      priority: priority || "NORMAL",
      assignedDepartment: "واحد پشتیبانی امور مشتریان",
      assignedAgentName: "کارشناس برخط",
      orderId: orderId || undefined,
      productId: productId || undefined,
      lastMessagePreview: initialMessage.trim(),
      lastMessageAt: now,
      unreadCountCustomer: 0,
      unreadCountSupport: 1,
      createdAt: now,
      updatedAt: now,
    };

    runtimeConversations.set(newConvId, newConversation);
    runtimeMessages.set(newConvId, [firstMessage]);

    return NextResponse.json(
      {
        message: "گفتگوی پشتیبانی با موفقیت ایجاد شد.",
        conversation: newConversation,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "خطا در پردازش درخواست." },
      { status: 500 }
    );
  }
}
