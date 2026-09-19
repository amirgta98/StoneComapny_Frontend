"use client";

import {
  ChevronDown,
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Folder,
  FolderOpen,
  Ban,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CategoryNode } from "../../types";
import { MAX_CATEGORY_DEPTH } from "../../types";

interface CategoryTreeItemProps {
  node: CategoryNode;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onAddSubcategory: (parentId: string) => void;
  onEdit: (node: CategoryNode) => void;
  onDelete: (node: CategoryNode) => void;
  onToggleStatus: (id: string) => void;
}

const DEPTH_CONFIG: Record<
  1 | 2 | 3 | 4,
  {
    label: string;
    badgeClass: string;
    borderClass: string;
    bgClass: string;
  }
> = {
  1: {
    label: "سطح ۱ (اصلی)",
    badgeClass: "bg-indigo-500/15 text-indigo-700 border-indigo-500/30",
    borderClass: "border-s-4 border-indigo-600",
    bgClass: "bg-card hover:bg-secondary/30",
  },
  2: {
    label: "سطح ۲",
    badgeClass: "bg-sky-500/15 text-sky-700 border-sky-500/30",
    borderClass: "border-s-2 border-sky-500/50",
    bgClass: "bg-card/90 hover:bg-secondary/30",
  },
  3: {
    label: "سطح ۳",
    badgeClass: "bg-amber-500/15 text-amber-700 border-amber-500/30",
    borderClass: "border-s-2 border-amber-500/50",
    bgClass: "bg-card/80 hover:bg-secondary/30",
  },
  4: {
    label: "سطح ۴ (سقف مجاز)",
    badgeClass: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-bold",
    borderClass: "border-s-2 border-emerald-600/60",
    bgClass: "bg-card/70 hover:bg-secondary/30",
  },
};

export function CategoryTreeItem({
  node,
  isExpanded,
  onToggleExpand,
  onAddSubcategory,
  onEdit,
  onDelete,
  onToggleStatus,
}: CategoryTreeItemProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isMaxDepth = node.depth >= MAX_CATEGORY_DEPTH;
  const config = DEPTH_CONFIG[node.depth];

  // Dynamic indent based on depth (RTL: padding-inline-start)
  const indentClass =
    node.depth === 1
      ? "ms-0"
      : node.depth === 2
      ? "ms-4 sm:ms-6"
      : node.depth === 3
      ? "ms-8 sm:ms-12"
      : "ms-12 sm:ms-16";

  return (
    <div className="space-y-1.5">
      <div
        className={cn(
          "group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/80 p-3 transition-all duration-150 shadow-2xs",
          config.borderClass,
          config.bgClass,
          indentClass
        )}
      >
        {/* Right side (RTL start): Expand chevron, Level Badge, Thumbnail, Title & Slug */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Expand/collapse button */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggleExpand(node.id)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label={isExpanded ? "بستن شاخه" : "باز کردن شاخه"}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="h-7 w-7 shrink-0 flex items-center justify-center text-muted-foreground/40">
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
            </div>
          )}

          {/* Level Badge */}
          <Badge
            variant="outline"
            className={cn("text-[10px] shrink-0 font-medium", config.badgeClass)}
          >
            {config.label}
          </Badge>

          {/* Thumbnail */}
          {node.image && (
            <img
              src={node.image}
              alt={node.name}
              className="h-9 w-9 shrink-0 rounded-lg border border-border/70 object-cover"
            />
          )}

          {/* Title & Slug */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-bold text-xs sm:text-sm text-foreground truncate",
                  !node.isActive && "line-through text-muted-foreground"
                )}
              >
                {node.name}
              </span>
              {!node.isActive && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground bg-secondary/50">
                  غیرفعال
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
              <span className="font-mono text-[10px]" dir="ltr">
                /{node.slug}
              </span>
              {hasChildren && (
                <span>
                  · {node.children!.length.toLocaleString("fa-IR")} زیرمجموعه
                </span>
              )}
              {node.productCount > 0 && (
                <span className="flex items-center gap-0.5 text-foreground font-medium">
                  <Package className="h-3 w-3 text-muted-foreground" />
                  {node.productCount.toLocaleString("fa-IR")} سنگ
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Left side (RTL end): Actions */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          {/* Add Subcategory Button (DISABLED if depth === 4) */}
          {isMaxDepth ? (
            <div
              className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-secondary/40 px-2 py-1 text-[10px] font-medium text-muted-foreground cursor-not-allowed"
              title="حداکثر سقف مجاز (۴ سطح) تکمیل شده است و امکان افزودن زیرمجموعه بیشتر وجود ندارد."
            >
              <Ban className="h-3 w-3 text-amber-600" />
              <span>سقف ۴ سطح تکمیل است</span>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddSubcategory(node.id)}
              className="h-7 px-2 text-[11px] gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>زیرمجموعه</span>
            </Button>
          )}

          {/* Edit Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(node)}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            title="ویرایش دسته‌بندی"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>

          {/* Delete Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(node)}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="حذف دسته‌بندی"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Recursive Children Rendering */}
      {hasChildren && isExpanded && (
        <div className="space-y-1.5 pt-0.5">
          {node.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              node={child}
              isExpanded={isExpanded}
              onToggleExpand={onToggleExpand}
              onAddSubcategory={onAddSubcategory}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
