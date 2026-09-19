"use client";

import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProductionStage } from "../types";

export function FactoryProductionPipeline({
  stages,
}: {
  stages: ProductionStage[];
}) {
  const totalVolume = stages.reduce((acc, stage) => acc + stage.volumeSqm, 0);
  const totalOrders = stages.reduce((acc, stage) => acc + stage.orderCount, 0);

  return (
    <Card className="border border-border/80 bg-card shadow-2xs">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              خط تولید و فرآوری سنگ کارخانه
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              رهگیری مراحل تولید سفارشات فعال از تخلیه کوپ تا بارگیری تریلی
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
              مجموع در گردش: {totalVolume.toLocaleString("fa-IR")} مترمربع
            </Badge>
            <Badge variant="outline" className="text-xs px-2.5 py-1 text-muted-foreground">
              {totalOrders.toLocaleString("fa-IR")} پارت سفارش
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {stages.map((stage, idx) => {
            const hasOrders = stage.orderCount > 0;

            return (
              <div
                key={stage.id}
                className={cn(
                  "relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200",
                  hasOrders
                    ? "bg-secondary/40 border-primary/25 shadow-xs"
                    : "bg-background/40 border-border/60 opacity-80"
                )}
              >
                {/* Header of stage card */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                      {stage.stepNumber}
                    </span>
                    {hasOrders ? (
                      <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold bg-primary/10 text-primary">
                        {stage.orderCount} سفارش
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">خالی</span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-foreground">
                    {stage.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                {/* Footer of stage card */}
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground">متراژ خط:</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {stage.volumeSqm > 0
                      ? `${stage.volumeSqm.toLocaleString("fa-IR")} م²`
                      : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
