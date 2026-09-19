import { NextRequest, NextResponse } from "next/server";
import {
  decodeSessionCookie,
  MOCK_SESSION_COOKIE,
} from "@/auth/session-codec";
import { inquiryFormSchema } from "@/features/account/schemas/inquiry-schema";

/**
 * GET /api/account/inquiries
 * Returns inquiries for the currently authenticated user.
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

  // Scoped to payload.uid (strict IDOR protection)
  return NextResponse.json({
    userId: payload.uid,
    message: "درخواست‌های استعلام کاربر با موفقیت بازیابی شد.",
  });
}

/**
 * POST /api/account/inquiries
 * Creates a new stone inquiry for the authenticated user.
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
    const validation = inquiryFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "داده‌های ورودی نامعتبر است.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const newInquiry = {
      id: `inq-${Date.now()}`,
      inquiryNumber: `INQ-1403-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: payload.uid, // enforced server-side from session
      ...validation.data,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        message: "استعلام جدید با موفقیت ثبت گردید.",
        inquiry: newInquiry,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "خطا در پردازش درخواست.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
