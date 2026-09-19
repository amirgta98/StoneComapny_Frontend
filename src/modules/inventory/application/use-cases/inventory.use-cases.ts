import { InventoryItem } from "../../domain/entities/inventory-item.entity";
import { WarehouseLocation } from "../../domain/entities/inventory-location.entity";
import { InventoryMovement } from "../../domain/entities/inventory-movement.entity";
import { StockReceipt } from "../../domain/entities/stock-receipt.entity";
import { StockIssue } from "../../domain/entities/stock-issue.entity";
import { StockReservation } from "../../domain/entities/stock-reservation.entity";
import { StockTransfer } from "../../domain/entities/stock-transfer.entity";
import { StockCount } from "../../domain/entities/stock-count.entity";
import { StockAdjustment } from "../../domain/entities/stock-adjustment.entity";
import {
  InsufficientStockError,
  InventoryItemNotFoundError,
  WarehouseLocationNotFoundError,
  InvalidTransferError,
} from "../../domain/errors/inventory.errors";
import type { InMemoryInventoryRepository } from "../../infrastructure/repositories/in-memory-inventory.repository";
import type {
  CreateReceiptInput,
  CreateIssueInput,
  TransferStockInput,
  ReserveStockInput,
  CreateStockAdjustmentInput,
  CreateLocationInput,
  CreateStockCountInput,
  CompleteStockCountInput,
} from "../dto/inventory.dto";
import type { InventoryFilters, MovementFilters } from "../../domain/repositories/inventory.repository.interface";

export class InventoryUseCases {
  constructor(private repo: InMemoryInventoryRepository) {}

  // ===================== DASHBOARD =====================

  async getDashboard(tenantId: string) {
    const { items } = await this.repo.findAllItems(tenantId, { limit: 1000 });
    const { movements } = await this.repo.findAllMovements(tenantId, { limit: 8 });
    const receipts = await this.repo.findAllReceipts(tenantId);
    const issues = await this.repo.findAllIssues(tenantId);
    const transfers = await this.repo.findAllTransfers(tenantId);
    const counts = await this.repo.findAllCounts(tenantId);

    let totalPhysicalStockSqm = 0;
    let totalReservedSqm = 0;
    let totalAvailableSqm = 0;
    let totalQualityCheckSqm = 0;
    let totalDamagedSqm = 0;
    let totalScrapSqm = 0;
    let totalValuation = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    items.forEach((item) => {
      totalPhysicalStockSqm += item.onHand;
      totalReservedSqm += item.reserved;
      totalAvailableSqm += item.available;
      totalQualityCheckSqm += item.qualityCheck;
      totalDamagedSqm += item.damaged;
      totalScrapSqm += item.scrap;
      totalValuation += item.valuation;

      if (item.isLowStock) lowStockCount++;
      if (item.isOutOfStock) outOfStockCount++;
    });

    return {
      metrics: {
        totalPhysicalStockSqm: Number(totalPhysicalStockSqm.toFixed(2)),
        totalReservedSqm: Number(totalReservedSqm.toFixed(2)),
        totalAvailableSqm: Number(totalAvailableSqm.toFixed(2)),
        totalQualityCheckSqm: Number(totalQualityCheckSqm.toFixed(2)),
        totalDamagedSqm: Number(totalDamagedSqm.toFixed(2)),
        totalScrapSqm: Number(totalScrapSqm.toFixed(2)),
        totalValuation,
        totalItemsCount: items.length,
        lowStockCount,
        outOfStockCount,
      },
      recentMovements: movements.slice(0, 6).map((m) => m.toJSON()),
      recentReceipts: receipts.slice(0, 4).map((r) => r.toJSON()),
      recentIssues: issues.slice(0, 4).map((i) => i.toJSON()),
      recentTransfers: transfers.slice(0, 4).map((t) => t.toJSON()),
      recentCounts: counts.slice(0, 3).map((c) => c.toJSON()),
    };
  }

  // ===================== INVENTORY ITEMS =====================

  async listItems(tenantId: string, filters?: InventoryFilters) {
    const { items, total } = await this.repo.findAllItems(tenantId, filters);
    return {
      items: items.map((i) => i.toJSON()),
      total,
      page: filters?.page || 1,
      limit: filters?.limit || 50,
    };
  }

  async getItemDetail(id: string, tenantId: string) {
    const item = await this.repo.findItemById(id, tenantId);
    if (!item) throw new InventoryItemNotFoundError(id);

    const movements = await this.repo.findMovementsByItem(id, tenantId);
    const reservations = (await this.repo.findAllReservations(tenantId)).filter(
      (r) => r.inventoryItemId === id && r.status === "ACTIVE"
    );

    return {
      item: item.toJSON(),
      movements: movements.map((m) => m.toJSON()),
      reservations: reservations.map((r) => r.toJSON()),
    };
  }

