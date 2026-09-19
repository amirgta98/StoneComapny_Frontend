import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeSessionCookie, MOCK_SESSION_COOKIE } from "@/auth/session-codec";
import { InMemoryInventoryRepository } from "../../infrastructure/repositories/in-memory-inventory.repository";
import { InventoryUseCases } from "../../application/use-cases/inventory.use-cases";
import { AppError } from "@/lib/errors/app-error";
import type { Permission } from "@/auth/types";
import { hasPermission } from "@/auth/permissions";

export class InventoryController {
  private static useCasesInstance: InventoryUseCases | null = null;

  public static getUseCases(): InventoryUseCases {
    if (!InventoryController.useCasesInstance) {
      const repo = InMemoryInventoryRepository.getInstance();
      InventoryController.useCasesInstance = new InventoryUseCases(repo);
    }
    return InventoryController.useCasesInstance;
  }

  /**
   * Helper to resolve session and authenticate manager / tenant.
   * If permission is passed, checks RBAC matrix.
   */
  public static async authenticate(requiredPermission?: Permission): Promise<{
    userId: string;
    role: "SUPER_ADMIN" | "MANAGER" | "USER";
    tenantId: string;
    userName: string;
  }> {
    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(MOCK_SESSION_COOKIE)?.value;
    const session = decodeSessionCookie(rawCookie);

    // Fallback to active manager context if cookie is mock/unset
    const userId = session?.uid || "u-mgr-1";
    const role = (session?.role as "SUPER_ADMIN" | "MANAGER" | "USER") || "MANAGER";
    const tenantId = session?.tenantId || "tenant-001";
    const userName = role === "SUPER_ADMIN" ? "مدیر کل سامانه" : "مدیر کارخانه سنگ";

    if (requiredPermission) {
      const allowed = hasPermission(role, requiredPermission);
      if (!allowed) {
        throw AppError.forbidden(
          `نقش ${role} مجوز دسترسی به عملیات "${requiredPermission}" را ندارد.`
        );
      }
    }

    return { userId, role, tenantId, userName };
  }

  /**
   * Standard error response handler for API routes
   */
  public static handleError(error: unknown) {
    console.error("[Inventory API Error]:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message || "خطایی در پردازش عملیات انبار رخ داد.",
          code: "DOMAIN_ERROR",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "خطای ناشناخته سرور در سامانه انبارداری", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
