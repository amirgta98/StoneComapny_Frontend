"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { DeleteAccountDialog } from "./delete-account-dialog";

interface DeleteAccountSectionProps {
  userId: string;
}

export function DeleteAccountSection({ userId }: DeleteAccountSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="border border-destructive/30 bg-destructive/[0.02] shadow-sm transition-all duration-200 hover:border-destructive/50">
        <CardHeader className="flex flex-col gap-1 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-destructive">
                حذف حساب کاربری
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                حذف دائمی تمام اطلاعات، سوابق و تنظیمات مرتبط با این حساب کاربری
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-destructive/[0.04] border border-destructive/20">
            <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                حذف حساب یک عملیات دائمی است و ممکن است اطلاعات حساب شما برای همیشه حذف شود.
                این عملیات قابل بازگشت نیست.
              </p>
            </div>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="shrink-0 text-xs font-semibold gap-1.5 transition-all duration-150 active:scale-[0.98]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>حذف حساب کاربری</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteAccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userId={userId}
      />
    </>
  );
}
