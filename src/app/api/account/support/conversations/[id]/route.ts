import { NextRequest, NextResponse } from "next/server";
import {
  decodeSessionCookie,
  MOCK_SESSION_COOKIE,
} from "@/auth/session-codec";
import { closeConversationSchema } from "@/features/account/schemas/support-schema";
import { runtimeConversations } from "../../runtime-store";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/account/support/conversations/:id
 * Fetches single conversation detail with strict IDOR prevention.
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

  // IDOR check: conversation must belong to authenticated user
  if (conversation.userId !== payload.uid && payload.role === "USER") {
    return NextResponse.json(
      { error: "شما اجازه دسترسی به این گفتگو را ندارید." },
      { status: 403 }
    );
  }

  return NextResponse.json({ conversation });
}

/**
 * PATCH /api/account/support/conversations/:id
 * Allows customer to close an open conversation.
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
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
      { error: "شما اجازه ویرایش این گفتگو را ندارید." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const validation = closeConversationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "داده‌های ورودی نامعتبر است.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const updatedConversation = {
      ...conversation,
      status: "CLOSED" as const,
      closedAt: now,
      updatedAt: now,
      rejectionReason: validation.data.reason || conversation.rejectionReason,
    };

    runtimeConversations.set(conversation.id, updatedConversation);

    return NextResponse.json({
      message: "گفتگو با موفقیت بسته شد.",
      conversation: updatedConversation,
    });
  } catch {
    return NextResponse.json(
      { error: "خطا در پردازش درخواست." },
      { status: 500 }
    );
  }
}
