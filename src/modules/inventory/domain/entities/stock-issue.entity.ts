import type {
  IssueStatus,
  InventoryUnit,
} from "../value-objects/inventory-status.vo";

export interface StockIssueItem {
  id: string;
  inventoryItemId: string;
  productId: string;
  productName: string;
  stoneType: string;
  locationId: string;
  locationName: string;
  quantity: number;
  unit: InventoryUnit;
  unitPrice?: number;
  slabId?: string;
  notes?: string;
}

export interface StockIssueProps {
  id: string;
  tenantId: string;
  issueNumber: string;
  reason:
    | "ORDER_FULFILLMENT"
    | "FACTORY_CONSUMPTION"
    | "SAMPLE"
    | "DAMAGE"
    | "SCRAP"
    | "TRANSFER"
    | "OTHER";
  orderId?: string;
  customerName?: string;
  status: IssueStatus;
  items: StockIssueItem[];
  totalQuantity: number;
  unit: InventoryUnit;
  reference?: string;
  notes?: string;
  issuedBy: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export class StockIssue {
  constructor(private props: StockIssueProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get issueNumber(): string { return this.props.issueNumber; }
  get reason(): string { return this.props.reason; }
  get orderId(): string | undefined { return this.props.orderId; }
  get customerName(): string | undefined { return this.props.customerName; }
  get status(): IssueStatus { return this.props.status; }
  get items(): StockIssueItem[] { return this.props.items; }
  get totalQuantity(): number { return this.props.totalQuantity; }
  get unit(): InventoryUnit { return this.props.unit; }
  get reference(): string | undefined { return this.props.reference; }
  get notes(): string | undefined { return this.props.notes; }
  get issuedBy(): string { return this.props.issuedBy; }
  get confirmedAt(): string | undefined { return this.props.confirmedAt; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  public confirm(confirmedBy: string, dateStr = new Date().toISOString()): void {
    if (this.props.status !== "DRAFT") {
      throw new Error(`فقط حواله در وضعیت پیش‌نویس قابل تایید است (وضعیت فعلی: ${this.props.status})`);
    }
    this.props.status = "CONFIRMED";
    this.props.confirmedAt = dateStr;
    this.props.updatedAt = dateStr;
  }

  public toJSON(): StockIssueProps {
    return { ...this.props };
  }
}
