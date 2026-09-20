"use client";

import { Suspense } from "react";
import { withAuthGuard } from "@/auth";
import { ThemeManagerView } from "@/features/theme/components";

/**
 * /dashboard/theme — Stone Factory Manager Portal Theme & Visual Identity Settings.
 *
 * Provides live theme customization, interactive real-time preview isolated via CSS variables,
 * preset & custom geometric controls, and persistent synchronization with Tenant Theme API.
 */
function ThemeSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground animate-pulse" dir="rtl">
          در حال بارگذاری بخش تنظیمات قالب و هویت بصری کارخانه...
        </div>
      }
    >
      <ThemeManagerView />
    </Suspense>
  );
}

export const GuardedThemeSettingsPage = withAuthGuard(ThemeSettingsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedThemeSettingsPage;
