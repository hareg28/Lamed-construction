"use client";

import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  image?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export default function Timeline({ items, className }: TimelineProps) {
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className={cn("relative w-full", className)}>
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-emerald-400 transform md:-translate-x-1/2" />

      <div className="space-y-12">
        {sortedItems.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative flex flex-col md:flex-row items-start",
                isLeft ? "md:justify-start" : "md:justify-end"
              )}
            >
              <div
                className={cn(
                  "w-full md:w-[calc(50%-2.5rem)] pl-12 md:pl-0",
                  !isLeft && "md:text-left"
                )}
              >
                <div className="bg-white rounded-xl shadow-card border border-navy-100 p-5 sm:p-6 hover:shadow-card-hover transition-all duration-300">
                  <h4 className="text-lg font-bold text-navy-800 mb-3 font-serif">
                    {item.title}
                  </h4>
                  <p className="text-navy-600 text-sm leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                  {item.image && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-navy-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute left-4 md:left-1/2 top-6 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-md transform -translate-x-1/2 md:-translate-x-1/2 z-10" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
