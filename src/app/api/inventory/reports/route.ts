import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";

export async function GET() {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view_reports");
    const useCases = InventoryController.getUseCases();
    const reports = await useCases.getReports(tenantId);
    return NextResponse.json(reports);
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
