"use client";

import { useState, useEffect } from "react";
import {
  FolderTree,
  AlertCircle,
  CheckCircle,
  Plus,
  Save,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { CategoryNode, CategoryFormData } from "../../types";
import { MAX_CATEGORY_DEPTH } from "../../types";
import { canCategoryBeParent } from "../../data/mock-hierarchical-categories";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allCategories: CategoryNode[];
  editingCategory: CategoryNode | null;
  initialParentId: string | null;
  onSubmit: (data: CategoryFormData) => { success: boolean; error?: string };
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  allCategories,
  editingCategory,
  initialParentId,
  onSubmit,
}: CategoryFormDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync form state when dialog opens or editingCategory changes
  useEffect(() => {
    if (open) {
      if (editingCategory) {
        setName(editingCategory.name);
        setSlug(editingCategory.slug);
        setDescription(editingCategory.description || "");
        setImage(editingCategory.image || "/test_images/stones/test_1.jpg");
        setParentId(editingCategory.parentId);
        setIsActive(editingCategory.isActive);
      } else {
        setName("");
        setSlug("");
        setDescription("");
        setImage("/test_images/stones/test_1.jpg");
        setParentId(initialParentId);
        setIsActive(true);
      }
      setErrorMessage(null);
    }
  }, [open, editingCategory, initialParentId]);

  // Generate slug automatically from name if creating
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\u0600-\u06FF\w-]/g, "");
      setSlug(generated);
    }
  };

  // Evaluate resulting depth and validity based on chosen parent
  const parentValidation = canCategoryBeParent(
    editingCategory ? editingCategory.id : null,
    parentId,
    allCategories,
    MAX_CATEGORY_DEPTH
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("لطفاً نام دسته‌بندی را وارد کنید.");
      return;
    }

    if (!parentValidation.allowed) {
      setErrorMessage(parentValidation.reason || "انتخاب این والد مجاز نیست.");
      return;
    }

    const res = onSubmit({
      name,
      slug: slug.trim() || `cat-${Date.now()}`,
      description,
      image,
      parentId,
      isActive,
    });

    if (!res.success) {
      setErrorMessage(res.error || "خطا در ثبت دسته‌بندی.");
      return;
    }

    onOpenChange(false);
  };

  // Build sorted list of options with hierarchy indentation
  const parentOptions = allCategories
    .slice()
    .sort((a, b) => a.depth - b.depth || a.order - b.order);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="text-start pb-2 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {editingCategory
                    ? `ویرایش دسته‌بندی «${editingCategory.name}»`
                    : "افزودن دسته‌بندی جدید سنگ"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  دسته‌بندی‌ها می‌توانند تا حداکثر ۴ سطح به صورت درختی تعریف شوند.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 text-xs">
            {errorMessage && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Category Name */}
            <div className="space-y-1.5">
              <Label htmlFor="cat-name" className="text-xs font-semibold">
                نام دسته‌بندی <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="مثال: سنگ مرمریت دهبید، اسلب بوک‌مچ..."
                className="text-xs h-9"
                required
              />
            </div>

            {/* Parent Category Selector with 4-level constraint feedback */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="cat-parent" className="text-xs font-semibold">
                  دسته‌بندی والد (موقعیت در درخت)
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  سقف مجاز: {MAX_CATEGORY_DEPTH} سطح
                </span>
              </div>

              <select
                id="cat-parent"
                value={parentId ?? ""}
                onChange={(e) => setParentId(e.target.value === "" ? null : e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— دسته اصلی (سطح ۱: ریشه درخت) —</option>
                {parentOptions.map((opt) => {
                  const check = canCategoryBeParent(
                    editingCategory ? editingCategory.id : null,
                    opt.id,
                    allCategories,
                    MAX_CATEGORY_DEPTH
                  );

                  const indent = "— ".repeat(opt.depth - 1);
                  let label = `${indent}${opt.name} (سطح ${opt.depth})`;

                  if (!check.allowed) {
                    label += ` ⛔ [${check.reason}]`;
                  }

                  return (
                    <option
                      key={opt.id}
                      value={opt.id}
                      disabled={!check.allowed}
                      className={!check.allowed ? "text-muted-foreground bg-muted/40" : ""}
                    >
                      {label}
                    </option>
                  );
                })}
              </select>

              {/* Dynamic Level Indicator Badge */}
              <div className="mt-2 rounded-xl border border-border/70 bg-secondary/30 p-2.5 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  سطح دسته‌بندی حاصل:
                </span>
                {parentValidation.allowed ? (
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold ${
                        parentValidation.resultingDepth === 1
                          ? "bg-indigo-500/15 text-indigo-700 border-indigo-500/30"
                          : parentValidation.resultingDepth === 2
                          ? "bg-sky-500/15 text-sky-700 border-sky-500/30"
                          : parentValidation.resultingDepth === 3
                          ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                      }`}
                    >
                      سطح {parentValidation.resultingDepth}
                      {parentValidation.resultingDepth === 4 && " (لایه نهایی - حداکثر سقف)"}
                    </Badge>
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                ) : (
                  <Badge variant="destructive" className="text-[10px] font-bold">
                    غیرمجاز (بیش از ۴ سطح)
                  </Badge>
                )}
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="cat-slug" className="text-xs font-semibold">
                نامک در نشانی اینترنتی (Slug)
              </Label>
              <Input
                id="cat-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dehbid-marble"
                className="text-xs h-9 font-mono text-start"
                dir="ltr"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc" className="text-xs font-semibold">
                توضیحات و کاربرد سنگ
              </Label>
              <Textarea
                id="cat-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیح مختصر در خصوص ویژگی‌های سنگ، کاربرد در فضا و شرایط تولید..."
                className="text-xs min-h-20"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-xl border border-border/70 p-3 bg-card">
              <div>
                <p className="font-semibold text-xs text-foreground">
                  وضعیت نمایش در فروشگاه و کاتالوگ
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  در صورت غیرفعال بودن، این دسته در منوهای خریداران نمایش داده نمی‌شود.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-start pt-3 border-t border-border/60">
            <Button
              type="submit"
              disabled={!parentValidation.allowed}
              className="gap-1.5 text-xs font-semibold shadow-xs"
            >
              {editingCategory ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingCategory ? "ذخیره تغییرات" : "افزودن دسته‌بندی"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              انصراف
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
