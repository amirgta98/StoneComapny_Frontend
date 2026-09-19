import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";
import { createLocationSchema } from "@/modules/inventory/application/dto/inventory.dto";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:manage_locations");
    const { id } = await params;
    const body = await req.json();
    const parsed = createLocationSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات ارسالی نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const useCases = InventoryController.getUseCases();
    const location = await useCases.updateLocation(id, tenantId, parsed.data);
    return NextResponse.json({ success: true, location });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:manage_locations");
    const { id } = await params;
    const useCases = InventoryController.getUseCases();
    const result = await useCases.deleteLocation(id, tenantId);
    return NextResponse.json(result);
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
