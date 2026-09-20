import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleDetailView,
  getArticleBySlug,
  getRelatedArticles,
  testArticles,
} from "@/features/learn";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "مقاله یافت نشد | صنایع سنگ سپنتا",
    };
  }

  return {
    title: `${article.title} | دانشنامه سنگ سپنتا`,
    description: article.excerpt.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.excerpt.slice(0, 160),
      images: [{ url: article.coverImage }],
    },
  };
}

export async function generateStaticParams() {
  return testArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, 3);

  return (
    <ArticleDetailView
      key={article.id}
      article={article}
      relatedArticles={relatedArticles}
    />
  );
}
