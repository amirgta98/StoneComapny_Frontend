import type {
  StockCountStatus,
  InventoryUnit,
} from "../value-objects/inventory-status.vo";

export interface StockCountItem {
  id: string;
  inventoryItemId: string;
  productName: string;
  stoneType: string;
  dimensions?: string;
  unit: InventoryUnit;
  systemQuantity: number;
  physicalQuantity: number;
  discrepancyQuantity: number; // physical - system
  notes?: string;
}

export interface StockCountProps {
  id: string;
  tenantId: string;
  countNumber: string;
  title: string;
  locationId: string;
  locationName: string;
  status: StockCountStatus;
  items: StockCountItem[];
  totalSystemQty: number;
  totalPhysicalQty: number;
  totalDiffQty: number;
  countedBy: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class StockCount {
  constructor(private props: StockCountProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get countNumber(): string { return this.props.countNumber; }
  get title(): string { return this.props.title; }
  get locationId(): string { return this.props.locationId; }
  get locationName(): string { return this.props.locationName; }
  get status(): StockCountStatus { return this.props.status; }
  get items(): StockCountItem[] { return this.props.items; }
  get totalSystemQty(): number { return this.props.totalSystemQty; }
  get totalPhysicalQty(): number { return this.props.totalPhysicalQty; }
  get totalDiffQty(): number { return this.props.totalDiffQty; }
  get countedBy(): string { return this.props.countedBy; }
  get completedAt(): string | undefined { return this.props.completedAt; }
  get notes(): string | undefined { return this.props.notes; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  public complete(items: StockCountItem[], dateStr = new Date().toISOString()): void {
    if (this.props.status === "COMPLETED") {
      throw new Error("این انبارگردانی قبلاً نهایی و تصویب شده است.");
    }
    this.props.items = items;
    this.props.totalSystemQty = items.reduce((s, i) => s + i.systemQuantity, 0);
    this.props.totalPhysicalQty = items.reduce((s, i) => s + i.physicalQuantity, 0);
    this.props.totalDiffQty = items.reduce((s, i) => s + i.discrepancyQuantity, 0);
    this.props.status = "COMPLETED";
    this.props.completedAt = dateStr;
    this.props.updatedAt = dateStr;
  }

  public toJSON(): StockCountProps {
    return { ...this.props };
  }
}