  // ===================== STOCK RECEIPTS =====================

  async createReceipt(tenantId: string, input: CreateReceiptInput, user = "مدیر کارخانه") {
    const now = new Date();
    const dateStr = now.toLocaleDateString("fa-IR");
    const receiptNumber = `REC-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const totalQuantity = input.items.reduce((sum, item) => sum + item.quantity, 0);

    const receipt = new StockReceipt({
      id: `rec-${Date.now()}`,
      tenantId,
      receiptNumber,
      source: input.source,
      supplierName: input.supplierName,
      status: "DRAFT",
      items: input.items.map((i, idx) => ({
        id: `ritem-${Date.now()}-${idx}`,
        ...i,
      })),
      totalQuantity,
      unit: input.unit,
      reference: input.reference,
      notes: input.notes,
      receivedBy: user,
      createdAt: dateStr,
      updatedAt: dateStr,
    });

    await this.repo.saveReceipt(receipt);
    return receipt.toJSON();
  }

  async confirmReceipt(receiptId: string, tenantId: string, user = "مدیر کارخانه") {
    const receipt = await this.repo.findReceiptById(receiptId, tenantId);
    if (!receipt) throw new Error(`رسید انبار با شناسه ${receiptId} یافت نشد.`);

    const now = new Date();
    const dateStr = `${now.toLocaleDateString("fa-IR")} ${now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}`;

    // Confirm state transition
    receipt.confirm(user, dateStr);

    // Apply inventory item changes and movements
    for (const rItem of receipt.items) {
      let targetItem: InventoryItem | null = null;

      if (rItem.inventoryItemId) {
        targetItem = await this.repo.findItemById(rItem.inventoryItemId, tenantId);
      }

      if (!targetItem) {
        // Find existing matching product at location
        const existingList = await this.repo.findItemsByProductId(rItem.productId, tenantId);
        targetItem = existingList.find((i) => i.locationId === rItem.locationId) || null;
      }

      if (targetItem) {
        targetItem.receiveStock(rItem.quantity, dateStr);
        await this.repo.saveItem(targetItem);
      } else {
        // Create new inventory item in catalog for this location
        targetItem = new InventoryItem({
          id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          tenantId,
          productId: rItem.productId,
          productName: rItem.productName,
          stoneType: rItem.stoneType,
          color: "طبیعی",
          finish: "ساب‌خورده",
          form: rItem.dimensions?.includes("×") ? "slab" : "tile",
          dimensions: rItem.dimensions || "طولی آزاد",
          thickness: rItem.thickness || 2,
          grade: rItem.grade || "درجه یک",
          unit: rItem.unit,
          onHand: rItem.quantity,
          reserved: 0,
          qualityCheck: 0,
          damaged: 0,
          scrap: 0,
          minThreshold: 100,
          locationId: rItem.locationId,
          locationCode: rItem.locationName.slice(0, 8),
          locationName: rItem.locationName,
          batchNumber: rItem.batchNumber,
          slabId: rItem.slabId,
          unitCost: rItem.unitCost || 0,
          unitPrice: (rItem.unitCost || 0) * 1.4,
          status: "AVAILABLE",
          lastMovementAt: dateStr,
          createdAt: dateStr,
          updatedAt: dateStr,
        });
        await this.repo.saveItem(targetItem);
      }

      // Record Kardex movement
      const movement = new InventoryMovement({
        id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        tenantId,
        inventoryItemId: targetItem.id,
        productName: targetItem.productName,
        type: "RECEIPT",
        quantity: rItem.quantity,
        unit: rItem.unit,
        destinationLocationId: rItem.locationId,
        destinationLocationName: rItem.locationName,
        referenceType: "RECEIPT",
        referenceId: receipt.id,
        referenceNumber: receipt.receiptNumber,
        balanceAfter: targetItem.onHand,
        reason: receipt.source === "PRODUCTION" ? "ورود از خط تولید کارخانه" : `خرید از ${receipt.supplierName || "تامین‌کننده"}`,
        performedBy: user,
        createdAt: dateStr,
      });

      await this.repo.createMovement(movement);
    }

    await this.repo.saveReceipt(receipt);
    return receipt.toJSON();
  }

  // ===================== STOCK ISSUES =====================

  async createIssue(tenantId: string, input: CreateIssueInput, user = "مدیر کارخانه") {
    const now = new Date();
    const dateStr = now.toLocaleDateString("fa-IR");
    const issueNumber = `ISS-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const totalQuantity = input.items.reduce((sum, item) => sum + item.quantity, 0);

    const issue = new StockIssue({
      id: `iss-${Date.now()}`,
      tenantId,
      issueNumber,
      reason: input.reason,
      orderId: input.orderId,
      customerName: input.customerName,
      status: "DRAFT",
      items: input.items.map((i, idx) => ({
        id: `iitem-${Date.now()}-${idx}`,
        ...i,
      })),
      totalQuantity,
      unit: input.unit,
      reference: input.reference,
      notes: input.notes,
      issuedBy: user,
      createdAt: dateStr,
      updatedAt: dateStr,
    });

    await this.repo.saveIssue(issue);
    return issue.toJSON();
  }

