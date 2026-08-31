import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'am' | 'or';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'lamed-lang',
    }
  )
);

export const LANGUAGE_LABELS: Record<Language, { label: string; short: string; flag: string }> = {
  en: { label: 'English', short: 'EN', flag: '🇬🇧' },
  am: { label: 'አማርኛ', short: 'አማ', flag: '🇪🇹' },
  or: { label: 'Afan Oromo', short: 'ORM', flag: '🇪🇹' },
};
