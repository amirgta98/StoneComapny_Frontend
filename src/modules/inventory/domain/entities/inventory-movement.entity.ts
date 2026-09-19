import type {
  MovementType,
  InventoryUnit,
} from "../value-objects/inventory-status.vo";

export interface InventoryMovementProps {
  id: string;
  tenantId: string;
  inventoryItemId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  unit: InventoryUnit;
  sourceLocationId?: string;
  sourceLocationName?: string;
  destinationLocationId?: string;
  destinationLocationName?: string;
  referenceType?: "RECEIPT" | "ISSUE" | "TRANSFER" | "COUNT" | "ADJUSTMENT" | "ORDER" | "INITIAL";
  referenceId?: string;
  referenceNumber?: string;
  balanceAfter: number;
  reason?: string;
  performedBy: string;
  createdAt: string;
}

export class InventoryMovement {
  constructor(private props: InventoryMovementProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get inventoryItemId(): string { return this.props.inventoryItemId; }
  get productName(): string { return this.props.productName; }
  get type(): MovementType { return this.props.type; }
  get quantity(): number { return this.props.quantity; }
  get unit(): InventoryUnit { return this.props.unit; }
  get sourceLocationId(): string | undefined { return this.props.sourceLocationId; }
  get sourceLocationName(): string | undefined { return this.props.sourceLocationName; }
  get destinationLocationId(): string | undefined { return this.props.destinationLocationId; }
  get destinationLocationName(): string | undefined { return this.props.destinationLocationName; }
  get referenceType(): string | undefined { return this.props.referenceType; }
  get referenceId(): string | undefined { return this.props.referenceId; }
  get referenceNumber(): string | undefined { return this.props.referenceNumber; }
  get balanceAfter(): number { return this.props.balanceAfter; }
  get reason(): string | undefined { return this.props.reason; }
  get performedBy(): string { return this.props.performedBy; }
  get createdAt(): string { return this.props.createdAt; }

  get isInward(): boolean {
    return (
      this.props.type === "RECEIPT" ||
      this.props.type === "TRANSFER_IN" ||
      this.props.type === "ADJUSTMENT_IN" ||
      this.props.type === "INITIAL"
    );
  }

  get isOutward(): boolean {
    return (
      this.props.type === "ISSUE" ||
      this.props.type === "TRANSFER_OUT" ||
      this.props.type === "ADJUSTMENT_OUT"
    );
  }

  public toJSON(): InventoryMovementProps {
    return { ...this.props };
  }
}
