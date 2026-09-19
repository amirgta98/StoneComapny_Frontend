import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";

export async function GET() {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const useCases = InventoryController.getUseCases();
    const alerts = await useCases.getAlerts(tenantId);
    return NextResponse.json(alerts);
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
