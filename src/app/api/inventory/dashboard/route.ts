import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";

export async function GET() {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const useCases = InventoryController.getUseCases();
    const data = await useCases.getDashboard(tenantId);
    return NextResponse.json(data);
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
