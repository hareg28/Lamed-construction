import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-8 sm:mb-10 lg:mb-12',
        center && 'text-center mx-auto',
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-block text-xs sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-800 dark:text-emerald-400 mb-2 sm:mb-3',
            center && 'mx-auto'
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate-950 dark:text-white mb-3 sm:mb-4 leading-tight font-extrabold',
          center && 'mx-auto'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-slate-800 dark:text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-medium',
            center && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
      {center && (
        <div className="w-16 sm:w-20 h-1 bg-emerald-500 mx-auto mt-4 sm:mt-6 rounded-full" />
      )}
    </div>
  );
}

