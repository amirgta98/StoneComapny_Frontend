"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Layers } from "lucide-react";
import type { StoneCategoryShare } from "../types";

interface StoneCategoryChartProps {
  categories: StoneCategoryShare[];
}

export function StoneCategoryChart({ categories }: StoneCategoryChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">
              توزیع کاتالوگ و تقاضای انواع سنگ
            </CardTitle>
            <CardDescription className="text-xs">
              سهم هر دسته از سنگ‌های فعال در سامانه
            </CardDescription>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Multi-colored bar representation */}
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary">
          {categories.map((cat) => (
            <div
              key={cat.name}
              style={{
                width: `${cat.percentage}%`,
                backgroundColor: cat.color,
              }}
              className="h-full transition-all duration-500 hover:opacity-85"
              title={`${cat.name}: ${cat.percentage}٪`}
            />
          ))}
        </div>

        {/* Categories breakdown list */}
        <ul className="space-y-3 pt-2">
          {categories.map((cat) => (
            <li
              key={cat.name}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-medium text-foreground truncate">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-muted-foreground tabular-nums">
                  {cat.count.toLocaleString("fa-IR")} محصول
                </span>
                <span className="font-bold tabular-nums text-foreground min-w-[36px] text-end">
                  {cat.percentage}٪
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
