"use client";

import { CompanyBrandingForm } from "@/features/admin/components/company-branding-form";
import { siteConfig } from "@/config";

export default function TenantNewPage() {
  const handleSave = (data: { name: string; logo?: string; slogan: string }) => {
    // TODO: Send to backend API to create new tenant
    console.log("Creating new tenant with data:", data);
  };

  return (
    <CompanyBrandingForm
      initialData={{
        name: siteConfig.name,
        slogan: siteConfig.description,
      }}
      onSave={handleSave}
    />
  );
}
