import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";
import type { MovementType } from "@/modules/inventory/domain/value-objects/inventory-status.vo";

export async function GET(req: Request) {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const { searchParams } = new URL(req.url);

    const inventoryItemId = searchParams.get("inventoryItemId") || undefined;
    const type = (searchParams.get("type") as MovementType) || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const useCases = InventoryController.getUseCases();
    const result = await useCases.listMovements(tenantId, {
      inventoryItemId,
      type,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
