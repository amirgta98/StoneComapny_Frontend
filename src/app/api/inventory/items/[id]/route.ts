import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const { id } = await params;
    const useCases = InventoryController.getUseCases();
    const result = await useCases.getItemDetail(id, tenantId);
    return NextResponse.json(result);
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
