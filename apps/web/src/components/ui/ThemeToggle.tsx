'use client';

import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 border border-slate-200 bg-white hover:bg-slate-50 shadow-sm"
    >
      <span className="absolute inset-0 flex items-center justify-center transition-all duration-300">
        {theme === 'light' ? (
          <Moon className="w-4 h-4 text-slate-700" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
      </span>
    </button>
  );
}

