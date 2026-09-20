"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Layers,
  Eye,
  ArrowLeft,
  Maximize2,
} from "lucide-react";

import { Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Project } from "../types";

type ProjectCardProps = {
  project: Project;
  onQuickView?: (project: Project) => void;
  layoutMode?: "grid" | "list";
  className?: string;
};

export function ProjectCard({
  project,
  onQuickView,
  layoutMode = "grid",
  className,
}: ProjectCardProps) {
  const detailHref = project.href || `/projects/${project.slug}`;

  if (layoutMode === "list") {
    return (
      <article
        className={cn(
          "group flex flex-col md:flex-row overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg",
          className
        )}
      >
        {/* Cover image */}
        <div className="relative aspect-[16/10] md:aspect-auto md:w-80 shrink-0 overflow-hidden bg-muted">
          <Image
            src={project.image}
            alt={project.imageAlt ?? project.title}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 z-10">
            <Badge className="bg-background/90 text-foreground backdrop-blur-sm shadow-sm border border-border/60 text-xs">
              {project.categoryTitle}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5 md:p-6 text-right">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" />
                {project.location}
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3.5 text-primary" />
                {project.year}
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1">
                <Maximize2 className="size-3.5 text-primary" />
                {project.area}
              </span>
            </div>

            <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
              <Link href={detailHref}>{project.title}</Link>
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {project.description}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-foreground/80 bg-muted/50 w-fit px-2.5 py-1 rounded-md">
              <Layers className="size-3.5 text-primary" />
              <span>سنگ: {project.stoneType}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
              کارفرما: {project.client}
            </span>

            <div className="flex items-center gap-2">
              {onQuickView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onQuickView(project)}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Eye className="size-3.5" />
                  <span>پیش‌نمایش سریع</span>
                </Button>
              )}
              <Button asChild size="sm" variant="outline" className="gap-1 text-xs">
                <Link href={detailHref}>
                  <span>مشاهده جزئیات</span>
                  <ArrowLeft className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg",
        className
      )}
    >
      {/* Cover image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={project.image}
          alt={project.imageAlt ?? project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Floating Top Badges */}
        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 z-10">
          <Badge className="bg-background/90 text-foreground backdrop-blur-sm shadow-sm border border-border/60 text-xs">
            {project.categoryTitle}
          </Badge>
          {project.featured && (
            <Badge variant="default" className="bg-primary text-primary-foreground text-xs shadow-sm">
              پروژه شاخص
            </Badge>
          )}
        </div>

        {/* Location & Year Overlays */}
        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white/90 z-10">
          <span className="flex items-center gap-1 font-medium drop-shadow-md">
            <MapPin className="size-3.5 text-primary-foreground" />
            {project.city}
          </span>
          <span className="flex items-center gap-1 font-medium drop-shadow-md">
            <CalendarDays className="size-3.5 text-primary-foreground" />
            {project.year}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 text-right">
        <div>
          <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary leading-snug line-clamp-2">
            <Link href={detailHref}>{project.title}</Link>
          </h3>

          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/60 p-2 rounded-lg">
            <Layers className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">{project.stoneType}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground px-1">
            <span className="flex items-center gap-1">
              <Maximize2 className="size-3" />
              مساحت: {project.area}
            </span>
            <span className="truncate max-w-[130px]" title={project.client}>
              {project.client}
            </span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
          {onQuickView ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onQuickView(project)}
              className="gap-1 text-xs text-muted-foreground hover:text-foreground h-8 px-2"
            >
              <Eye className="size-3.5" />
              <span>پیش‌نمایش</span>
            </Button>
          ) : (
            <div />
          )}

          <Button asChild size="sm" variant="outline" className="gap-1 text-xs h-8">
            <Link href={detailHref}>
              <span>مشاهده کامل</span>
              <ArrowLeft className="size-3" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
