"use client";

import { useState, useMemo } from "react";
import {
  FolderTree,
  Plus,
  Search,
  ChevronsUpDown,
  ChevronsDown,
  ChevronsUp,
  Layers,
  Sparkles,
  Info,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/auth";
import { useCategoriesStore } from "../../stores/categories-store";
import { buildCategoryTree } from "../../data/mock-hierarchical-categories";
import { CategoryTreeItem } from "./category-tree-item";
import { CategoryFormDialog } from "./category-form-dialog";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import type { CategoryNode, CategoryFormData } from "../../types";
import { MAX_CATEGORY_DEPTH } from "../../types";

export function CategoriesManagerView() {
  const { user } = useAuth();
  const activeTenantId = user?.tenantId ?? "tenant-001";

  const {
    categories,
    expandedIds,
    searchQuery,
    setSearchQuery,
    toggleExpand,
    expandAll,
    collapseAll,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleStatus,
    getStats,
  } = useCategoriesStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryNode | null>(null);
  const [initialParentId, setInitialParentId] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryNode | null>(null);

  const stats = getStats();

  // Filter categories if search query exists
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  // Build tree from filtered or all categories
  const categoryTree = useMemo(() => {
    return buildCategoryTree(categories);
  }, [categories]);

  // Handle open create modal for a root category (depth 1)
  const handleCreateRoot = () => {
    setEditingCategory(null);
    setInitialParentId(null);
    setIsFormOpen(true);
  };

  // Handle open create modal for subcategory under given parent
  const handleAddSubcategory = (parentId: string) => {
    setEditingCategory(null);
    setInitialParentId(parentId);
    setIsFormOpen(true);
  };

  // Handle edit category
  const handleEdit = (cat: CategoryNode) => {
    setEditingCategory(cat);
    setInitialParentId(cat.parentId);
    setIsFormOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (cat: CategoryNode) => {
    setDeletingCategory(cat);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      return updateCategory(editingCategory.id, data);
    } else {
      return addCategory(data, activeTenantId);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-amber-950/10 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600/15 text-amber-700 border border-amber-500/25">
              <FolderTree className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              مدیریت دسته‌بندی‌های کاتالوگ سنگ
            </h1>
            <Badge
              variant="outline"
              className="border-amber-600/30 bg-amber-500/10 text-[10px] font-bold text-amber-700"
            >
              حداکثر ۴ سطح
            </Badge>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-2xl leading-relaxed">
            ساختار درختی سنگ‌ها، سورت‌ها، انواع اسلب و تایل و فینیش‌های سطحی را تا سقف ۴ لایه تو در تو تعریف و سازمان‌دهی کنید.
          </p>
        </div>

        <Button
          onClick={handleCreateRoot}
          className="gap-1.5 text-xs font-semibold shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>افزودن دسته اصلی (سطح ۱)</span>
        </Button>
      </div>

      {/* KPI / Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground">
            مجموع کل دسته‌ها
          </p>
          <p className="mt-1.5 text-xl font-bold text-foreground tabular-nums">
            {stats.totalCategories.toLocaleString("fa-IR")}
          </p>
        </Card>

        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground">
            دسته‌های ریشه (سطح ۱)
          </p>
          <p className="mt-1.5 text-xl font-bold text-indigo-700 dark:text-indigo-400 tabular-nums">
            {stats.rootCategories.toLocaleString("fa-IR")}
          </p>
        </Card>

        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground">
            حداکثر عمق استفاده‌شده
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {stats.maxDepthUsed} از {MAX_CATEGORY_DEPTH}
            </span>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
              {stats.maxDepthUsed === MAX_CATEGORY_DEPTH ? "سقف کامل" : "امکان توسعه"}
            </Badge>
          </div>
        </Card>

        <Card className="border border-border/70 bg-card p-3.5 shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground">
            سنگ‌های تخصیص‌یافته
          </p>
          <p className="mt-1.5 text-xl font-bold text-foreground tabular-nums">
            {stats.totalProducts.toLocaleString("fa-IR")} عدد
          </p>
        </Card>
      </div>

      {/* Depth Level Guide Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span className="font-semibold text-foreground">راهنمای سطوح سلسله‌مراتب:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 border bg-indigo-500/15 text-indigo-700 border-indigo-500/30 font-medium">
            سطح ۱: نوع سنگ
          </span>
          <span className="text-muted-foreground">←</span>
          <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 border bg-sky-500/15 text-sky-700 border-sky-500/30 font-medium">
            سطح ۲: سورت و معدن
          </span>
          <span className="text-muted-foreground">←</span>
          <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 border bg-amber-500/15 text-amber-700 border-amber-500/30 font-medium">
            سطح ۳: فرم و قواره
          </span>
          <span className="text-muted-foreground">←</span>
          <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 border bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-bold">
            سطح ۴: فینیش نهایی (سقف ۴)
          </span>
        </div>
      </div>

      {/* Search & Tree Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی عنوان، اسلاگ، سنگ..."
            className="ps-9 text-xs h-9 bg-card"
          />
        </div>

        {/* Tree Expand/Collapse controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronsDown className="h-3.5 w-3.5" />
            <span>گسترش همه</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronsUp className="h-3.5 w-3.5" />
            <span>بستن همه</span>
          </Button>
        </div>
      </div>

      {/* Main Hierarchical Tree View */}
      <div className="space-y-2">
        {categoryTree.map((rootNode) => (
          <CategoryTreeItem
            key={rootNode.id}
            node={rootNode}
            isExpanded={expandedIds.includes(rootNode.id)}
            onToggleExpand={toggleExpand}
            onAddSubcategory={handleAddSubcategory}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggleStatus={toggleStatus}
          />
        ))}

        {categoryTree.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card">
            <FolderTree className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-3 text-sm font-bold text-foreground">
              دسته‌بندی یافت نشد
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {searchQuery
                ? `هیچ دسته‌ای با عبارت «${searchQuery}» مطابقت نداشت.`
                : "هنوز دسته‌بندی برای این کارخانه ایجاد نشده است."}
            </p>
            <Button
              onClick={handleCreateRoot}
              className="mt-4 gap-1.5 text-xs font-semibold"
            >
              <Plus className="h-4 w-4" />
              <span>ایجاد اولین دسته اصلی</span>
            </Button>
          </div>
        )}
      </div>

      {/* Add / Edit Category Dialog with 4-level constraint */}
      <CategoryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        allCategories={categories}
        editingCategory={editingCategory}
        initialParentId={initialParentId}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <CategoryDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        category={deletingCategory}
        allCategories={categories}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
