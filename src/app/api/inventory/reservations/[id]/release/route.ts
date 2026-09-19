import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId, userName } = await InventoryController.authenticate("inventory:release");
    const { id } = await params;
    const useCases = InventoryController.getUseCases();
    const reservation = await useCases.releaseReservation(id, tenantId, userName);
    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
