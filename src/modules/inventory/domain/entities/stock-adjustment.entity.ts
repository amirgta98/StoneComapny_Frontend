import type { InventoryUnit } from "../value-objects/inventory-status.vo";

export interface StockAdjustmentProps {
  id: string;
  tenantId: string;
  adjustmentNumber: string;
  inventoryItemId: string;
  productName: string;
  quantityChange: number; // positive = increase, negative = decrease
  unit: InventoryUnit;
  targetProperty: "onHand" | "damaged" | "qualityCheck" | "scrap";
  reason: string;
  referenceType?: string;
  referenceId?: string;
  referenceNumber?: string;
  notes?: string;
  adjustedBy: string;
  createdAt: string;
}

export class StockAdjustment {
  constructor(private props: StockAdjustmentProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get adjustmentNumber(): string { return this.props.adjustmentNumber; }
  get inventoryItemId(): string { return this.props.inventoryItemId; }
  get productName(): string { return this.props.productName; }
  get quantityChange(): number { return this.props.quantityChange; }
  get unit(): InventoryUnit { return this.props.unit; }
  get targetProperty(): "onHand" | "damaged" | "qualityCheck" | "scrap" { return this.props.targetProperty; }
  get reason(): string { return this.props.reason; }
  get referenceType(): string | undefined { return this.props.referenceType; }
  get referenceId(): string | undefined { return this.props.referenceId; }
  get referenceNumber(): string | undefined { return this.props.referenceNumber; }
  get notes(): string | undefined { return this.props.notes; }
  get adjustedBy(): string { return this.props.adjustedBy; }
  get createdAt(): string { return this.props.createdAt; }

  public toJSON(): StockAdjustmentProps {
    return { ...this.props };
  }
}
