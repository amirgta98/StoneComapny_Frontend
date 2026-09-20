import type {
  Project,
  ProjectCategoryKey,
  ProjectFilterState,
  ProjectStoneCategory,
} from "../types";
import { matchesSearchQuery } from "@/lib/search-normalization";
import { testProjects } from "../data/test-projects";

export const PROJECT_CATEGORIES: { key: ProjectCategoryKey; label: string }[] = [
  { key: "all", label: "همه پروژه‌ها" },
  { key: "facade", label: "نمای ساختمان" },
  { key: "lobby", label: "لابی و فضاهای لوکس" },
  { key: "floor", label: "کف و محوطه" },
  { key: "wall", label: "دیوار دکوراتیو و اسلب" },
  { key: "pool", label: "ویلا و استخر" },
  { key: "stairs", label: "پله و راه‌پله" },
];

export const PROJECT_STONE_CATEGORIES: {
  key: ProjectStoneCategory;
  label: string;
}[] = [
  { key: "all", label: "همه جنس‌های سنگ" },
  { key: "travertine", label: "تراورتن" },
  { key: "marble", label: "مرمر و چینی" },
  { key: "granite", label: "گرانیت" },
  { key: "onyx", label: "مرمر آنیکس (نورگذر)" },
  { key: "limestone", label: "لایم‌استون" },
  { key: "sandstone", label: "سنداستون" },
];

export function filterProjects(
  projects: Project[],
  filters: ProjectFilterState
): Project[] {
  return projects.filter((project) => {
    // 1. Category filter
    if (filters.category !== "all" && project.category !== filters.category) {
      return false;
    }

    // 2. Stone type filter
    if (
      filters.stoneCategory !== "all" &&
      project.stoneCategory !== filters.stoneCategory
    ) {
      return false;
    }

    // 3. City filter
    if (filters.city && filters.city !== "all" && project.city !== filters.city) {
      return false;
    }

    // 4. Normalized search needle vs haystack
    if (filters.query && filters.query.trim()) {
      const haystack = [
        project.title,
        project.stoneType,
        project.location,
        project.city,
        project.client,
        project.architect ?? "",
        project.description,
        project.categoryTitle,
        ...(project.highlights || []),
        ...(project.stoneDetails?.map((s) => `${s.name} ${s.type} ${s.finish} ${s.quarry ?? ""}`) || []),
      ].join(" ");

      if (!matchesSearchQuery(haystack, filters.query)) {
        return false;
      }
    }

    return true;
  });
}

export function getProjectBySlug(slug: string): Project | undefined {
  return testProjects.find(
    (p) => p.slug === slug || p.href?.endsWith(`/${slug}`)
  );
}

export function getRelatedProjects(
  currentSlug: string,
  limit: number = 3
): Project[] {
  const current = getProjectBySlug(currentSlug);
  if (!current) return testProjects.slice(0, limit);

  return testProjects
    .filter((p) => p.slug !== current.slug)
    .sort((a, b) => {
      // Prioritize same category or same stone type
      const scoreA =
        (a.category === current.category ? 2 : 0) +
        (a.stoneCategory === current.stoneCategory ? 1 : 0);
      const scoreB =
        (b.category === current.category ? 2 : 0) +
        (b.stoneCategory === current.stoneCategory ? 1 : 0);
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, limit);
}

export function calculateProjectStats(projects: Project[]) {
  const totalProjects = projects.length;
  const cities = new Set(projects.map((p) => p.city)).size;
  const stoneTypes = new Set(projects.map((p) => p.stoneCategory)).size;

  return {
    totalProjects,
    cities,
    stoneTypes,
  };
}
