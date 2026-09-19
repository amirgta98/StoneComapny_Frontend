"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FactorySalesTrend } from "../types";

export function FactorySalesChart({ data }: { data: FactorySalesTrend[] }) {
  const [metric, setMetric] = useState<"revenue" | "volume">("revenue");

  return (
    <Card className="border border-border/80 bg-card shadow-2xs h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              روند درآمد و حجم تولید ۶ ماه گذشته کارخانه
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              آمار ارزش فروش ریالی و متراژ اسلب و تایل فرآوری‌شده در خط ساب
            </CardDescription>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 bg-secondary/50">
            <button
              onClick={() => setMetric("revenue")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                metric === "revenue"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              درآمد فروش (میلیون تومان)
            </button>
            <button
              onClick={() => setMetric("volume")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                metric === "volume"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              متراژ تولید (مترمربع)
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="factoryRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="factoryVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />

              {metric === "revenue" ? (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="درآمد ناخالص (میلیون تومان)"
                  stroke="var(--primary)"
                  fill="url(#factoryRev)"
                  strokeWidth={2.5}
                />
              ) : (
                <Area
                  type="monotone"
                  dataKey="productionSqm"
                  name="متراژ سنگ فرآوری‌شده (مترمربع)"
                  stroke="#d97706"
                  fill="url(#factoryVol)"
                  strokeWidth={2.5}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
