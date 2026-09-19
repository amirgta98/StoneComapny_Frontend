import type { InventoryItem } from "../entities/inventory-item.entity";
import type { WarehouseLocation } from "../entities/inventory-location.entity";
import type { InventoryMovement } from "../entities/inventory-movement.entity";
import type { StockReceipt } from "../entities/stock-receipt.entity";
import type { StockIssue } from "../entities/stock-issue.entity";
import type { StockReservation } from "../entities/stock-reservation.entity";
import type { StockTransfer } from "../entities/stock-transfer.entity";
import type { StockCount } from "../entities/stock-count.entity";
import type { StockAdjustment } from "../entities/stock-adjustment.entity";
import type { InventoryItemStatus, InventoryUnit, MovementType } from "../value-objects/inventory-status.vo";

export interface InventoryFilters {
  query?: string;
  stoneType?: string;
  color?: string;
  form?: string;
  unit?: InventoryUnit | "all";
  locationId?: string;
  batchNumber?: string;
  status?: InventoryItemStatus | "all";
  lowStockOnly?: boolean;
  outOfStockOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface MovementFilters {
  inventoryItemId?: string;
  type?: MovementType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface IInventoryRepository {
  findItemById(id: string, tenantId: string): Promise<InventoryItem | null>;
  findItemsByProductId(productId: string, tenantId: string): Promise<InventoryItem[]>;
  findAllItems(tenantId: string, filters?: InventoryFilters): Promise<{ items: InventoryItem[]; total: number }>;
  saveItem(item: InventoryItem): Promise<void>;
  deleteItem(id: string, tenantId: string): Promise<void>;
}

export interface IInventoryLocationRepository {
  findLocationById(id: string, tenantId: string): Promise<WarehouseLocation | null>;
  findAllLocations(tenantId: string): Promise<WarehouseLocation[]>;
  saveLocation(location: WarehouseLocation): Promise<void>;
  deleteLocation(id: string, tenantId: string): Promise<void>;
}

export interface IInventoryMovementRepository {
  createMovement(movement: InventoryMovement): Promise<void>;
  findAllMovements(tenantId: string, filters?: MovementFilters): Promise<{ movements: InventoryMovement[]; total: number }>;
  findMovementsByItem(itemId: string, tenantId: string): Promise<InventoryMovement[]>;
}

export interface IStockReceiptRepository {
  findReceiptById(id: string, tenantId: string): Promise<StockReceipt | null>;
  findAllReceipts(tenantId: string): Promise<StockReceipt[]>;
  saveReceipt(receipt: StockReceipt): Promise<void>;
}

export interface IStockIssueRepository {
  findIssueById(id: string, tenantId: string): Promise<StockIssue | null>;
  findAllIssues(tenantId: string): Promise<StockIssue[]>;
  saveIssue(issue: StockIssue): Promise<void>;
}

export interface IStockReservationRepository {
  findReservationById(id: string, tenantId: string): Promise<StockReservation | null>;
  findReservationsByOrderId(orderId: string, tenantId: string): Promise<StockReservation[]>;
  findAllReservations(tenantId: string): Promise<StockReservation[]>;
  saveReservation(reservation: StockReservation): Promise<void>;
}

export interface IStockTransferRepository {
  findTransferById(id: string, tenantId: string): Promise<StockTransfer | null>;
  findAllTransfers(tenantId: string): Promise<StockTransfer[]>;
  saveTransfer(transfer: StockTransfer): Promise<void>;
}

export interface IStockCountRepository {
  findCountById(id: string, tenantId: string): Promise<StockCount | null>;
  findAllCounts(tenantId: string): Promise<StockCount[]>;
  saveCount(count: StockCount): Promise<void>;
}

export interface IStockAdjustmentRepository {
  findAdjustmentById(id: string, tenantId: string): Promise<StockAdjustment | null>;
  findAllAdjustments(tenantId: string): Promise<StockAdjustment[]>;
  saveAdjustment(adjustment: StockAdjustment): Promise<void>;
}
