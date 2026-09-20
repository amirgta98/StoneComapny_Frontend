"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Layers,
  Maximize2,
  User,
  Compass,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Badge,
} from "@/components/ui";
import type { Project } from "../types";

type ProjectQuickViewModalProps = {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProjectQuickViewModal({
  project,
  open,
  onOpenChange,
}: ProjectQuickViewModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="text-right">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">
              {project.categoryTitle}
            </Badge>
            <Badge variant="outline" className="border-border">
              {project.stoneType}
            </Badge>
          </div>
          <DialogTitle className="mt-2 text-xl font-bold sm:text-2xl">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span>{project.location}</span>
            <span className="opacity-40">•</span>
            <Calendar className="size-4 shrink-0 text-primary" />
            <span>سال اجرا: {project.year}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Image Showcase */}
        <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={project.image}
            alt={project.imageAlt ?? project.title}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover"
          />
        </div>

        {/* Specs Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-right">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Maximize2 className="size-3.5 text-primary" />
              متراژ سنگ
            </span>
            <span className="mt-1 block text-sm font-bold text-foreground">
              {project.area}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-right">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="size-3.5 text-primary" />
              کارفرما
            </span>
            <span className="mt-1 block text-xs font-bold text-foreground truncate" title={project.client}>
              {project.client}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-right">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Compass className="size-3.5 text-primary" />
              طراح / معمار
            </span>
            <span className="mt-1 block text-xs font-bold text-foreground truncate" title={project.architect ?? "طراحی اختصاصی"}>
              {project.architect ?? "طراحی اختصاصی"}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-right">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Layers className="size-3.5 text-primary" />
              سنگ اصلی
            </span>
            <span className="mt-1 block text-xs font-bold text-foreground truncate" title={project.stoneType}>
              {project.stoneType}
            </span>
          </div>
        </div>

        {/* Narrative */}
        <div className="mt-5 space-y-3 text-right">
          <h4 className="text-sm font-bold text-foreground">شرح پروژه</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </div>

        {/* Key Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="mt-4 space-y-2 text-right">
            <h4 className="text-sm font-bold text-foreground">ویژگی‌های فنی و اجرایی</h4>
            <ul className="space-y-1.5">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center border-t border-border pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            بستن
          </Button>

          <div className="flex items-center gap-2">
            <Button asChild className="gap-2">
              <Link href={`/projects/${project.slug}`}>
                <span>مشاهده صفحه کامل پروژه</span>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
