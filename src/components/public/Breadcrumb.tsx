"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("w-full", className)}>
      <motion.ol
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm"
      >
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-700 font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1 sm:gap-2">
            <ChevronRight className="w-4 h-4 text-slate-500" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-slate-800 font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-950 font-bold truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </motion.ol>
    </nav>
  );
}
