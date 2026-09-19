"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  Check,
  ChevronDown,
  X,
  FolderTree,
  Tag,
  Layers,
} from "lucide-react";
import { useCategoriesStore } from "../stores/categories-store";
import type { CategoryNode } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategoryAutocompleteProps {
  value?: string; // Slug or ID of selected category
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const DEPTH_LABELS: Record<number, string> = {
  1: "دسته اصلی",
  2: "زیردسته",
  3: "گروه محصول",
  4: "فرآوری نهایی",
};

const DEPTH_COLORS: Record<number, string> = {
  1: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  2: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  3: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  4: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
};

export function CategoryAutocomplete({
  value,
  onChange,
  placeholder = "جستجو و انتخاب دسته‌بندی درختی سنگ...",
  className = "",
}: CategoryAutocompleteProps) {
  const { categories } = useCategoriesStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Map category by ID and Slug for fast path resolution
  const categoryMap = useMemo(() => {
    const byId = new Map<string, CategoryNode>();
    const bySlug = new Map<string, CategoryNode>();
    for (const c of categories) {
      byId.set(c.id, c);
      bySlug.set(c.slug, c);
    }
    return { byId, bySlug };
  }, [categories]);

  // Compute full ancestral breadcrumb trail for each category
  const getCategoryTrail = useMemo(() => {
    return (cat: CategoryNode): CategoryNode[] => {
      const trail: CategoryNode[] = [cat];
      let current = cat;
      while (current.parentId) {
        const parent = categoryMap.byId.get(current.parentId);
        if (!parent) break;
        trail.unshift(parent);
        current = parent;
      }
      return trail;
    };
  }, [categoryMap]);

  // Find currently selected category by slug or id
  const selectedCategory = useMemo(() => {
    if (!value) return undefined;
    return (
      categoryMap.bySlug.get(value) ||
      categoryMap.byId.get(value) ||
      categories.find((c) => c.slug === value || c.id === value)
    );
  }, [value, categoryMap, categories]);

  const selectedTrail = useMemo(() => {
    return selectedCategory ? getCategoryTrail(selectedCategory) : [];
  }, [selectedCategory, getCategoryTrail]);

  // Filtered categories based on search input
  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return categories;
    }
    return categories.filter((c) => {
      const trail = getCategoryTrail(c);
      const fullPathText = trail.map((item) => item.name).join(" ");
      return (
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        fullPathText.toLowerCase().includes(q)
      );
    });
  }, [categories, query, getCategoryTrail]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (category: CategoryNode) => {
    onChange(category.slug);
    setIsOpen(false);
    setQuery("");
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange("");
    setQuery("");
    if (isOpen) {
      inputRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} dir="rtl">
      {/* Selected Category Presentation (if selected and dropdown is closed) */}
      {selectedCategory && !isOpen ? (
        <div className="group flex items-center justify-between gap-2.5 rounded-xl border border-border/90 bg-secondary/30 p-2.5 transition-all hover:bg-secondary/50 hover:border-border">
          <div
            className="flex flex-1 items-center gap-2 overflow-hidden cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FolderTree className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              {/* Breadcrumb Path */}
              <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                {selectedTrail.map((node, index) => (
                  <span key={node.id} className="flex items-center gap-1">
                    <span
                      className={
                        index === selectedTrail.length - 1
                          ? "font-semibold text-foreground"
                          : ""
                      }
                    >
                      {node.name}
                    </span>
                    {index < selectedTrail.length - 1 && (
                      <span className="text-muted-foreground/50">›</span>
                    )}
                  </span>
                ))}
              </div>

              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  {selectedCategory.name}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-1.5 py-0.2 text-[10px] font-medium ${
                    DEPTH_COLORS[selectedCategory.depth] || ""
                  }`}
                >
                  {DEPTH_LABELS[selectedCategory.depth]}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
              title="حذف دسته‌بندی انتخابی"
            >
              <X className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md"
              title="تغییر دسته‌بندی"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        /* Autocomplete Search Field */
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute start-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="h-9 w-full rounded-lg border border-input bg-background pe-16 ps-9 text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
            />
            <div className="absolute end-2 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="rounded p-0.5 text-muted-foreground hover:text-foreground"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 max-h-72 w-full overflow-y-auto rounded-xl border border-border/80 bg-card p-1.5 shadow-lg backdrop-blur-md">
          {/* Top Quick Info */}
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border/60 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              <span>انتخاب از درخت دسته‌بندی ({filteredCategories.length} مورد)</span>
            </span>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-destructive hover:underline text-[10px]"
              >
                حذف انتخاب
              </button>
            )}
          </div>

          {filteredCategories.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
              <p>دسته‌بندی با این عنوان یافت نشد.</p>
              <p className="text-[10px] text-muted-foreground/80">
                عبارت جستجوی دیگری را امتحان کنید یا نام والد را وارد نمایید.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30 pt-1">
              {filteredCategories.map((cat) => {
                const trail = getCategoryTrail(cat);
                const isSelected =
                  value === cat.slug || value === cat.id;

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelect(cat)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs ${
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-secondary/70 text-foreground"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      {/* Ancestor Breadcrumb */}
                      {trail.length > 1 && (
                        <div className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                          {trail.slice(0, -1).map((ancestor, i) => (
                            <span key={ancestor.id} className="flex items-center gap-1">
                              <span>{ancestor.name}</span>
                              <span className="text-muted-foreground/40">›</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Main Category Name */}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{cat.name}</span>
                        <span
                          className={`inline-flex items-center rounded-full border px-1.5 py-0.2 text-[9px] font-medium ${
                            DEPTH_COLORS[cat.depth] || ""
                          }`}
                        >
                          {DEPTH_LABELS[cat.depth]}
                        </span>
                        {cat.productCount > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            ({cat.productCount} سنگ)
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
