import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId, userName } = await InventoryController.authenticate("inventory:receive");
    const { id } = await params;
    const useCases = InventoryController.getUseCases();
    const receipt = await useCases.confirmReceipt(id, tenantId, userName);
    return NextResponse.json({ success: true, receipt });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
