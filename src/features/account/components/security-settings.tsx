"use client";

import { PageHeader } from "@/components/layouts";
import { useAuth } from "@/auth";
import { PhoneSecuritySection } from "./security/phone-security-section";
import { ActiveSessionsSection } from "./security/active-sessions-section";
import { LogoutOtherDevicesSection } from "./security/logout-other-devices-section";
import { DeleteAccountSection } from "./security/delete-account-section";

/**
 * Account Security Center (/account/security).
 *
 * Structured in 4 distinct sections as specified:
 * 1. شماره موبایل (Mobile Number overview & change link)
 * 2. دستگاه‌های فعال (Active Devices & individual revocation)
 * 3. خروج از سایر دستگاه‌ها (Revoke all non-current sessions)
 * 4. حذف حساب کاربری (Permanent account deletion danger zone)
 */
export function SecuritySettings() {
  const { user } = useAuth();
  const currentUserId = user?.id || "u-user-1";

  return (
    <div className="space-y-6">
      <PageHeader
        title="امنیت حساب"
        description="مدیریت نشست‌های فعال، شماره همراه و تنظیمات حفاظت از حساب کاربری"
      />

      {/* 1. Mobile Phone Section */}
      <section aria-labelledby="section-phone-security">
        <PhoneSecuritySection phone={user?.phone} />
      </section>

      {/* 2. Active Sessions Section */}
      <section aria-labelledby="section-active-sessions">
        <ActiveSessionsSection userId={currentUserId} />
      </section>

      {/* 3. Logout from Other Devices Section */}
      <section aria-labelledby="section-logout-others">
        <LogoutOtherDevicesSection userId={currentUserId} />
      </section>

      {/* 4. Delete Account Danger Zone */}
      <section aria-labelledby="section-delete-account" className="pt-2">
        <DeleteAccountSection userId={currentUserId} />
      </section>
    </div>
  );
}
