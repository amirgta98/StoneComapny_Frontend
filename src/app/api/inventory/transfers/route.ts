import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";
import { transferStockSchema } from "@/modules/inventory/application/dto/inventory.dto";

export async function GET() {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const useCases = InventoryController.getUseCases();
    const transfers = await useCases.listTransfers(tenantId);
    return NextResponse.json({ transfers });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { tenantId, userName } = await InventoryController.authenticate("inventory:transfer");
    const body = await req.json();
    const parsed = transferStockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات انتقال نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const useCases = InventoryController.getUseCases();
    const transfer = await useCases.transferStock(tenantId, parsed.data, userName);
    return NextResponse.json({ success: true, transfer }, { status: 201 });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
