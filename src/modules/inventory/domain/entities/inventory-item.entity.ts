import type {
  InventoryItemStatus,
  InventoryUnit,
} from "../value-objects/inventory-status.vo";

export interface InventoryItemProps {
  id: string;
  tenantId: string;
  productId: string;
  variantId?: string;
  productName: string;
  stoneType: string;
  color: string;
  finish: string;
  form: string;
  dimensions: string;
  thickness: number;
  grade?: string;
  unit: InventoryUnit;
  onHand: number;
  reserved: number;
  qualityCheck: number;
  damaged: number;
  scrap: number;
  minThreshold: number;
  locationId: string;
  locationCode: string;
  locationName: string;
  batchNumber?: string;
  slabId?: string;
  unitCost: number;
  unitPrice: number;
  status: InventoryItemStatus;
  primaryImage?: string;
  notes?: string;
  lastMovementAt: string;
  createdAt: string;
  updatedAt: string;
}

export class InventoryItem {
  constructor(private props: InventoryItemProps) {
    this.recalculateAvailable();
  }

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get productId(): string { return this.props.productId; }
  get variantId(): string | undefined { return this.props.variantId; }
  get productName(): string { return this.props.productName; }
  get stoneType(): string { return this.props.stoneType; }
  get color(): string { return this.props.color; }
  get finish(): string { return this.props.finish; }
  get form(): string { return this.props.form; }
  get dimensions(): string { return this.props.dimensions; }
  get thickness(): number { return this.props.thickness; }
  get grade(): string | undefined { return this.props.grade; }
  get unit(): InventoryUnit { return this.props.unit; }
  get onHand(): number { return this.props.onHand; }
  get reserved(): number { return this.props.reserved; }
  get available(): number {
    return Math.max(0, this.props.onHand - this.props.reserved);
  }
  get qualityCheck(): number { return this.props.qualityCheck; }
  get damaged(): number { return this.props.damaged; }
  get scrap(): number { return this.props.scrap; }
  get minThreshold(): number { return this.props.minThreshold; }
  get locationId(): string { return this.props.locationId; }
  get locationCode(): string { return this.props.locationCode; }
  get locationName(): string { return this.props.locationName; }
  get batchNumber(): string | undefined { return this.props.batchNumber; }
  get slabId(): string | undefined { return this.props.slabId; }
  get unitCost(): number { return this.props.unitCost; }
  get unitPrice(): number { return this.props.unitPrice; }
  get status(): InventoryItemStatus { return this.props.status; }
  get primaryImage(): string | undefined { return this.props.primaryImage; }
  get notes(): string | undefined { return this.props.notes; }
  get lastMovementAt(): string { return this.props.lastMovementAt; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  get isLowStock(): boolean {
    return this.available <= this.props.minThreshold && this.available > 0;
  }

  get isOutOfStock(): boolean {
    return this.available <= 0;
  }

  get valuation(): number {
    return Math.round(this.props.onHand * this.props.unitCost);
  }

  private recalculateAvailable(): void {
    if (this.props.reserved > this.props.onHand) {
      // over-reservation warning state, but strictly cap
    }
  }

  /**
   * Domain behavior: Increase physical stock on receipt or inward adjustment
   */
  public receiveStock(quantity: number, dateStr = new Date().toISOString()): void {
    if (quantity <= 0) throw new Error("مقدار ورودی باید مثبت باشد.");
    this.props.onHand += quantity;
    this.props.lastMovementAt = dateStr;
    this.props.updatedAt = dateStr;
  }

  /**
   * Domain behavior: Deduct stock on issue
   */
  public issueStock(quantity: number, dateStr = new Date().toISOString()): void {
    if (quantity <= 0) throw new Error("مقدار خروجی باید مثبت باشد.");
    if (this.props.onHand < quantity) {
      throw new Error(`موجودی فیزیکی کل کافی نیست. موجودی: ${this.props.onHand}، خروج: ${quantity}`);
    }
    this.props.onHand -= quantity;
    this.props.lastMovementAt = dateStr;
    this.props.updatedAt = dateStr;
  }

  /**
   * Domain behavior: Reserve stock
   */
  public reserveStock(quantity: number): void {
    if (quantity <= 0) throw new Error("مقدار رزرو باید مثبت باشد.");
    if (this.available < quantity) {
      throw new Error(`موجودی قابل دسترس کافی نیست. در دسترس: ${this.available}، رزرو: ${quantity}`);
    }
    this.props.reserved += quantity;
    this.props.updatedAt = new Date().toISOString();
  }

  /**
   * Domain behavior: Release previously held reservation
   */
  public releaseReservation(quantity: number): void {
    if (quantity <= 0) throw new Error("مقدار آزادسازی باید مثبت باشد.");
    this.props.reserved = Math.max(0, this.props.reserved - quantity);
    this.props.updatedAt = new Date().toISOString();
  }

  /**
   * Domain behavior: Consume reservation (turns reserved into issued)
   */
  public consumeReservation(quantity: number, dateStr = new Date().toISOString()): void {
    this.releaseReservation(quantity);
    this.issueStock(quantity, dateStr);
  }

  /**
   * Domain behavior: Adjust stock to match physical count or audit
   */
  public adjustStock(
    diffQuantity: number,
    type: "onHand" | "damaged" | "qualityCheck" | "scrap",
    dateStr = new Date().toISOString()
  ): void {
    if (type === "onHand") {
      const newOnHand = this.props.onHand + diffQuantity;
      if (newOnHand < 0) {
        throw new Error(`تعدیل غیرمجاز: موجودی فیزیکی نمی‌تواند منفی شود (نتیجه: ${newOnHand})`);
      }
      this.props.onHand = newOnHand;
    } else if (type === "damaged") {
      this.props.damaged = Math.max(0, this.props.damaged + diffQuantity);
    } else if (type === "qualityCheck") {
      this.props.qualityCheck = Math.max(0, this.props.qualityCheck + diffQuantity);
    } else if (type === "scrap") {
      this.props.scrap = Math.max(0, this.props.scrap + diffQuantity);
    }
    this.props.lastMovementAt = dateStr;
    this.props.updatedAt = dateStr;
  }

  public toJSON(): InventoryItemProps & { available: number; valuation: number } {
    return {
      ...this.props,
      available: this.available,
      valuation: this.valuation,
    };
  }
}
