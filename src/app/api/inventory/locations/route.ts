import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";
import { createLocationSchema } from "@/modules/inventory/application/dto/inventory.dto";

export async function GET() {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const useCases = InventoryController.getUseCases();
    const locations = await useCases.listLocations(tenantId);
    return NextResponse.json({ locations });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:manage_locations");
    const body = await req.json();
    const parsed = createLocationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "مشخصات موقعیت انبار نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const useCases = InventoryController.getUseCases();
    const location = await useCases.createLocation(tenantId, parsed.data);
    return NextResponse.json({ success: true, location }, { status: 201 });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