  async confirmIssue(issueId: string, tenantId: string, user = "مدیر کارخانه") {
    const issue = await this.repo.findIssueById(issueId, tenantId);
    if (!issue) throw new Error(`حواله خروج با شناسه ${issueId} یافت نشد.`);

    const now = new Date();
    const dateStr = `${now.toLocaleDateString("fa-IR")} ${now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}`;

    // Verify stock availability for all items before any deductions
    for (const item of issue.items) {
      const invItem = await this.repo.findItemById(item.inventoryItemId, tenantId);
      if (!invItem) throw new InventoryItemNotFoundError(item.inventoryItemId);
      if (invItem.onHand < item.quantity) {
        throw new InsufficientStockError(invItem.onHand, item.quantity, invItem.productName, invItem.unit);
      }
    }

    issue.confirm(user, dateStr);

    for (const item of issue.items) {
      const invItem = (await this.repo.findItemById(item.inventoryItemId, tenantId))!;
      invItem.issueStock(item.quantity, dateStr);
      await this.repo.saveItem(invItem);

      // Record Kardex movement
      const movement = new InventoryMovement({
        id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        tenantId,
        inventoryItemId: invItem.id,
        productName: invItem.productName,
        type: "ISSUE",
        quantity: item.quantity,
        unit: item.unit,
        sourceLocationId: item.locationId,
        sourceLocationName: item.locationName,
        referenceType: "ISSUE",
        referenceId: issue.id,
        referenceNumber: issue.issueNumber,
        balanceAfter: invItem.onHand,
        reason: issue.reason === "ORDER_FULFILLMENT" ? `ارسال سفارش مشتری (${issue.customerName || "سفارش آنلاین"})` : `خروج بابت ${issue.reason}`,
        performedBy: user,
        createdAt: dateStr,
      });

      await this.repo.createMovement(movement);
    }

    await this.repo.saveIssue(issue);
    return issue.toJSON();
  }

  // ===================== RESERVATIONS =====================

