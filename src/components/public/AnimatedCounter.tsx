'use client';

import { useEffect } from 'react';
import { useAnimate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: AnimatedCounterProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const node = scope.current;
    if (!node) return;

    let startTime: number | null = null;
    let rafId: number;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value);
      node.textContent = `${prefix}${current}${suffix}`;
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [value, suffix, prefix, duration, scope, animate]);

  return <span ref={scope} className={className}>{prefix}0{suffix}</span>;
}
