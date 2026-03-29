import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/common.json',
    },

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'qatrial:language',
      caches: ['localStorage'],
    },

    fallbackLng: {
      'en-US': ['en'],
      'en-CA': ['en'],
      'es-US': ['es'],
      'es-MX': ['es'],
      'fr-CA': ['fr'],
      default: ['en'],
    },

    ns: ['common'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
