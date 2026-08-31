"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  className?: string;
  index?: number;
}

export default function ProjectCard({
  project,
  className,
  index = 0,
}: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);
  const initials = project.title
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
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        "group bg-white dark:bg-navy-900 rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-navy-800 hover:shadow-md transition-all duration-300 flex flex-col",
        className
      )}
    >
      <Link href={`/projects/${project.id}`} className="block overflow-hidden relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 dark:from-navy-800 dark:to-navy-900">
          {!imgError ? (
            <img
              src={project.coverImage}
              alt=""
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-navy-400">
              <Building2 className="w-16 h-16 mb-2 opacity-40" />
              <span className="text-2xl font-serif font-bold text-slate-600/60 dark:text-navy-300">
                {initials}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 via-transparent to-transparent opacity-70 pointer-events-none" />

        </div>
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <Link href={`/projects/${project.id}`} className="block">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2 font-serif leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {project.title}
          </h3>
        </Link>

        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-300">{project.location}</span>
        </div>

        <p className="text-sm text-slate-800 dark:text-slate-300 leading-relaxed mb-4 flex-1 line-clamp-2 font-medium">
          {project.shortDescription}
        </p>

        <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-navy-800">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 group-hover:gap-3"
          >
            View
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

