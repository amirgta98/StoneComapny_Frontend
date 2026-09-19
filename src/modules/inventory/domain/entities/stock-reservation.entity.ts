import type { InventoryUnit } from "../value-objects/inventory-status.vo";

export interface StockReservationProps {
  id: string;
  tenantId: string;
  reservationNumber: string;
  inventoryItemId: string;
  productId: string;
  productName: string;
  stoneType: string;
  locationId: string;
  locationName: string;
  quantity: number;
  unit: InventoryUnit;
  orderId?: string;
  orderNumber?: string;
  customerName?: string;
  status: "ACTIVE" | "CONSUMED" | "RELEASED";
  expiresAt?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export class StockReservation {
  constructor(private props: StockReservationProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get reservationNumber(): string { return this.props.reservationNumber; }
  get inventoryItemId(): string { return this.props.inventoryItemId; }
  get productId(): string { return this.props.productId; }
  get productName(): string { return this.props.productName; }
  get stoneType(): string { return this.props.stoneType; }
  get locationId(): string { return this.props.locationId; }
  get locationName(): string { return this.props.locationName; }
  get quantity(): number { return this.props.quantity; }
  get unit(): InventoryUnit { return this.props.unit; }
  get orderId(): string | undefined { return this.props.orderId; }
  get orderNumber(): string | undefined { return this.props.orderNumber; }
  get customerName(): string | undefined { return this.props.customerName; }
  get status(): "ACTIVE" | "CONSUMED" | "RELEASED" { return this.props.status; }
  get expiresAt(): string | undefined { return this.props.expiresAt; }
  get notes(): string | undefined { return this.props.notes; }
  get createdBy(): string { return this.props.createdBy; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  public release(releasedBy: string): void {
    if (this.props.status !== "ACTIVE") {
      throw new Error(`رزرو قبلاً در وضعیت ${this.props.status} قرار گرفته است.`);
    }
    this.props.status = "RELEASED";
    this.props.updatedAt = new Date().toISOString();
  }

  public consume(consumedBy: string): void {
    if (this.props.status !== "ACTIVE") {
      throw new Error(`فقط رزرو فعال قابل مصرف است (وضعیت فعلی: ${this.props.status})`);
    }
    this.props.status = "CONSUMED";
    this.props.updatedAt = new Date().toISOString();
  }

  public toJSON(): StockReservationProps {
    return { ...this.props };
  }
}
