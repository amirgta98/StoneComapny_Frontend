import { InventoryItem } from "../../domain/entities/inventory-item.entity";
import { WarehouseLocation } from "../../domain/entities/inventory-location.entity";
import { InventoryMovement } from "../../domain/entities/inventory-movement.entity";
import { StockReceipt } from "../../domain/entities/stock-receipt.entity";
import { StockIssue } from "../../domain/entities/stock-issue.entity";
import { StockReservation } from "../../domain/entities/stock-reservation.entity";
import { StockTransfer } from "../../domain/entities/stock-transfer.entity";
import { StockCount } from "../../domain/entities/stock-count.entity";
import { StockAdjustment } from "../../domain/entities/stock-adjustment.entity";
import type {
  IInventoryRepository,
  IInventoryLocationRepository,
  IInventoryMovementRepository,
  IStockReceiptRepository,
  IStockIssueRepository,
  IStockReservationRepository,
  IStockTransferRepository,
  IStockCountRepository,
  IStockAdjustmentRepository,
  InventoryFilters,
  MovementFilters,
} from "../../domain/repositories/inventory.repository.interface";
import {
  createPreSeededLocations,
  createPreSeededInventoryItems,
  createPreSeededMovements,
  createPreSeededReceipts,
  createPreSeededIssues,
  createPreSeededReservations,
  createPreSeededTransfers,
  createPreSeededCounts,
  createPreSeededAdjustments,
} from "./pre-seeded-inventory";

/**
 * In-Memory Transaction-Safe Inventory Repository implementation.
 * Provides multi-tenant isolation, thread-safe memory state, and atomic mutations.
 */
