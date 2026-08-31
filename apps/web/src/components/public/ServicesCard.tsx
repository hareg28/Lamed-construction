'use client';

import { motion } from 'framer-motion';
import { LucideIcon, Hexagon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceItem {
  icon?: LucideIcon;
  title: string;
  description?: string;
  points?: string[];
}

interface ServicesCardProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  points?: string[];
  service?: ServiceItem;
  className?: string;
  index?: number;
}

export default function ServicesCard({
  icon,
  title,
  description,
  points,
  service,
  className = '',
  index = 0,
}: ServicesCardProps) {
  const itemTitle = title || service?.title || '';
  const itemDescription = description || service?.description || '';
  const itemPoints = points || service?.points || [];
  const FallbackIcon = icon || service?.icon || Hexagon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className={cn(
        'group bg-white dark:bg-navy-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-navy-800 flex flex-col justify-between',
        className
      )}
    >
      <div>
        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-navy-800 flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors duration-300">
          <FallbackIcon className="w-7 h-7 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors duration-300" />
        </div>
        {itemTitle && (
          <h3 className="font-serif text-xl md:text-2xl text-slate-950 dark:text-white font-extrabold mb-3">
            {itemTitle}
          </h3>
        )}
        {itemDescription && (
          <p className="text-slate-800 dark:text-slate-200 mb-4 leading-relaxed font-medium">{itemDescription}</p>
        )}
      </div>

      {itemPoints && itemPoints.length > 0 && (
        <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-navy-800/80 mt-auto">
          {itemPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-slate-900 dark:text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
              <span className="text-sm font-semibold">{point}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}


