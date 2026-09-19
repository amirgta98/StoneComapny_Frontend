"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { TechnicalDocument } from "../../types/document";

interface DocumentStatsProps {
  documents: TechnicalDocument[];
}

export function DocumentStats({ documents }: DocumentStatsProps) {
  const totalCount = documents.length;
  const qcCount = documents.filter((d) => d.type === "quality_certificate").length;
  const tdsCount = documents.filter((d) => d.type === "spec_sheet").length;
  const verifiedCount = documents.filter((d) => d.verified).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {/* Total Documents */}
      <Card className="border border-border/80 bg-card shadow-xs transition-all hover:border-primary/20">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
            <FileText className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground sm:text-xs">
              کل اسناد فنی
            </div>
            <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
              {totalCount.toLocaleString("fa-IR")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Certificates */}
      <Card className="border border-border/80 bg-card shadow-xs transition-all hover:border-primary/20">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Award className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground sm:text-xs">
              گواهی کیفیت و اصالت
            </div>
            <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
              {qcCount.toLocaleString("fa-IR")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spec Sheets (TDS) */}
      <Card className="border border-border/80 bg-card shadow-xs transition-all hover:border-primary/20">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
            <ShieldCheck className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground sm:text-xs">
              برگه مشخصات فنی (TDS)
            </div>
            <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
              {tdsCount.toLocaleString("fa-IR")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standards Certified */}
      <Card className="border border-border/80 bg-card shadow-xs transition-all hover:border-primary/20">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
            <CheckCircle2 className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground sm:text-xs">
              مطابق استاندارد ملی و ASTM
            </div>
            <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
              {verifiedCount.toLocaleString("fa-IR")}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
