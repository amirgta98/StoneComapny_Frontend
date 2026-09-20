"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Building2,
  MapPin,
  Sparkles,
  PhoneCall,
  RotateCcw,
} from "lucide-react";

import {
  Input,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { EmptyState } from "@/components/data-listing";
import type {
  Project,
  ProjectCategoryKey,
  ProjectFilterState,
  ProjectStoneCategory,
} from "../types";
import {
  PROJECT_CATEGORIES,
  PROJECT_STONE_CATEGORIES,
  calculateProjectStats,
  filterProjects,
} from "../lib/project-service";
import { ProjectCard } from "./project-card";
import { ProjectQuickViewModal } from "./project-quick-view-modal";

type ProjectsPageViewProps = {
  initialProjects: Project[];
};

export function ProjectsPageView({ initialProjects }: ProjectsPageViewProps) {
  const [filters, setFilters] = useState<ProjectFilterState>({
    query: "",
    category: "all",
    stoneCategory: "all",
    city: "all",
  });

  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [quickViewProject, setQuickViewProject] = useState<Project | null>(null);

  // Available cities derived dynamically from project dataset
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    for (const p of initialProjects) {
      if (p.city) cities.add(p.city);
    }
    return Array.from(cities);
  }, [initialProjects]);

  // Overall dataset statistics
  const stats = useMemo(
    () => calculateProjectStats(initialProjects),
    [initialProjects]
  );

  // Filtered dataset
  const filteredProjects = useMemo(
    () => filterProjects(initialProjects, filters),
    [initialProjects, filters]
  );

  // Active filters count
  const activeFiltersCount =
    (filters.query.trim() ? 1 : 0) +
    (filters.category !== "all" ? 1 : 0) +
    (filters.stoneCategory !== "all" ? 1 : 0) +
    (filters.city !== "all" ? 1 : 0);

  const resetFilters = () => {
    setFilters({
      query: "",
      category: "all",
      stoneCategory: "all",
      city: "all",
    });
  };

  return (
    <div className="w-full bg-background text-foreground">
      {/* Hero Header */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Sparkles className="size-3.5" />
            <span>ویترین تخصصی و نمونه‌کارهای اجرا شده</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            پروژه‌های اجرایی سنگ طبیعی
          </h1>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            مجموعه‌ای از معتبرترین پروژه‌های ساختمانی، برج‌های اداری، لابی‌های لوکس و ویلاهای اختصاصی اجرا شده با سنگ‌های مرغوب صنایع سنگ سپنتا در سراسر ایران.
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto">
            <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm">
              <span className="block text-xl sm:text-2xl font-black text-primary">
                +{stats.totalProjects}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                پروژه شاخص اجرا شده
              </span>
            </div>

            <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm">
              <span className="block text-xl sm:text-2xl font-black text-primary">
                +{stats.cities}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                شهر و کلان‌شهر کشور
              </span>
            </div>

            <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm">
              <span className="block text-xl sm:text-2xl font-black text-primary">
                ۱۰۰٪
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                سنگ طبیعی ایرانی ممتاز
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing & Filters Section */}
      <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search & Main Filter Toolbar */}
        <div className="space-y-4">
          {/* Top Bar: Search + City + Stone Type + Layout Toggle */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="جستجو در نام پروژه، معمار، نوع سنگ، شهر یا کارفرما..."
                value={filters.query}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, query: e.target.value }))
                }
                className="pr-10 pl-10 h-11 text-sm bg-card border-border"
              />
              {filters.query && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, query: "" }))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="پاک کردن جستجو"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Dropdown Filters & Layout switcher */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Stone Category Select */}
              <div className="w-40 sm:w-44">
                <Select
                  value={filters.stoneCategory}
                  onValueChange={(val) =>
                    setFilters((prev) => ({
                      ...prev,
                      stoneCategory: val as ProjectStoneCategory,
                    }))
                  }
                >
                  <SelectTrigger className="h-11 text-xs sm:text-sm bg-card">
                    <SelectValue placeholder="جنس سنگ" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STONE_CATEGORIES.map((c) => (
                      <SelectItem key={c.key} value={c.key}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City Select */}
              <div className="w-32 sm:w-36">
                <Select
                  value={filters.city}
                  onValueChange={(val) =>
                    setFilters((prev) => ({ ...prev, city: val }))
                  }
                >
                  <SelectTrigger className="h-11 text-xs sm:text-sm bg-card">
                    <SelectValue placeholder="همه شهرها" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه شهرها</SelectItem>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Layout mode switcher */}
              <div className="hidden sm:flex items-center rounded-lg border border-border bg-card p-1">
                <Button
                  variant={layoutMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLayoutMode("grid")}
                  className="h-9 w-9 p-0"
                  title="نمایش شبکه‌ای"
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <Button
                  variant={layoutMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLayoutMode("list")}
                  className="h-9 w-9 p-0"
                  title="نمایش فهرستی"
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Tabs Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {PROJECT_CATEGORIES.map((cat) => {
              const active = filters.category === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, category: cat.key }))
                  }
                  className={`shrink-0 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active Filters Summary & Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>
                نمایش <strong>{filteredProjects.length.toLocaleString("fa-IR")}</strong> پروژه از مجموع {initialProjects.length.toLocaleString("fa-IR")} پروژه
              </span>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-7 text-xs text-destructive hover:bg-destructive/10 gap-1 px-2"
                >
                  <RotateCcw className="size-3" />
                  <span>حذف همه فیلترها ({activeFiltersCount.toLocaleString("fa-IR")})</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Projects Cards Container */}
        <div className="mt-6">
          {filteredProjects.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="هیچ پروژه‌ای با این مشخصات یافت نشد"
                description="عبارت جستجو یا فیلترهای انتخابی را تغییر دهید تا نتایج بیشتری نمایش داده شوند."
                action={
                  <Button variant="outline" onClick={resetFilters} className="gap-2">
                    <RotateCcw className="size-4" />
                    <span>بازنشانی فیلترها</span>
                  </Button>
                }
              />
            </div>
          ) : layoutMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  layoutMode="grid"
                  onQuickView={(p) => setQuickViewProject(p)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  layoutMode="list"
                  onQuickView={(p) => setQuickViewProject(p)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Project Quick View Dialog Modal */}
        <ProjectQuickViewModal
          project={quickViewProject}
          open={Boolean(quickViewProject)}
          onOpenChange={(open) => !open && setQuickViewProject(null)}
        />

        {/* Consultation Callout Banner */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-10 text-right">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                <Building2 className="size-4" />
                <span>همکاری با معماران، انبوه‌سازان و پیمانکاران سراسر کشور</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                آیا پروژه‌ای در دست اجرا دارید؟
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                تیم فنی صنایع سنگ سپنتا آماده ارائه مشاوره در زمینه انتخاب سنگ، برآورد متراژ، تهیه نقشه‌های برش، تولید اسلب‌های بوک‌مچ و ارسال نمونه سنگ رایگان به کارگاه شماست.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2 shadow-sm font-semibold">
                <Link href="/contact">
                  <PhoneCall className="size-4" />
                  <span>درخواست استعلام قیمت و مشاوره</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border">
                <Link href="/stones">
                  <span>مشاهده انبار سنگ‌ها</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
