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
  Button,
} from "@/components/ui";
import type { GrowthPoint } from "../types";

export function PlatformGrowthChart({ data }: { data: GrowthPoint[] }) {
  const [viewMode, setViewMode] = useState<"scale" | "revenue">("scale");

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold">
              روند رشد و عملکرد کلان پلتفرم
            </CardTitle>
            <CardDescription className="text-xs">
              آمار شرکت‌ها، کاربران و حجم گردش مالی در ۷ ماه گذشته
            </CardDescription>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 bg-secondary/50">
            <button
              onClick={() => setViewMode("scale")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === "scale"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              شرکت‌ها و اعضا
            </button>
            <button
              onClick={() => setViewMode("revenue")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === "revenue"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              گردش مالی (میلیون تومان)
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tenants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#44403c" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#44403c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
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

              {viewMode === "scale" ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="tenants"
                    name="کارخانجات و شرکت‌ها"
                    stroke="var(--primary)"
                    fill="url(#tenants)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="کاربران و فعالان"
                    stroke="#44403c"
                    fill="url(#users)"
                    strokeWidth={2}
                  />
                </>
              ) : (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="گردش مالی (میلیون تومان)"
                  stroke="#059669"
                  fill="url(#revenue)"
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