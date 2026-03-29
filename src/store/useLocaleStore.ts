import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18next from 'i18next';

interface LocaleState {
  language: string;
  country: string | null;
  setLanguage: (lang: string) => void;
  setCountry: (country: string | null) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      language: 'en',
      country: null,

      setLanguage: (lang) => {
        i18next.changeLanguage(lang);
        set({ language: lang });
      },

      setCountry: (country) => {
        set({ country });
      },
    }),
    {
      name: 'qatrial:locale',
      onRehydrateStorage: () => (state) => {
        if (state?.language && state.language !== i18next.language) {
          i18next.changeLanguage(state.language);
        }
      },
    }
  )
);
