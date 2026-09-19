"use client";

import { useState } from "react";
import { Laptop, LogOut, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Skeleton,
} from "@/components/ui";
import { SessionItem } from "./session-item";
import { RevokeSessionDialog } from "./revoke-session-dialog";
import { RevokeOthersDialog } from "./revoke-others-dialog";
import {
  revokeSession,
  revokeOtherSessions,
} from "../../services/security-api";
import type { UserSession } from "../../types/security";

type ActiveSessionsCardProps = {
  userId: string;
  sessions: UserSession[];
  isLoading: boolean;
  onSessionsChange: (updated: UserSession[]) => void;
  onRefresh: () => void;
};

export function ActiveSessionsCard({
  userId,
  sessions,
  isLoading,
  onSessionsChange,
  onRefresh,
}: ActiveSessionsCardProps) {
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [isRevokeSingleOpen, setIsRevokeSingleOpen] = useState(false);
  const [isRevokeOthersOpen, setIsRevokeOthersOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const otherSessions = sessions.filter((s) => !s.isCurrent);
  const hasOtherSessions = otherSessions.length > 0;

  const handleOpenRevokeSingle = (session: UserSession) => {
    setSelectedSession(session);
    setIsRevokeSingleOpen(true);
  };

  const handleConfirmRevokeSingle = async () => {
    if (!selectedSession) return;
    setActionLoading(true);
    try {
      const updated = await revokeSession(userId, selectedSession.id);
      onSessionsChange(updated);
      toast.success("دستگاه با موفقیت از حساب شما خارج شد.");
      setIsRevokeSingleOpen(false);
      setSelectedSession(null);
    } catch (err: any) {
      toast.error(err?.message || "خروج از دستگاه با خطا مواجه شد.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmRevokeOthers = async () => {
    setActionLoading(true);
    try {
      const updated = await revokeOtherSessions(userId);
      onSessionsChange(updated);
      toast.success("از تمام دستگاه‌های دیگر با موفقیت خارج شدید.");
      setIsRevokeOthersOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "خروج از سایر دستگاه‌ها با خطا مواجه شد.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden border border-stone-200/80 bg-card shadow-xs dark:border-stone-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Laptop className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  دستگاه‌های فعال
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  دستگاه‌ها و مرورگرهایی که در حال حاضر به حساب کاربری شما متصل هستند
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                title="بروزرسانی نشست‌ها"
                className="h-8 w-8 text-muted-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">بروزرسانی</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!hasOtherSessions || isLoading || actionLoading}
                onClick={() => setIsRevokeOthersOpen(true)}
                className="h-8 gap-1.5 border-stone-300 text-xs hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive dark:border-stone-700"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>خروج از سایر دستگاه‌ها</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-1">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 p-8 text-center dark:border-stone-800">
              <Shield className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium text-foreground">
                هیچ نشست فعالی یافت نشد
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  onRevoke={handleOpenRevokeSingle}
                  isRevoking={actionLoading && selectedSession?.id === session.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RevokeSessionDialog
        session={selectedSession}
        isOpen={isRevokeSingleOpen}
        onClose={() => {
          setIsRevokeSingleOpen(false);
          setSelectedSession(null);
        }}
        onConfirm={handleConfirmRevokeSingle}
        isLoading={actionLoading}
      />

      <RevokeOthersDialog
        isOpen={isRevokeOthersOpen}
        onClose={() => setIsRevokeOthersOpen(false)}
        onConfirm={handleConfirmRevokeOthers}
        isLoading={actionLoading}
        otherDevicesCount={otherSessions.length}
      />
    </>
  );
}
