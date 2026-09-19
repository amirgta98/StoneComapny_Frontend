import { NextResponse } from "next/server";
import { InventoryController } from "@/modules/inventory/presentation/controllers/inventory.controller";
import { createIssueSchema } from "@/modules/inventory/application/dto/inventory.dto";

export async function GET() {
  try {
    const { tenantId } = await InventoryController.authenticate("inventory:view");
    const useCases = InventoryController.getUseCases();
    const issues = await useCases.listIssues(tenantId);
    return NextResponse.json({ issues });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { tenantId, userName } = await InventoryController.authenticate("inventory:issue");
    const body = await req.json();
    const parsed = createIssueSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات حواله خروج نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const useCases = InventoryController.getUseCases();
    const issue = await useCases.createIssue(tenantId, parsed.data, userName);
    return NextResponse.json({ success: true, issue }, { status: 201 });
  } catch (error) {
    return InventoryController.handleError(error);
  }
}
