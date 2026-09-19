import type {
  TransferStatus,
  InventoryUnit,
} from "../value-objects/inventory-status.vo";

export interface StockTransferProps {
  id: string;
  tenantId: string;
  transferNumber: string;
  inventoryItemId: string;
  productName: string;
  stoneType: string;
  sourceLocationId: string;
  sourceLocationName: string;
  destinationLocationId: string;
  destinationLocationName: string;
  quantity: number;
  unit: InventoryUnit;
  status: TransferStatus;
  reason?: string;
  transferredBy: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export class StockTransfer {
  constructor(private props: StockTransferProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get transferNumber(): string { return this.props.transferNumber; }
  get inventoryItemId(): string { return this.props.inventoryItemId; }
  get productName(): string { return this.props.productName; }
  get stoneType(): string { return this.props.stoneType; }
  get sourceLocationId(): string { return this.props.sourceLocationId; }
  get sourceLocationName(): string { return this.props.sourceLocationName; }
  get destinationLocationId(): string { return this.props.destinationLocationId; }
  get destinationLocationName(): string { return this.props.destinationLocationName; }
  get quantity(): number { return this.props.quantity; }
  get unit(): InventoryUnit { return this.props.unit; }
  get status(): TransferStatus { return this.props.status; }
  get reason(): string | undefined { return this.props.reason; }
  get transferredBy(): string { return this.props.transferredBy; }
  get completedAt(): string | undefined { return this.props.completedAt; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  public complete(dateStr = new Date().toISOString()): void {
    if (this.props.status !== "PENDING") {
      throw new Error(`انتقال در وضعیت ${this.props.status} قابل تکمیل نیست.`);
    }
    this.props.status = "COMPLETED";
    this.props.completedAt = dateStr;
    this.props.updatedAt = dateStr;
  }

  public cancel(): void {
    if (this.props.status === "COMPLETED") {
      throw new Error("انتقال تکمیل شده قابل لغو نیست.");
    }
    this.props.status = "CANCELLED";
    this.props.updatedAt = new Date().toISOString();
  }

  public toJSON(): StockTransferProps {
    return { ...this.props };
  }
}
