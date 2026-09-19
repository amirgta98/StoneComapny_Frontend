import type {
  InventoryItemStatus,
  LocationType,
  MovementType,
  ReceiptStatus,
  IssueStatus,
  TransferStatus,
  StockCountStatus,
  InventoryUnit,
} from "@/modules/inventory/domain/value-objects/inventory-status.vo";

export type {
  InventoryItemStatus,
  LocationType,
  MovementType,
  ReceiptStatus,
  IssueStatus,
  TransferStatus,
  StockCountStatus,
  InventoryUnit,
};

export interface InventoryItemDto {
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
  available: number;
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
  valuation: number;
  status: InventoryItemStatus;
  primaryImage?: string;
  notes?: string;
  lastMovementAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseLocationDto {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  parentId?: string;
  parentName?: string;
  type: LocationType;
  capacitySqm?: number;
  currentUsageSqm: number;
  status: "ACTIVE" | "INACTIVE" | "FULL";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovementDto {
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
  referenceType?: string;
  referenceId?: string;
  referenceNumber?: string;
  balanceAfter: number;
  reason?: string;
  performedBy: string;
  createdAt: string;
}

export interface StockReceiptItemDto {
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

export interface StockReceiptDto {
  id: string;
  tenantId: string;
  receiptNumber: string;
  source: "PRODUCTION" | "SUPPLIER" | "PURCHASE" | "RETURN" | "OTHER";
  supplierName?: string;
  status: ReceiptStatus;
  items: StockReceiptItemDto[];
  totalQuantity: number;
  unit: InventoryUnit;
  reference?: string;
  notes?: string;
  receivedBy: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockIssueItemDto {
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

export interface StockIssueDto {
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
  items: StockIssueItemDto[];
  totalQuantity: number;
  unit: InventoryUnit;
  reference?: string;
  notes?: string;
  issuedBy: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockReservationDto {
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

export interface StockTransferDto {
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

export interface StockCountItemDto {
  id: string;
  inventoryItemId: string;
  productName: string;
  stoneType: string;
  dimensions?: string;
  unit: InventoryUnit;
  systemQuantity: number;
  physicalQuantity: number;
  discrepancyQuantity: number;
  notes?: string;
}

export interface StockCountDto {
  id: string;
  tenantId: string;
  countNumber: string;
  title: string;
  locationId: string;
  locationName: string;
  status: StockCountStatus;
  items: StockCountItemDto[];
  totalSystemQty: number;
  totalPhysicalQty: number;
  totalDiffQty: number;
  countedBy: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockAdjustmentDto {
  id: string;
  tenantId: string;
  adjustmentNumber: string;
  inventoryItemId: string;
  productName: string;
  quantityChange: number;
  unit: InventoryUnit;
  targetProperty: "onHand" | "damaged" | "qualityCheck" | "scrap";
  reason: string;
  referenceType?: string;
  referenceNumber?: string;
  notes?: string;
  adjustedBy: string;
  createdAt: string;
}

export interface InventoryDashboardData {
  metrics: {
    totalPhysicalStockSqm: number;
    totalReservedSqm: number;
    totalAvailableSqm: number;
    totalQualityCheckSqm: number;
    totalDamagedSqm: number;
    totalScrapSqm: number;
    totalValuation: number;
    totalItemsCount: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  recentMovements: InventoryMovementDto[];
  recentReceipts: StockReceiptDto[];
  recentIssues: StockIssueDto[];
  recentTransfers: StockTransferDto[];
  recentCounts: StockCountDto[];
}

export interface InventoryAlertDto {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  itemId?: string;
  locationId?: string;
  locationName?: string;
  createdAt: string;
}

export interface InventoryReportsData {
  summary: {
    totalPhysicalSqm: number;
    totalValuation: number;
    totalInflow: number;
    totalOutflow: number;
    activeStockItemsCount: number;
    locationsCount: number;
  };
  valuationByType: {
    type: string;
    sqm: number;
    valuation: number;
    count: number;
  }[];
  stockByLocation: {
    name: string;
    type: string;
    totalSqm: number;
    itemsCount: number;
  }[];
}
