import type { Metadata } from "next";
import { ProjectsPageView, testProjects } from "@/features/projects";

export const metadata: Metadata = {
  title: "گالری پروژه‌های اجرا شده | صنایع سنگ سپنتا",
  description:
    "مجموعه پروژه‌های فاخر ساختمانی اجرا شده با سنگ‌های طبیعی مرمر، تراورتن، گرانیت و آنیکس صنایع سنگ سپنتا در سراسر ایران. مشاهده تصاویر، مشخصات فنی و جزئیات معماری.",
};

export default function ProjectsPage() {
  return <ProjectsPageView initialProjects={testProjects} />;
}
