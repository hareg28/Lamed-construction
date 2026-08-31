"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Tag, Newspaper } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import type { NewsPost } from "@/lib/seedData";

interface NewsCardProps {
  article: NewsPost;
  className?: string;
  index?: number;
}

export default function NewsCard({ article, className, index = 0 }: NewsCardProps) {
  const [imgError, setImgError] = useState(false);
  const initials = article.title
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group bg-white dark:bg-navy-900 rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-navy-800 hover:shadow-md transition-all duration-300 flex flex-col",
        className
      )}
    >
      <Link href={`/news/${article.id}`} className="block overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 dark:from-navy-800 dark:to-navy-900">
          {!imgError ? (
            <img
              src={article.coverImage}
              alt=""
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-navy-400">
              <Newspaper className="w-12 h-12 mb-2 opacity-40" />
              <span className="text-xl font-serif font-bold text-slate-600/60 dark:text-navy-300">
                {initials}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
              <Tag className="w-3 h-3" />
              {article.category}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {article.author && (
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-400 mb-3 font-semibold">
            <span>{article.author}</span>
          </div>
        )}

        <Link href={`/news/${article.id}`} className="block">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-3 font-serif leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {article.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-800 dark:text-slate-300 leading-relaxed mb-4 flex-1 line-clamp-3 font-medium">
          {article.excerpt}
        </p>

        <Link
          href={`/news/${article.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
        >
          Read More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}

