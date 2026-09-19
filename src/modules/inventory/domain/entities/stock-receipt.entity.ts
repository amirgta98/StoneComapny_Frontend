import type {
  ReceiptStatus,
  InventoryUnit,
} from "../value-objects/inventory-status.vo";

export interface StockReceiptItem {
  id: string;
  inventoryItemId?: string;
  productId: string;
  productName: string;
  stoneType: string;
  dimensions?: string;
  thickness?: number;
  grade?: string;
  batchNumber?: string;
  slabId?: string;
  locationId: string;
  locationName: string;
  quantity: number;
  unit: InventoryUnit;
  unitCost: number;
  notes?: string;
}

export interface StockReceiptProps {
  id: string;
  tenantId: string;
  receiptNumber: string;
  source: "PRODUCTION" | "SUPPLIER" | "PURCHASE" | "RETURN" | "OTHER";
  supplierName?: string;
  status: ReceiptStatus;
  items: StockReceiptItem[];
  totalQuantity: number;
  unit: InventoryUnit;
  reference?: string;
  notes?: string;
  receivedBy: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export class StockReceipt {
  constructor(private props: StockReceiptProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get receiptNumber(): string { return this.props.receiptNumber; }
  get source(): string { return this.props.source; }
  get supplierName(): string | undefined { return this.props.supplierName; }
  get status(): ReceiptStatus { return this.props.status; }
  get items(): StockReceiptItem[] { return this.props.items; }
  get totalQuantity(): number { return this.props.totalQuantity; }
  get unit(): InventoryUnit { return this.props.unit; }
  get reference(): string | undefined { return this.props.reference; }
  get notes(): string | undefined { return this.props.notes; }
  get receivedBy(): string { return this.props.receivedBy; }
  get confirmedAt(): string | undefined { return this.props.confirmedAt; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  public confirm(confirmedBy: string, dateStr = new Date().toISOString()): void {
    if (this.props.status !== "DRAFT") {
      throw new Error(`فقط رسید در وضعیت پیش‌نویس قابل تایید است (وضعیت فعلی: ${this.props.status})`);
    }
    this.props.status = "CONFIRMED";
    this.props.confirmedAt = dateStr;
    this.props.updatedAt = dateStr;
  }

  public cancel(cancelledBy: string): void {
    if (this.props.status === "CONFIRMED") {
      throw new Error("رسید تایید شده قابل لغو مستقیم نیست؛ باید از طریق تعدیل اصلاح گردد.");
    }
    this.props.status = "CANCELLED";
    this.props.updatedAt = new Date().toISOString();
  }

  public toJSON(): StockReceiptProps {
    return { ...this.props };
  }
}