  async reserveStock(tenantId: string, input: ReserveStockInput, user = "سیستم فروش") {
    const invItem = await this.repo.findItemById(input.inventoryItemId, tenantId);
    if (!invItem) throw new InventoryItemNotFoundError(input.inventoryItemId);

    if (invItem.available < input.quantity) {
      throw new InsufficientStockError(invItem.available, input.quantity, invItem.productName, invItem.unit);
    }

    invItem.reserveStock(input.quantity);
    await this.repo.saveItem(invItem);

    const now = new Date();
    const dateStr = `${now.toLocaleDateString("fa-IR")} ${now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}`;
    const reservationNumber = `RES-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const reservation = new StockReservation({
      id: `res-${Date.now()}`,
      tenantId,
      reservationNumber,
      inventoryItemId: invItem.id,
      productId: invItem.productId,
      productName: invItem.productName,
      stoneType: invItem.stoneType,
      locationId: invItem.locationId,
      locationName: invItem.locationName,
      quantity: input.quantity,
      unit: invItem.unit,
      orderId: input.orderId,
      orderNumber: input.orderNumber,
      customerName: input.customerName,
      status: "ACTIVE",
      expiresAt: input.expiresAt,
      notes: input.notes,
      createdBy: user,
      createdAt: dateStr,
      updatedAt: dateStr,
    });

    await this.repo.saveReservation(reservation);

    // Record movement
    const movement = new InventoryMovement({
      id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tenantId,
      inventoryItemId: invItem.id,
      productName: invItem.productName,
      type: "RESERVATION_HOLD",
      quantity: input.quantity,
      unit: invItem.unit,
      referenceType: "ORDER",
      referenceId: input.orderId,
      referenceNumber: input.orderNumber || reservationNumber,
      balanceAfter: invItem.onHand,
      reason: `رزرو موقت جهت سفارش ${input.orderNumber || reservationNumber}`,
      performedBy: user,
      createdAt: dateStr,
    });

    await this.repo.createMovement(movement);
    return reservation.toJSON();
  }

  async releaseReservation(reservationId: string, tenantId: string, user = "مدیر کارخانه") {
    const reservation = await this.repo.findReservationById(reservationId, tenantId);
    if (!reservation) throw new Error(`رزرو با شناسه ${reservationId} یافت نشد.`);

    const invItem = await this.repo.findItemById(reservation.inventoryItemId, tenantId);
    if (invItem) {
      invItem.releaseReservation(reservation.quantity);
      await this.repo.saveItem(invItem);
    }

    reservation.release(user);
    await this.repo.saveReservation(reservation);

    const now = new Date();
    const dateStr = `${now.toLocaleDateString("fa-IR")} ${now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}`;

    if (invItem) {
      const movement = new InventoryMovement({
        id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        tenantId,
        inventoryItemId: invItem.id,
        productName: invItem.productName,
        type: "RESERVATION_RELEASE",
        quantity: reservation.quantity,
        unit: reservation.unit,
        referenceType: "ORDER",
        referenceId: reservation.orderId,
        referenceNumber: reservation.reservationNumber,
        balanceAfter: invItem.onHand,
        reason: `آزادسازی رزرو ${reservation.reservationNumber} و بازگشت به موجودی قابل فروش`,
        performedBy: user,
        createdAt: dateStr,
      });
      await this.repo.createMovement(movement);
    }

    return reservation.toJSON();
  }

  async consumeReservation(orderId: string, tenantId: string, user = "سیستم پرداخت") {
    const reservations = await this.repo.findReservationsByOrderId(orderId, tenantId);
    const now = new Date();
    const dateStr = `${now.toLocaleDateString("fa-IR")} ${now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}`;

    for (const res of reservations) {
      if (res.status === "ACTIVE") {
        const invItem = await this.repo.findItemById(res.inventoryItemId, tenantId);
        if (invItem) {
          invItem.consumeReservation(res.quantity, dateStr);
          await this.repo.saveItem(invItem);

          const movement = new InventoryMovement({
            id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            tenantId,
            inventoryItemId: invItem.id,
            productName: invItem.productName,
            type: "RESERVATION_CONSUME",
            quantity: res.quantity,
            unit: res.unit,
            referenceType: "ORDER",
            referenceId: orderId,
            referenceNumber: res.orderNumber,
            balanceAfter: invItem.onHand,
            reason: `تأیید پرداخت نهایی و خروج قطعی بار سفارش ${res.orderNumber || orderId}`,
            performedBy: user,
            createdAt: dateStr,
          });
          await this.repo.createMovement(movement);
        }

        res.consume(user);
        await this.repo.saveReservation(res);
      }
    }
  }

  // ===================== TRANSFERS =====================

  async transferStock(tenantId: string, input: TransferStockInput, user = "مدیر انبار") {
    if (input.sourceLocationId === input.destinationLocationId) {
      throw new InvalidTransferError("موقعیت مبدا و مقصد نمی‌تواند یکسان باشد.");
    }

    const item = await this.repo.findItemById(input.inventoryItemId, tenantId);
    if (!item) throw new InventoryItemNotFoundError(input.inventoryItemId);

    if (item.available < input.quantity) {
      throw new InsufficientStockError(item.available, input.quantity, item.productName, item.unit);
    }

    const sourceLoc = await this.repo.findLocationById(input.sourceLocationId, tenantId);
    if (!sourceLoc) throw new WarehouseLocationNotFoundError(input.sourceLocationId);

    const destLoc = await this.repo.findLocationById(input.destinationLocationId, tenantId);
    if (!destLoc) throw new WarehouseLocationNotFoundError(input.destinationLocationId);

    const now = new Date();
    const dateStr = `${now.toLocaleDateString("fa-IR")} ${now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}`;
    const transferNumber = `TRF-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Debit source
    item.issueStock(input.quantity, dateStr);
    await this.repo.saveItem(item);

    // Credit destination: find or create item at destination
    const existingAtDest = (await this.repo.findItemsByProductId(item.productId, tenantId)).find(
      (i) => i.locationId === destLoc.id
    );

    let destItem: InventoryItem;
    if (existingAtDest) {
      existingAtDest.receiveStock(input.quantity, dateStr);
      await this.repo.saveItem(existingAtDest);
      destItem = existingAtDest;
    } else {
      destItem = new InventoryItem({
        ...item.toJSON(),
        id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        locationId: destLoc.id,
        locationCode: destLoc.code,
        locationName: destLoc.name,
        onHand: input.quantity,
        reserved: 0,
        qualityCheck: 0,
        damaged: 0,
        scrap: 0,
        lastMovementAt: dateStr,
        createdAt: dateStr,
        updatedAt: dateStr,
      });
      await this.repo.saveItem(destItem);
    }

    // Update location usage
    sourceLoc.updateUsage(-input.quantity);
    destLoc.updateUsage(input.quantity);
    await this.repo.saveLocation(sourceLoc);
    await this.repo.saveLocation(destLoc);

    const transfer = new StockTransfer({
      id: `trf-${Date.now()}`,
      tenantId,
      transferNumber,
      inventoryItemId: item.id,
      productName: item.productName,
      stoneType: item.stoneType,
      sourceLocationId: sourceLoc.id,
      sourceLocationName: sourceLoc.name,
      destinationLocationId: destLoc.id,
      destinationLocationName: destLoc.name,
      quantity: input.quantity,
      unit: item.unit,
      status: "COMPLETED",
      reason: input.reason || "انتقال درون‌کارگاهی سنگ",
      transferredBy: user,
      completedAt: dateStr,
      createdAt: dateStr,
      updatedAt: dateStr,
    });

    await this.repo.saveTransfer(transfer);

    // Record source movement (TRANSFER_OUT)
    const movOut = new InventoryMovement({
      id: `mov-${Date.now()}-out`,
      tenantId,
      inventoryItemId: item.id,
      productName: item.productName,
      type: "TRANSFER_OUT",
      quantity: input.quantity,
      unit: item.unit,
      sourceLocationId: sourceLoc.id,
      sourceLocationName: sourceLoc.name,
      destinationLocationId: destLoc.id,
      destinationLocationName: destLoc.name,
      referenceType: "TRANSFER",
      referenceId: transfer.id,
      referenceNumber: transfer.transferNumber,
      balanceAfter: item.onHand,
      reason: `انتقال خروجی به ${destLoc.name}`,
      performedBy: user,
      createdAt: dateStr,
    });
    await this.repo.createMovement(movOut);

    // Record destination movement (TRANSFER_IN)
    const movIn = new InventoryMovement({
      id: `mov-${Date.now()}-in`,
      tenantId,
      inventoryItemId: destItem.id,
      productName: destItem.productName,
      type: "TRANSFER_IN",
      quantity: input.quantity,
      unit: destItem.unit,
      sourceLocationId: sourceLoc.id,
      sourceLocationName: sourceLoc.name,
      destinationLocationId: destLoc.id,
      destinationLocationName: destLoc.name,
      referenceType: "TRANSFER",
      referenceId: transfer.id,
      referenceNumber: transfer.transferNumber,
      balanceAfter: destItem.onHand,
      reason: `انتقال ورودی از ${sourceLoc.name}`,
      performedBy: user,
      createdAt: dateStr,
    });
    await this.repo.createMovement(movIn);

    return transfer.toJSON();
  }

