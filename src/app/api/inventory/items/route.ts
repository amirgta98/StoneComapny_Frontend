import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";
import type { InventoryItemStatus, InventoryUnit } from "@/modules/inventory/domain/value-objects/inventory-status.vo";

export async function GET(req: Request) {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query") || undefined;
    const stoneType = searchParams.get("stoneType") || undefined;
    const color = searchParams.get("color") || undefined;
    const form = searchParams.get("form") || undefined;
    const unit = (searchParams.get("unit") as InventoryUnit) || undefined;
    const locationId = searchParams.get("locationId") || undefined;
    const status = (searchParams.get("status") as InventoryItemStatus) || undefined;
    const lowStockOnly = searchParams.get("lowStockOnly") === "true";
    const outOfStockOnly = searchParams.get("outOfStockOnly") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const useCases = InventoryController.getUseCases();
    const result = await useCases.listItems(tenantId, {
      query,
      stoneType,
      color,
      form,
      unit,
      locationId,
      status,
      lowStockOnly,
      outOfStockOnly,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
