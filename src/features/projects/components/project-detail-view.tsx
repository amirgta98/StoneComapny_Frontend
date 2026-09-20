"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  CalendarDays,
  Layers,
  Maximize2,
  User,
  Compass,
  ChevronLeft,
  Share2,
  CheckCircle2,
  Quote,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

import { Button, Badge } from "@/components/ui";
import { copyToClipboard } from "@/lib/clipboard";
import type { Project } from "../types";
import { ProjectCard } from "./project-card";

type ProjectDetailViewProps = {
  project: Project;
  relatedProjects: Project[];
};

export function ProjectDetailView({
  project,
  relatedProjects,
}: ProjectDetailViewProps) {
  const [activeImage, setActiveImage] = useState(project.image);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveImage(project.image);
  }, [project.id, project.image]);

  // Collect all images for the gallery strip
  const allImages = [
    { url: project.image, caption: project.imageAlt ?? project.title },
    ...(project.gallery || []),
  ];

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const success = await copyToClipboard(
        window.location.href,
        "لینک پروژه کپی شد",
        "خطا در کپی لینک پروژه"
      );
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div className="w-full bg-background pb-16 text-right">
      {/* Breadcrumb Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  خانه
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronLeft className="size-3.5" />
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-foreground transition-colors"
                >
                  پروژه‌های اجرایی
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronLeft className="size-3.5" />
              </li>
              <li
                aria-current="page"
                className="font-medium text-foreground truncate max-w-[200px] sm:max-w-md"
              >
                {project.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 pt-8 sm:px-6 lg:px-8">
        {/* Back Link & Share Action */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Link href="/projects">
              <ArrowRight className="size-4" />
              <span>بازگشت به همه پروژه‌ها</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs border-border"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-600" />
                <span className="text-emerald-600">کپی شد!</span>
              </>
            ) : (
              <>
                <Share2 className="size-3.5" />
                <span>اشتراک‌گذاری پروژه</span>
              </>
            )}
          </Button>
        </div>

        {/* Project Header */}
        <header className="max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary font-medium text-xs">
              {project.categoryTitle}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {project.stoneType}
            </Badge>
            {project.featured && (
              <Badge variant="default" className="text-xs">
                پروژه برگزیده
              </Badge>
            )}
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl text-foreground leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" />
              {project.location}
            </span>
            <span className="opacity-40">•</span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4 text-primary" />
              سال اتمام: {project.year}
            </span>
            <span className="opacity-40">•</span>
            <span className="flex items-center gap-1.5">
              <Maximize2 className="size-4 text-primary" />
              متراژ سنگ: {project.area}
            </span>
          </div>
        </header>

        {/* Gallery & Showcase Hero */}
        <div className="mt-8 space-y-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-md">
            <Image
              src={activeImage}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnails strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {allImages.map((img, idx) => {
                const isActive = activeImage === img.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img.url)}
                    className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      isActive
                        ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.caption || `نمای ${idx + 1}`}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Two-Column Layout: Project Details & Sidebar */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main Content (2 Columns) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Project Narrative */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">
                درباره معماری و اجرای سنگ این پروژه
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                {project.description}
              </p>
            </section>

            {/* Technical Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  <span>شاخصه‌های مهندسی و نکات فنی اجرا</span>
                </h3>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                      <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Stone Specifications Table */}
            {project.stoneDetails && project.stoneDetails.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Layers className="size-5 text-primary" />
                  <span>سنگ‌های طبیعی به کار رفته در این پروژه</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-right text-xs sm:text-sm">
                    <thead className="bg-muted/60 text-foreground font-semibold border-b border-border">
                      <tr>
                        <th className="p-3">نام سنگ</th>
                        <th className="p-3">نوع سورت</th>
                        <th className="p-3">نوع فرآوری و فینیش</th>
                        <th className="p-3">ضخامت</th>
                        <th className="p-3">خاستگاه معدن</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {project.stoneDetails.map((st, i) => (
                        <tr key={i} className="hover:bg-muted/30">
                          <td className="p-3 font-medium text-foreground">{st.name}</td>
                          <td className="p-3 text-muted-foreground">{st.type}</td>
                          <td className="p-3 text-muted-foreground">{st.finish}</td>
                          <td className="p-3 text-muted-foreground">{st.thickness}</td>
                          <td className="p-3 text-muted-foreground">{st.quarry ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Testimonial Quote */}
            {project.testimonial && (
              <section className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                <Quote className="size-8 text-primary/40 mb-3" />
                <blockquote className="text-sm sm:text-base font-medium text-foreground leading-relaxed italic">
                  «{project.testimonial.quote}»
                </blockquote>
                <div className="mt-4 border-t border-primary/20 pt-3">
                  <span className="block text-sm font-bold text-foreground">
                    {project.testimonial.author}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {project.testimonial.role}
                  </span>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar / Meta Specs Card (1 Column) */}
          <div className="space-y-6">
            {/* Quick Specs Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-foreground border-b border-border pb-3">
                اطلاعات شناسنامه پروژه
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <User className="size-4 text-primary" />
                    کارفرما / مالک:
                  </span>
                  <span className="font-semibold text-foreground text-left">
                    {project.client}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Compass className="size-4 text-primary" />
                    طراح و معمار:
                  </span>
                  <span className="font-semibold text-foreground text-left">
                    {project.architect ?? "طراحی مهندسی پروژه"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-4 text-primary" />
                    موقعیت اجرا:
                  </span>
                  <span className="font-semibold text-foreground text-left">
                    {project.location}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <CalendarDays className="size-4 text-primary" />
                    سال اجرا:
                  </span>
                  <span className="font-semibold text-foreground">
                    {project.year}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Maximize2 className="size-4 text-primary" />
                    مساحت کل سنگ:
                  </span>
                  <span className="font-semibold text-foreground">
                    {project.area}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Layers className="size-4 text-primary" />
                    نوع سنگ مصرفی:
                  </span>
                  <span className="font-semibold text-foreground">
                    {project.stoneType}
                  </span>
                </div>
              </div>

              {/* Consultation & Inquiry Action */}
              <div className="border-t border-border pt-5 space-y-3">
                <h4 className="text-xs font-bold text-foreground">
                  استعلام سنگ مشابه این پروژه
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  می‌توانید برای استعلام موجودی اسلب، قیمت متراژ یا سفارش ابعاد اختصاصی مستقیماً با کارشناسان فروش ما تماس حاصل فرمایید.
                </p>
                <Button asChild className="w-full gap-2 font-semibold">
                  <Link href="/contact">
                    <PhoneCall className="size-4" />
                    <span>درخواست مشاوره و قیمت</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full text-xs">
                  <Link href="/stones">
                    <span>مشاهده محصولات سنگ در انبار</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <section className="mt-20 border-t border-border pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                  پروژه‌های مرتبط دیگر
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  پروژه‌های اجرا شده با متریال یا کاربری مشابه
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                <Link href="/projects">
                  <span>مشاهده همه</span>
                  <ChevronLeft className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
