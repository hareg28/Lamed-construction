"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Tag,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { news } from "@/lib/seedData";
import Breadcrumb from "@/components/public/Breadcrumb";
import NewsCard from "@/components/public/NewsCard";
import type { NewsPost } from "@/lib/seedData";
import { Navbar, Footer } from "@/components/layout";

export function generateStaticParams() {
  return news.map((article) => ({
    id: article.id,
  }));
}

interface NewsDetailPageProps {
  params: { id: string };
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const article = news.find((a) => a.id === params.id) as
    | NewsPost
    | undefined;

  if (!article) {
    notFound();
  }

  const relatedArticles = news
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-6">
        <Breadcrumb
          items={[
            { label: "News", href: "/news" },
            { label: article.title },
          ]}
        />
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
              <Tag className="w-3.5 h-3.5" />
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-serif mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pb-8 mb-10 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                <span className="text-base font-bold text-white">
                  {article.author.charAt(0)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-extrabold text-slate-950">
                    {article.author}
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-semibold">Author</div>
              </div>
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href,
                  });
                }
              }}
              className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm font-bold hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-card border border-navy-100 mb-10">
            <div className="relative aspect-[21/9]">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="prose prose-navy max-w-none"
        >
          <div className="bg-white rounded-3xl shadow-card border border-slate-200 p-6 sm:p-10 lg:p-14">
            <p className="text-xl text-slate-800 leading-relaxed font-semibold mb-8 pb-6 border-l-4 border-emerald-500 pl-6 italic">
              {article.excerpt}
            </p>

            {article.content.split("\n\n").map((paragraph: string, idx: number) => (
              <p
                key={idx}
                className="text-slate-800 leading-relaxed text-base sm:text-lg mb-5 last:mb-0 font-medium"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-900 font-bold hover:border-emerald-400 hover:bg-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All News
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {["Company", "Projects", "Industry", "Awards"].map((cat) => (
              <Link
                key={cat}
                href="/news"
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                #{cat}
              </Link>
            ))}
          </div>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-1 rounded-full bg-emerald-500" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 font-serif">
                Related Articles
              </h2>
              <div className="w-12 h-1 rounded-full bg-emerald-500" />
            </div>
            <p className="text-slate-800 font-medium max-w-2xl mx-auto">
              Continue reading more news, insights, and updates from Lamed
              Construction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {relatedArticles.map((relatedArticle, index) => (
              <NewsCard
                key={relatedArticle.id}
                article={relatedArticle}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
