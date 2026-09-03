"use client";

import { motion } from "framer-motion";
import { Newspaper, TrendingUp } from "lucide-react";
import { news } from "@/lib/seedData";
import NewsCard from "@/components/public/NewsCard";
import { Navbar, Footer } from "@/components/layout";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslation } from "@/lib/i18n";

export default function NewsPage() {
  const { language } = useLanguageStore();
  const t = useTranslation(language);

  return (
    <main className="min-h-screen bg-navy-50">
      <Navbar />

      <section className="relative bg-gradient-to-br from-navy-800 via-navy-900 to-navy-900 text-white pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16 lg:pb-20 sm:pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/assets/images/back_lamed.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-navy-900" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              Stay Updated
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-serif mb-4 sm:mb-6 leading-tight">
              {t.news.title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-navy-200 leading-relaxed max-w-2xl mx-auto">
              {t.news.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {news.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {news.length >= 1 && (
              <div className="mb-8 sm:mb-10 lg:mb-12">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-card border border-navy-100 overflow-hidden hover:shadow-card-hover transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden">
                      <img
                        src={news[0].coverImage}
                        alt={news[0].title}
                        className="w-full h-full object-cover lg:absolute lg:inset-0"
                      />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                        <span className="inline-flex items-center gap-1 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-lg">
                          {t.news.featured}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 sm:p-6 lg:p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3 sm:mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {news[0].category}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl lg:text-4xl font-extrabold text-slate-950 font-serif mb-3 sm:mb-4 leading-tight hover:text-emerald-600 transition-colors">
                        <a href={`/news/${news[0].id}`}>{news[0].title}</a>
                      </h2>
                      <p className="text-slate-800 mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base line-clamp-3 font-medium">
                        {news[0].excerpt}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-slate-900">
                              {news[0].author.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-950">
                              {news[0].author}
                            </div>
                            <div className="text-xs text-slate-600 font-semibold">Author</div>
                          </div>
                        </div>
                        <a
                          href={`/news/${news[0].id}`}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all sm:w-auto w-full"
                        >
                          {t.news.readArticle}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {news.slice(1).map((article, index) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-card border border-slate-200 p-10 sm:p-16 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Newspaper className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950 font-serif mb-3">
              No News Articles Yet
            </h3>
            <p className="text-slate-800 font-medium max-w-md mx-auto">
              Check back soon for the latest updates from Lamed Construction PLC.
            </p>
          </motion.div>
        )}
      </section>

      <Footer />
    </main>
  );
}
