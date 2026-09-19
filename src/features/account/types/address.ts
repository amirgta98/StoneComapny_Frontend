export type DeliveryAccessType = "curbside" | "crane" | "forklift";

export interface CustomerAddress {
  id: string;
  userId: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  province: string;
  city: string;
  address: string;
  plaque: string;
  unit?: string;
  postalCode: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  // Natural stone site logistics attributes
  floor?: string;
  hasFreightElevator?: boolean;
  craneAccess?: boolean;
  deliveryType?: DeliveryAccessType;
  createdAt?: string;
  updatedAt?: string;
}

export type AddressCardMode = "account" | "checkout" | "readonly";
