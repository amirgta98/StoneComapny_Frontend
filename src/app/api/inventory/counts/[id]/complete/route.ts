import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";
import { completeStockCountSchema } from "@/modules/inventory/application/dto/inventory.dto";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId, userName } = await InventoryController.authenticate("inventory:count");
    const { id } = await params;
    const body = await req.json();
    const parsed = completeStockCountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اقلام شمارش شده نامعتبر هستند", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const useCases = InventoryController.getUseCases();
    const count = await useCases.completeStockCount(id, tenantId, parsed.data, userName);
    return NextResponse.json({ success: true, count });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