  // ===================== STOCK COUNTS =====================

  async createStockCount(tenantId: string, input: CreateStockCountInput, user = "مدیر کارخانه") {
    const loc = await this.repo.findLocationById(input.locationId, tenantId);
    if (!loc) throw new WarehouseLocationNotFoundError(input.locationId);

    const { items: allItems } = await this.repo.findAllItems(tenantId, { limit: 1000 });
    const locItems = allItems.filter(
      (i) =>
        i.locationId === input.locationId &&
        (!input.itemIds || input.itemIds.includes(i.id))
    );

    const now = new Date();
    const dateStr = now.toLocaleDateString("fa-IR");
    const countNumber = `CNT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const count = new StockCount({
      id: `cnt-${Date.now()}`,
      tenantId,
      countNumber,
      title: input.title,
      locationId: loc.id,
      locationName: loc.name,
      status: "IN_PROGRESS",
      items: locItems.map((i, idx) => ({
        id: `citem-${Date.now()}-${idx}`,
        inventoryItemId: i.id,
        productName: i.productName,
        stoneType: i.stoneType,
        dimensions: i.dimensions,
        unit: i.unit,
        systemQuantity: i.onHand,
        physicalQuantity: i.onHand,
        discrepancyQuantity: 0,
      })),
      totalSystemQty: locItems.reduce((s, i) => s + i.onHand, 0),
      totalPhysicalQty: locItems.reduce((s, i) => s + i.onHand, 0),
      totalDiffQty: 0,
      countedBy: user,
      notes: input.notes,
      createdAt: dateStr,
      updatedAt: dateStr,
    });

    await this.repo.saveCount(count);
    return count.toJSON();
  }

  async completeStockCount(countId: string, tenantId: string, input: CompleteStockCountInput, user = "مدیر کارخانه") {
    const count = await this.repo.findCountById(countId, tenantId);
    if (!count) throw new Error(`انبارگردانی با شناسه ${countId} یافت نشد.`);

    const now = new Date();
    const dateStr = `${now.toLocaleDateString("fa-IR")} ${now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}`;

    const updatedItems = count.items.map((item) => {
      const match = input.items.find((i) => i.id === item.id || i.inventoryItemId === item.inventoryItemId);
      if (match) {
        const physical = match.physicalQuantity;
        return {
          ...item,
          physicalQuantity: physical,
          discrepancyQuantity: Number((physical - item.systemQuantity).toFixed(2)),
          notes: match.notes || item.notes,
        };
      }
      return item;
    });

    count.complete(updatedItems, dateStr);
    await this.repo.saveCount(count);

    // Automatically generate adjustments and audit movements for any discrepancies
    for (const item of updatedItems) {
      if (item.discrepancyQuantity !== 0) {
        const invItem = await this.repo.findItemById(item.inventoryItemId, tenantId);
        if (invItem) {
          invItem.adjustStock(item.discrepancyQuantity, "onHand", dateStr);
          await this.repo.saveItem(invItem);

          const isPositive = item.discrepancyQuantity > 0;
          const adjNumber = `ADJ-CNT-${Math.floor(1000 + Math.random() * 9000)}`;

          const adjustment = new StockAdjustment({
            id: `adj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            tenantId,
            adjustmentNumber: adjNumber,
            inventoryItemId: invItem.id,
            productName: invItem.productName,
            quantityChange: item.discrepancyQuantity,
            unit: invItem.unit,
            targetProperty: "onHand",
            reason: `تعدیل سیستمی ناشی از انبارگردانی ${count.countNumber}`,
            referenceType: "COUNT",
            referenceId: count.id,
            referenceNumber: count.countNumber,
            notes: item.notes,
            adjustedBy: user,
            createdAt: dateStr,
          });
          await this.repo.saveAdjustment(adjustment);

          const movement = new InventoryMovement({
            id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            tenantId,
            inventoryItemId: invItem.id,
            productName: invItem.productName,
            type: isPositive ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT",
            quantity: Math.abs(item.discrepancyQuantity),
            unit: invItem.unit,
            referenceType: "COUNT",
            referenceId: count.id,
            referenceNumber: count.countNumber,
            balanceAfter: invItem.onHand,
            reason: `تعدیل انبارگردانی (${isPositive ? "موجودی مازاد کشف شده" : "کسری فیزیکی"})`,
            performedBy: user,
            createdAt: dateStr,
          });
          await this.repo.createMovement(movement);
        }
      }
    }

    return count.toJSON();
  }

  // ===================== ADJUSTMENTS =====================

  async createAdjustment(tenantId: string, input: CreateStockAdjustmentInput, user = "مدیر کارخانه") {
    const invItem = await this.repo.findItemById(input.inventoryItemId, tenantId);
    if (!invItem) throw new InventoryItemNotFoundError(input.inventoryItemId);

    const now = new Date();
    const dateStr = `${now.toLocaleDateString("fa-IR")} ${now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}`;

    invItem.adjustStock(input.quantityChange, input.targetProperty, dateStr);
    await this.repo.saveItem(invItem);

    const adjustmentNumber = `ADJ-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const adjustment = new StockAdjustment({
      id: `adj-${Date.now()}`,
      tenantId,
      adjustmentNumber,
      inventoryItemId: invItem.id,
      productName: invItem.productName,
      quantityChange: input.quantityChange,
      unit: invItem.unit,
      targetProperty: input.targetProperty,
      reason: input.reason,
      referenceType: input.referenceType,
      referenceNumber: input.referenceNumber,
      notes: input.notes,
      adjustedBy: user,
      createdAt: dateStr,
    });

    await this.repo.saveAdjustment(adjustment);

    // Record movement if physical stock was touched
    if (input.targetProperty === "onHand") {
      const isPositive = input.quantityChange > 0;
      const movement = new InventoryMovement({
        id: `mov-${Date.now()}`,
        tenantId,
        inventoryItemId: invItem.id,
        productName: invItem.productName,
        type: isPositive ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT",
        quantity: Math.abs(input.quantityChange),
        unit: invItem.unit,
        referenceType: "ADJUSTMENT",
        referenceId: adjustment.id,
        referenceNumber: adjustment.adjustmentNumber,
        balanceAfter: invItem.onHand,
        reason: input.reason,
        performedBy: user,
        createdAt: dateStr,
      });
      await this.repo.createMovement(movement);
    }

    return adjustment.toJSON();
  }

  // ===================== LOCATIONS =====================

  async listLocations(tenantId: string) {
    const locations = await this.repo.findAllLocations(tenantId);
    return locations.map((l) => l.toJSON());
  }

  async createLocation(tenantId: string, input: CreateLocationInput) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("fa-IR");

    let parentName: string | undefined;
    if (input.parentId) {
      const parent = await this.repo.findLocationById(input.parentId, tenantId);
      parentName = parent?.name;
    }

    const loc = new WarehouseLocation({
      id: `loc-${Date.now()}`,
      tenantId,
      name: input.name,
      code: input.code.toUpperCase(),
      parentId: input.parentId,
      parentName,
      type: input.type,
      capacitySqm: input.capacitySqm,
      currentUsageSqm: 0,
      status: "ACTIVE",
      description: input.description,
      createdAt: dateStr,
      updatedAt: dateStr,
    });

    await this.repo.saveLocation(loc);
    return loc.toJSON();
  }

  async updateLocation(id: string, tenantId: string, updates: Partial<CreateLocationInput>) {
    const loc = await this.repo.findLocationById(id, tenantId);
    if (!loc) throw new WarehouseLocationNotFoundError(id);

    const now = new Date();
    const dateStr = now.toLocaleDateString("fa-IR");

    const updated = new WarehouseLocation({
      ...loc.toJSON(),
      ...updates,
      updatedAt: dateStr,
    });

    await this.repo.saveLocation(updated);
    return updated.toJSON();
  }

  async deleteLocation(id: string, tenantId: string) {
    // Check if location has items
    const { items } = await this.repo.findAllItems(tenantId, { locationId: id, limit: 10 });
    if (items.length > 0) {
      throw new Error(`امکان حذف موقعیت وجود ندارد؛ ${items.length} قلم کالا در این بخش ثبت شده است.`);
    }
    await this.repo.deleteLocation(id, tenantId);
    return { success: true };
  }

  // ===================== MOVEMENTS & KARDEX =====================

  async listMovements(tenantId: string, filters?: MovementFilters) {
    const { movements, total } = await this.repo.findAllMovements(tenantId, filters);
    return {
      movements: movements.map((m) => m.toJSON()),
      total,
      page: filters?.page || 1,
      limit: filters?.limit || 50,
    };
  }

  // ===================== ALERTS =====================

  async getAlerts(tenantId: string) {
    const { items } = await this.repo.findAllItems(tenantId, { limit: 1000 });
    const locations = await this.repo.findAllLocations(tenantId);

    const lowStockAlerts = items
      .filter((i) => i.isLowStock)
      .map((i) => ({
        id: `alt-low-${i.id}`,
        type: "LOW_STOCK",
        severity: "warning",
        title: `کسری موجودی سنگ: ${i.productName}`,
        message: `موجودی آزاد (${i.available} ${i.unit}) کمتر از حد آستانه مجاز (${i.minThreshold} ${i.unit}) است.`,
        itemId: i.id,
        locationName: i.locationName,
        createdAt: i.lastMovementAt,
      }));

    const outOfStockAlerts = items
      .filter((i) => i.isOutOfStock)
      .map((i) => ({
        id: `alt-out-${i.id}`,
        type: "OUT_OF_STOCK",
        severity: "critical",
        title: `اتمام موجودی قابل عرضه: ${i.productName}`,
        message: `موجودی قابل رزرو و فروش این سنگ به صفر رسیده است (کل دپو رزرو یا تخلیه شده).`,
        itemId: i.id,
        locationName: i.locationName,
        createdAt: i.lastMovementAt,
      }));

    const damagedAlerts = items
      .filter((i) => i.damaged > 0)
      .map((i) => ({
        id: `alt-dmg-${i.id}`,
        type: "DAMAGED_STOCK",
        severity: "info",
        title: `دپوی قطعات معیوب: ${i.productName}`,
        message: `مقدار ${i.damaged} ${i.unit} سنگ به عنوان معیوب ثبت گردیده و نیازمند تعیین تکلیف یا لاشه‌بری است.`,
        itemId: i.id,
        locationName: i.locationName,
        createdAt: i.lastMovementAt,
      }));

    const fullLocationAlerts = locations
      .filter((l) => l.status === "FULL" || (l.capacitySqm && l.currentUsageSqm >= l.capacitySqm * 0.95))
      .map((l) => ({
        id: `alt-loc-${l.id}`,
        type: "LOCATION_FULL",
        severity: "warning",
        title: `تکمیل ظرفیت دپو: ${l.name}`,
        message: `تراکم سنگ در این موقعیت به ۹۵٪ یا بالاتر از ظرفیت مجاز رسیده است.`,
        locationId: l.id,
        createdAt: l.updatedAt,
      }));

    return {
      alerts: [...outOfStockAlerts, ...lowStockAlerts, ...fullLocationAlerts, ...damagedAlerts],
      summary: {
        criticalCount: outOfStockAlerts.length,
        warningCount: lowStockAlerts.length + fullLocationAlerts.length,
        infoCount: damagedAlerts.length,
        total: outOfStockAlerts.length + lowStockAlerts.length + fullLocationAlerts.length + damagedAlerts.length,
      },
    };
  }

  // ===================== REPORTS =====================

  async getReports(tenantId: string) {
    const { items } = await this.repo.findAllItems(tenantId, { limit: 1000 });
    const locations = await this.repo.findAllLocations(tenantId);
    const { movements } = await this.repo.findAllMovements(tenantId, { limit: 1000 });

    // Valuation by Stone Type
    const valuationByType: Record<string, { sqm: number; valuation: number; count: number }> = {};
    items.forEach((item) => {
      const st = item.stoneType || "سایر";
      if (!valuationByType[st]) {
        valuationByType[st] = { sqm: 0, valuation: 0, count: 0 };
      }
      valuationByType[st].sqm += item.onHand;
      valuationByType[st].valuation += item.valuation;
      valuationByType[st].count += 1;
    });

    // Stock by Location
    const stockByLocation: Record<string, { name: string; type: string; totalSqm: number; itemsCount: number }> = {};
    items.forEach((item) => {
      if (!stockByLocation[item.locationId]) {
        stockByLocation[item.locationId] = {
          name: item.locationName,
          type: "موقعیت",
          totalSqm: 0,
          itemsCount: 0,
        };
      }
      stockByLocation[item.locationId].totalSqm += item.onHand;
      stockByLocation[item.locationId].itemsCount += 1;
    });

    // Movements summary
    let totalInflow = 0;
    let totalOutflow = 0;
    movements.forEach((m) => {
      if (m.isInward) totalInflow += m.quantity;
      if (m.isOutward) totalOutflow += m.quantity;
    });

    const totalValuation = items.reduce((s, i) => s + i.valuation, 0);
    const totalPhysicalSqm = items.reduce((s, i) => s + i.onHand, 0);

    return {
      summary: {
        totalPhysicalSqm: Number(totalPhysicalSqm.toFixed(2)),
        totalValuation,
        totalInflow: Number(totalInflow.toFixed(2)),
        totalOutflow: Number(totalOutflow.toFixed(2)),
        activeStockItemsCount: items.length,
        locationsCount: locations.length,
      },
      valuationByType: Object.entries(valuationByType).map(([type, data]) => ({
        type,
        sqm: Number(data.sqm.toFixed(2)),
        valuation: data.valuation,
        count: data.count,
      })),
      stockByLocation: Object.values(stockByLocation).map((loc) => ({
        ...loc,
        totalSqm: Number(loc.totalSqm.toFixed(2)),
      })),
    };
  }

  // ===================== LISTINGS FOR SUBROUTES =====================

  async listReceipts(tenantId: string) {
    const receipts = await this.repo.findAllReceipts(tenantId);
    return receipts.map((r) => r.toJSON());
  }

  async listIssues(tenantId: string) {
    const issues = await this.repo.findAllIssues(tenantId);
    return issues.map((i) => i.toJSON());
  }

  async listReservations(tenantId: string) {
    const reservations = await this.repo.findAllReservations(tenantId);
    return reservations.map((r) => r.toJSON());
  }

  async listTransfers(tenantId: string) {
    const transfers = await this.repo.findAllTransfers(tenantId);
    return transfers.map((t) => t.toJSON());
  }

  async listCounts(tenantId: string) {
    const counts = await this.repo.findAllCounts(tenantId);
    return counts.map((c) => c.toJSON());
  }

  async listAdjustments(tenantId: string) {
    const adjustments = await this.repo.findAllAdjustments(tenantId);
    return adjustments.map((a) => a.toJSON());
  }
}
