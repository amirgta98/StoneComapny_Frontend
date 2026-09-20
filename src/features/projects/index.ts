/**
 * Projects feature module.
 *
 * Manages the tenant's completed architectural stone projects portfolio
 * shown on the storefront (/projects and /projects/[slug]).
 */

export * from "./types";
export { testProjects } from "./data/test-projects";
export {
  filterProjects,
  getProjectBySlug,
  getRelatedProjects,
  calculateProjectStats,
  PROJECT_CATEGORIES,
  PROJECT_STONE_CATEGORIES,
} from "./lib/project-service";
export { ProjectCard } from "./components/project-card";
export { ProjectQuickViewModal } from "./components/project-quick-view-modal";
export { ProjectsPageView } from "./components/projects-page-view";
export { ProjectDetailView } from "./components/project-detail-view";