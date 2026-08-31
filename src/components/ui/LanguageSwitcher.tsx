'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguageStore, LANGUAGE_LABELS, Language } from '@/store/languageStore';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGE_LABELS[language];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-all duration-200 shadow-sm text-xs sm:text-sm font-semibold"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 text-emerald-600" />
        <span className="hidden sm:inline text-slate-800 font-semibold">{current.short}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in py-1">
          {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => {
            const info = LANGUAGE_LABELS[lang];
            return (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 ${
                  language === lang
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                }`}
              >
                <span className="text-lg">{info.flag}</span>
                <div className="text-left">
                  <div className="font-semibold text-slate-800">{info.label}</div>
                  <div className="text-xs text-slate-500">{info.short}</div>
                </div>
                {language === lang && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

