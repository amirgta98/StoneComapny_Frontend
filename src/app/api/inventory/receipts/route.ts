import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";
import { createReceiptSchema } from "@/modules/inventory/application/dto/inventory.dto";

export async function GET() {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const useCases = InventoryController.getUseCases();
    const receipts = await useCases.listReceipts(tenantId);
    return NextResponse.json({ receipts });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { tenantId, userName } = await InventoryController.authenticate("inventory:receive");
    const body = await req.json();
    const parsed = createReceiptSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات رسید نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const useCases = InventoryController.getUseCases();
    const receipt = await useCases.createReceipt(tenantId, parsed.data, userName);
    return NextResponse.json({ success: true, receipt }, { status: 201 });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
