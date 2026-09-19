import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";
import { createStockCountSchema } from "@/modules/inventory/application/dto/inventory.dto";

export async function GET() {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const useCases = InventoryController.getUseCases();
    const counts = await useCases.listCounts(tenantId);
    return NextResponse.json({ counts });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { tenantId, userName } = await InventoryController.authenticate("inventory:count");
    const body = await req.json();
    const parsed = createStockCountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات انبارگردانی نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const useCases = InventoryController.getUseCases();
    const count = await useCases.createStockCount(tenantId, parsed.data, userName);
    return NextResponse.json({ success: true, count }, { status: 201 });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
