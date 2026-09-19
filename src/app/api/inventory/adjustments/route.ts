import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";
import { createStockAdjustmentSchema } from "@/modules/inventory/application/dto/inventory.dto";

export async function GET() {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const useCases = InventoryController.getUseCases();
    const adjustments = await useCases.listAdjustments(tenantId);
    return NextResponse.json({ adjustments });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { tenantId, userName } = await InventoryController.authenticate("inventory:adjust");
    const body = await req.json();
    const parsed = createStockAdjustmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات تعدیل موجودی نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const useCases = InventoryController.getUseCases();
    const adjustment = await useCases.createAdjustment(tenantId, parsed.data, userName);
    return NextResponse.json({ success: true, adjustment }, { status: 201 });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
