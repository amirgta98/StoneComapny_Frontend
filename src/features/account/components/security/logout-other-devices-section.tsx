"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { toast } from "sonner";
import { LogoutOtherDevicesDialog } from "./logout-other-devices-dialog";
import { useSecurityStore } from "../../stores/security-store";

interface LogoutOtherDevicesSectionProps {
  userId: string;
}

export function LogoutOtherDevicesSection({
  userId,
}: LogoutOtherDevicesSectionProps) {
  const { getUserSessions, revokeOtherSessions } = useSecurityStore();
  const sessions = getUserSessions(userId);
  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConfirmLogoutOthers = () => {
    revokeOtherSessions(userId);
    toast.success("از تمام دستگاههای دیگر با موفقیت خارج شدید.");
  };

  return (
    <>
      <Card className="border border-border/80 shadow-sm transition-all duration-200">
        <CardHeader className="flex flex-col gap-1 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <LogOut className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">خروج از سایر دستگاه‌ها</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                قطع اتصال تمام مرورگرها و نشست‌های فعال به جز دستگاه فعلی شما
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border/40">
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                اگر دستگاه ناشناسی در لیست نشست‌های فعال دیدید یا در مکانی عمومی وارد حساب خود شدید،
                می‌توانید همه‌ی آن‌ها را یک‌جا خارج کنید.
              </p>
              {otherSessionsCount > 0 ? (
                <p className="text-foreground font-medium">
                  در حال حاضر <span className="text-amber-600 font-bold">{otherSessionsCount}</span> دستگاه دیگر به حساب شما متصل هستند.
                </p>
              ) : (
                <p className="text-emerald-600 font-medium">
                  در حال حاضر هیچ دستگاه دیگری به حساب شما متصل نیست.
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={otherSessionsCount === 0}
              onClick={() => setDialogOpen(true)}
              className="shrink-0 text-xs font-semibold text-amber-600 border-amber-300 hover:bg-amber-500/10 hover:text-amber-700 transition-all duration-150 active:scale-[0.98]"
            >
              <LogOut className="h-3.5 w-3.5 rtl:rotate-180 me-1.5" />
              <span>خروج از سایر دستگاه‌ها</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <LogoutOtherDevicesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmLogoutOthers}
      />
    </>
  );
}
