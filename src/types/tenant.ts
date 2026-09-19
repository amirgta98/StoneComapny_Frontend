export type TenantStatus = "active" | "suspended" | "pending" | "deleted";

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  subdomain?: string;
  logo?: string;
  favicon?: string;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
};

export type TenantContext = {
  tenantId: string;
  slug: string;
  domain?: string;
};