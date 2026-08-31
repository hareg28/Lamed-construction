import { notFound } from "next/navigation";
import { news } from "@/lib/seedData";
import type { NewsPost } from "@/lib/seedData";
import NewsDetailClient from "./NewsDetailClient";

export function generateStaticParams() {
  return news.map((article) => ({
    id: article.id,
  }));
}

interface NewsDetailPageProps {
  params: { id: string };
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const article = news.find((a) => a.id === params.id) as NewsPost | undefined;

  if (!article) {
    notFound();
  }

  const relatedArticles = news
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  return <NewsDetailClient article={article} relatedArticles={relatedArticles} />;
}
