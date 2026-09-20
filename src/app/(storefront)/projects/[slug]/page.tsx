import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ProjectDetailView,
  getProjectBySlug,
  getRelatedProjects,
  testProjects,
} from "@/features/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "پروژه یافت نشد | صنایع سنگ سپنتا",
    };
  }

  return {
    title: `${project.title} | صنایع سنگ سپنتا`,
    description: project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.description.slice(0, 160),
      images: [{ url: project.image }],
    },
  };
}

export async function generateStaticParams() {
  return testProjects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(slug, 3);

  return (
    <ProjectDetailView
      key={project.id}
      project={project}
      relatedProjects={relatedProjects}
    />
  );
}
