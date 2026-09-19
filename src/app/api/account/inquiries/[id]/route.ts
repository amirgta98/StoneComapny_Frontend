import { NextRequest, NextResponse } from "next/server";
import {
  decodeSessionCookie,
  MOCK_SESSION_COOKIE,
} from "@/auth/session-codec";
import { inquiryFormSchema } from "@/features/account/schemas/inquiry-schema";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/account/inquiries/:id
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

  return NextResponse.json({
    id,
    userId: payload.uid,
    message: `استعلام ${id} برای کاربر تایید شد.`,
  });
}

/**
 * PATCH /api/account/inquiries/:id
 * Updates an existing pending inquiry.
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

  try {
    const body = await req.json();
    const partialSchema = inquiryFormSchema.partial();
    const validation = partialSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "داده‌های ویرایش نامعتبر است.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      id,
      userId: payload.uid,
      message: "استعلام با موفقیت ویرایش شد.",
      updated: validation.data,
    });
  } catch {
    return NextResponse.json(
      { error: "خطا در پردازش ویرایش." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/account/inquiries/:id
 * Cancels an inquiry.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const rawCookie = req.cookies.get(MOCK_SESSION_COOKIE)?.value;
  const payload = decodeSessionCookie(rawCookie);

  if (!payload || payload.exp <= Date.now()) {
    return NextResponse.json(
      { error: "احراز هویت انجام نشده است." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    id,
    userId: payload.uid,
    message: `استعلام ${id} لغو گردید.`,
  });
}