export class InMemoryInventoryRepository
  implements
    IInventoryRepository,
    IInventoryLocationRepository,
    IInventoryMovementRepository,
    IStockReceiptRepository,
    IStockIssueRepository,
    IStockReservationRepository,
    IStockTransferRepository,
    IStockCountRepository,
    IStockAdjustmentRepository
{
  private static instance: InMemoryInventoryRepository | null = null;

  private items: Map<string, InventoryItem> = new Map();
  private locations: Map<string, WarehouseLocation> = new Map();
  private movements: Map<string, InventoryMovement> = new Map();
  private receipts: Map<string, StockReceipt> = new Map();
  private issues: Map<string, StockIssue> = new Map();
  private reservations: Map<string, StockReservation> = new Map();
  private transfers: Map<string, StockTransfer> = new Map();
  private counts: Map<string, StockCount> = new Map();
  private adjustments: Map<string, StockAdjustment> = new Map();

  private initializedTenants: Set<string> = new Set();

  private constructor() {
    this.seedTenant("tenant-001");
  }

  public static getInstance(): InMemoryInventoryRepository {
    if (!InMemoryInventoryRepository.instance) {
      InMemoryInventoryRepository.instance = new InMemoryInventoryRepository();
    }
    return InMemoryInventoryRepository.instance;
  }

  private seedTenant(tenantId: string): void {
    if (this.initializedTenants.has(tenantId)) return;

    createPreSeededLocations(tenantId).forEach((l) => this.locations.set(l.id, l));
    createPreSeededInventoryItems(tenantId).forEach((i) => this.items.set(i.id, i));
    createPreSeededMovements(tenantId).forEach((m) => this.movements.set(m.id, m));
    createPreSeededReceipts(tenantId).forEach((r) => this.receipts.set(r.id, r));
    createPreSeededIssues(tenantId).forEach((iss) => this.issues.set(iss.id, iss));
    createPreSeededReservations(tenantId).forEach((res) => this.reservations.set(res.id, res));
    createPreSeededTransfers(tenantId).forEach((t) => this.transfers.set(t.id, t));
    createPreSeededCounts(tenantId).forEach((c) => this.counts.set(c.id, c));
    createPreSeededAdjustments(tenantId).forEach((a) => this.adjustments.set(a.id, a));

    this.initializedTenants.add(tenantId);
  }

  private ensureTenant(tenantId: string): void {
    if (!this.initializedTenants.has(tenantId)) {
      this.seedTenant(tenantId);
    }
  }

  // ===================== INVENTORY ITEMS =====================

  async findItemById(id: string, tenantId: string): Promise<InventoryItem | null> {
    this.ensureTenant(tenantId);
    const item = this.items.get(id);
    if (!item || (item.tenantId !== tenantId && tenantId !== "SUPER_ADMIN")) {
      return null;
    }
    return item;
  }

  async findItemsByProductId(productId: string, tenantId: string): Promise<InventoryItem[]> {
    this.ensureTenant(tenantId);
    return Array.from(this.items.values()).filter(
      (i) =>
        i.productId === productId &&
        (i.tenantId === tenantId || tenantId === "SUPER_ADMIN")
    );
  }

  async findAllItems(
    tenantId: string,
    filters?: InventoryFilters
  ): Promise<{ items: InventoryItem[]; total: number }> {
    this.ensureTenant(tenantId);
    let list = Array.from(this.items.values()).filter(
      (i) => i.tenantId === tenantId || tenantId === "SUPER_ADMIN"
    );

    if (filters?.query?.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.productName.toLowerCase().includes(q) ||
          i.stoneType.toLowerCase().includes(q) ||
          i.locationName.toLowerCase().includes(q) ||
          i.batchNumber?.toLowerCase().includes(q) ||
          i.slabId?.toLowerCase().includes(q)
      );
    }

    if (filters?.stoneType && filters.stoneType !== "all") {
      list = list.filter((i) => i.stoneType === filters.stoneType);
    }

    if (filters?.color && filters.color !== "all") {
      list = list.filter((i) => i.color === filters.color);
    }

    if (filters?.form && filters.form !== "all") {
      list = list.filter((i) => i.form === filters.form);
    }

    if (filters?.unit && filters.unit !== "all") {
      list = list.filter((i) => i.unit === filters.unit);
    }

    if (filters?.locationId && filters.locationId !== "all") {
      list = list.filter((i) => i.locationId === filters.locationId);
    }

    if (filters?.status && filters.status !== "all") {
      list = list.filter((i) => i.status === filters.status);
    }

    if (filters?.lowStockOnly) {
      list = list.filter((i) => i.isLowStock);
    }

    if (filters?.outOfStockOnly) {
      list = list.filter((i) => i.isOutOfStock);
    }

    const total = list.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return { items: paginated, total };
  }

  async saveItem(item: InventoryItem): Promise<void> {
    this.items.set(item.id, item);
  }

  async deleteItem(id: string, tenantId: string): Promise<void> {
    const item = await this.findItemById(id, tenantId);
    if (item) {
      this.items.delete(id);
    }
  }

  // ===================== LOCATIONS =====================

  async findLocationById(id: string, tenantId: string): Promise<WarehouseLocation | null> {
    this.ensureTenant(tenantId);
    const loc = this.locations.get(id);
    if (!loc || (loc.tenantId !== tenantId && tenantId !== "SUPER_ADMIN")) {
      return null;
    }
    return loc;
  }

  async findAllLocations(tenantId: string): Promise<WarehouseLocation[]> {
    this.ensureTenant(tenantId);
    return Array.from(this.locations.values()).filter(
      (l) => l.tenantId === tenantId || tenantId === "SUPER_ADMIN"
    );
  }

  async saveLocation(location: WarehouseLocation): Promise<void> {
    this.locations.set(location.id, location);
  }

  async deleteLocation(id: string, tenantId: string): Promise<void> {
    const loc = await this.findLocationById(id, tenantId);
    if (loc) {
      this.locations.delete(id);
    }
  }

  // ===================== MOVEMENTS =====================

  async createMovement(movement: InventoryMovement): Promise<void> {
    this.movements.set(movement.id, movement);
  }

  async findAllMovements(
    tenantId: string,
    filters?: MovementFilters
  ): Promise<{ movements: InventoryMovement[]; total: number }> {
    this.ensureTenant(tenantId);
    let list = Array.from(this.movements.values()).filter(
      (m) => m.tenantId === tenantId || tenantId === "SUPER_ADMIN"
    );

    if (filters?.inventoryItemId) {
      list = list.filter((m) => m.inventoryItemId === filters.inventoryItemId);
    }

    if (filters?.type) {
      list = list.filter((m) => m.type === filters.type);
    }

    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const total = list.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const start = (page - 1) * limit;

    return { movements: list.slice(start, start + limit), total };
  }

  async findMovementsByItem(itemId: string, tenantId: string): Promise<InventoryMovement[]> {
    this.ensureTenant(tenantId);
    return Array.from(this.movements.values())
      .filter(
        (m) =>
          m.inventoryItemId === itemId &&
          (m.tenantId === tenantId || tenantId === "SUPER_ADMIN")
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // ===================== RECEIPTS =====================

  async findReceiptById(id: string, tenantId: string): Promise<StockReceipt | null> {
    this.ensureTenant(tenantId);
    const r = this.receipts.get(id);
    if (!r || (r.tenantId !== tenantId && tenantId !== "SUPER_ADMIN")) return null;
    return r;
  }

  async findAllReceipts(tenantId: string): Promise<StockReceipt[]> {
    this.ensureTenant(tenantId);
    return Array.from(this.receipts.values())
      .filter((r) => r.tenantId === tenantId || tenantId === "SUPER_ADMIN")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async saveReceipt(receipt: StockReceipt): Promise<void> {
    this.receipts.set(receipt.id, receipt);
  }

  // ===================== ISSUES =====================

  async findIssueById(id: string, tenantId: string): Promise<StockIssue | null> {
    this.ensureTenant(tenantId);
    const iss = this.issues.get(id);
    if (!iss || (iss.tenantId !== tenantId && tenantId !== "SUPER_ADMIN")) return null;
    return iss;
  }

  async findAllIssues(tenantId: string): Promise<StockIssue[]> {
    this.ensureTenant(tenantId);
    return Array.from(this.issues.values())
      .filter((iss) => iss.tenantId === tenantId || tenantId === "SUPER_ADMIN")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async saveIssue(issue: StockIssue): Promise<void> {
    this.issues.set(issue.id, issue);
  }

  // ===================== RESERVATIONS =====================

  async findReservationById(id: string, tenantId: string): Promise<StockReservation | null> {
    this.ensureTenant(tenantId);
    const res = this.reservations.get(id);
    if (!res || (res.tenantId !== tenantId && tenantId !== "SUPER_ADMIN")) return null;
    return res;
  }

  async findReservationsByOrderId(orderId: string, tenantId: string): Promise<StockReservation[]> {
    this.ensureTenant(tenantId);
    return Array.from(this.reservations.values()).filter(
      (r) =>
        r.orderId === orderId &&
        (r.tenantId === tenantId || tenantId === "SUPER_ADMIN")
    );
  }

  async findAllReservations(tenantId: string): Promise<StockReservation[]> {
    this.ensureTenant(tenantId);
    return Array.from(this.reservations.values())
      .filter((r) => r.tenantId === tenantId || tenantId === "SUPER_ADMIN")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async saveReservation(reservation: StockReservation): Promise<void> {
    this.reservations.set(reservation.id, reservation);
  }

  // ===================== TRANSFERS =====================

  async findTransferById(id: string, tenantId: string): Promise<StockTransfer | null> {
    this.ensureTenant(tenantId);
    const t = this.transfers.get(id);
    if (!t || (t.tenantId !== tenantId && tenantId !== "SUPER_ADMIN")) return null;
    return t;
  }

  async findAllTransfers(tenantId: string): Promise<StockTransfer[]> {
    this.ensureTenant(tenantId);
    return Array.from(this.transfers.values())
      .filter((t) => t.tenantId === tenantId || tenantId === "SUPER_ADMIN")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async saveTransfer(transfer: StockTransfer): Promise<void> {
    this.transfers.set(transfer.id, transfer);
  }

  // ===================== COUNTS =====================

  async findCountById(id: string, tenantId: string): Promise<StockCount | null> {
    this.ensureTenant(tenantId);
    const c = this.counts.get(id);
    if (!c || (c.tenantId !== tenantId && tenantId !== "SUPER_ADMIN")) return null;
    return c;
  }

  async findAllCounts(tenantId: string): Promise<StockCount[]> {
    this.ensureTenant(tenantId);
    return Array.from(this.counts.values())
      .filter((c) => c.tenantId === tenantId || tenantId === "SUPER_ADMIN")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async saveCount(count: StockCount): Promise<void> {
    this.counts.set(count.id, count);
  }

  // ===================== ADJUSTMENTS =====================

  async findAdjustmentById(id: string, tenantId: string): Promise<StockAdjustment | null> {
    this.ensureTenant(tenantId);
    const a = this.adjustments.get(id);
    if (!a || (a.tenantId !== tenantId && tenantId !== "SUPER_ADMIN")) return null;
    return a;
  }

  async findAllAdjustments(tenantId: string): Promise<StockAdjustment[]> {
    this.ensureTenant(tenantId);
    return Array.from(this.adjustments.values())
      .filter((a) => a.tenantId === tenantId || tenantId === "SUPER_ADMIN")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async saveAdjustment(adjustment: StockAdjustment): Promise<void> {
    this.adjustments.set(adjustment.id, adjustment);
  }
}
