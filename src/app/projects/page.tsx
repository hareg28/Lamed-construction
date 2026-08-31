"use client";

import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { projects } from "@/lib/seedData";
import ProjectCard from "@/components/public/ProjectCard";
import { Navbar, Footer } from "@/components/layout";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslation } from "@/lib/i18n";

export default function ProjectsPage() {
  const { language } = useLanguageStore();
  const t = useTranslation(language);

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <section className="relative bg-navy-950 text-white pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16 lg:pb-20 overflow-hidden border-b border-navy-800">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "url(/assets/images/back%20image2.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-semibold mb-6 shadow-lg backdrop-blur-sm">
              <LayoutGrid className="w-4 h-4" />
              {projects.length} {t.filters.projects}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-serif mb-4 sm:mb-6 leading-tight text-white drop-shadow-md">
              {t.sections.ourProjects.split(" ")[0]}{" "}
              <span className="text-emerald-400">
                {t.sections.ourProjects.split(" ").slice(1).join(" ") || "Projects"}
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto font-medium">
              Explore our portfolio of exceptional construction projects across
              residential, commercial, heritage, and mixed-use developments.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-navy-800 p-10 sm:p-16 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center">
              <LayoutGrid className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950 dark:text-white font-serif mb-3">
              No Projects Found
            </h3>
            <p className="text-slate-800 dark:text-slate-300 font-medium mb-6 max-w-md mx-auto">
              We couldn&apos;t find any projects matching your current filters.
            </p>
            <button
              onClick={() => {
                setStatusFilter("all");
                setTypeFilter("all");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-md"
            >
              {t.filters.reset}
            </button>
          </motion.div>
        )}
      </section>

      <Footer />
    </main>
  );
}
