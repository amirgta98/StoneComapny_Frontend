import type { LocationType } from "../value-objects/inventory-status.vo";

export interface WarehouseLocationProps {
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

export class WarehouseLocation {
  constructor(private props: WarehouseLocationProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get code(): string { return this.props.code; }
  get parentId(): string | undefined { return this.props.parentId; }
  get parentName(): string | undefined { return this.props.parentName; }
  get type(): LocationType { return this.props.type; }
  get capacitySqm(): number | undefined { return this.props.capacitySqm; }
  get currentUsageSqm(): number { return this.props.currentUsageSqm; }
  get status(): "ACTIVE" | "INACTIVE" | "FULL" { return this.props.status; }
  get description(): string | undefined { return this.props.description; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  public updateUsage(diffSqm: number): void {
    this.props.currentUsageSqm = Math.max(0, this.props.currentUsageSqm + diffSqm);
    if (this.props.capacitySqm && this.props.currentUsageSqm >= this.props.capacitySqm) {
      this.props.status = "FULL";
    } else if (this.props.status === "FULL") {
      this.props.status = "ACTIVE";
    }
  }

  public toJSON(): WarehouseLocationProps {
    return { ...this.props };
  }
}
