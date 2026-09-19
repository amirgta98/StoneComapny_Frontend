import { z } from "zod";

export const tenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  domain: z.string().optional(),
  subdomain: z.string().optional(),
  status: z.enum(["active", "suspended", "pending", "deleted"]).default("pending"),
});

export type TenantFormValues = z.infer<typeof tenantSchema>;