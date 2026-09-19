import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";
import { reserveStockSchema } from "@/modules/inventory/application/dto/inventory.dto";

export async function GET() {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const useCases = InventoryController.getUseCases();
    const reservations = await useCases.listReservations(tenantId);
    return NextResponse.json({ reservations });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { tenantId, userName } = await InventoryController.authenticate("inventory:reserve");
    const body = await req.json();
    const parsed = reserveStockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات رزرو نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const useCases = InventoryController.getUseCases();
    const reservation = await useCases.reserveStock(tenantId, parsed.data, userName);
    return NextResponse.json({ success: true, reservation }, { status: 201 });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
