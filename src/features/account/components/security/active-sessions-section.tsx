"use client";

import { useState } from "react";
import { Laptop, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { toast } from "sonner";
import { SessionCard } from "./session-card";
import { LogoutSessionDialog } from "./logout-session-dialog";
import { useSecurityStore } from "../../stores/security-store";
import type { Session } from "../../types/security";

interface ActiveSessionsSectionProps {
  userId: string;
}

export function ActiveSessionsSection({ userId }: ActiveSessionsSectionProps) {
  const { getUserSessions, revokeSession } = useSecurityStore();
  const sessions = getUserSessions(userId);

  const [sessionToLogout, setSessionToLogout] = useState<Session | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenLogoutDialog = (session: Session) => {
    setSessionToLogout(session);
    setDialogOpen(true);
  };

  const handleConfirmLogout = (session: Session) => {
    revokeSession(session.id, userId);
    toast.success(`دسترسی دستگاه ${session.deviceTitle} با موفقیت لغو شد.`);
  };

  return (
    <>
      <Card className="border border-border/80 shadow-sm transition-all duration-200">
        <CardHeader className="flex flex-col gap-1 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Laptop className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">دستگاه‌های فعال</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                لیست مرورگرها و دستگاه‌هایی که به این حساب کاربری دسترسی دارند
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Shield className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm">هیچ دستگاه فعالی یافت نشد.</p>
            </div>
          ) : (
            sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onLogoutClick={handleOpenLogoutDialog}
              />
            ))
          )}
        </CardContent>
      </Card>

      <LogoutSessionDialog
        session={sessionToLogout}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
