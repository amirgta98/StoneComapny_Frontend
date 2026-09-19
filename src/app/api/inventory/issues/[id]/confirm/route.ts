import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId, userName } = await InventoryController.authenticate("inventory:issue");
    const { id } = await params;
    const useCases = InventoryController.getUseCases();
    const issue = await useCases.confirmIssue(id, tenantId, userName);
    return NextResponse.json({ success: true, issue });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
