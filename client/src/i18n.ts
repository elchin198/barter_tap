import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Helper function to set HTML lang attribute and other language-specific settings
const setHtmlLang = (lng: string): void => {
  document.documentElement.lang = lng;

  // Set direction attribute for right-to-left languages if needed
  document.documentElement.dir = ['ar', 'he', 'fa', 'ur'].includes(lng) ? 'rtl' : 'ltr';

  // Apply language-specific body class (useful for CSS styling based on language)
  document.body.className = document.body.className
    .replace(/lang-\w+/g, '')
    .concat(` lang-${lng}`);
};

// Define default namespace to use
const defaultNS = 'translation';

// i18n initialization
i18n
  // Load translations using HTTP
  .use(HttpBackend)
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    defaultNS,
    ns: [defaultNS],
    initAsync: true,
    fallbackLng: 'az',
    fallbackNS: defaultNS,
    debug: process.env.NODE_ENV === 'development',
    load: 'currentOnly', // only load the current language, not all
    supportedLngs: ['az', 'ru', 'en'],

    // Language detection options - stronger language persistence
    detection: {
      order: ['localStorage', 'navigator'], // Added navigator as fallback
      lookupLocalStorage: 'i18nextLng',
      lookupQuerystring: 'lng',
      caches: ['localStorage'],
      cookieMinutes: 525600, // 1 year
    },

    // Configure backend for loading translations from locales folder (or locally from src/locales for development)
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'no-store', // Force reload translations on language change
      },
      reloadInterval: 0, // Force reload translations on each request
      allowMultiLoading: true, // Allow multiple language loading
    },

    // React does not need escaping
    interpolation: {
      escapeValue: false,
    },

    // Added configuration to ensure translations are loaded for all namespaces
    partialBundledLanguages: false,

    // Ensure translations are also loaded for plurals
    pluralSeparator: '_',
    keySeparator: '.',

    // Force reload when language changes
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      nsMode: 'default'
    },

    // Ensure missing translations are handled properly (for debugging)
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      console.warn(`i18next missingKey: ${lng}:${ns}:${key} - fallback: ${fallbackValue}`);
    }
  });

// Set the HTML lang attribute whenever language changes
i18n.on('languageChanged', (lng) => {
  setHtmlLang(lng);

  // Store the language preference
  localStorage.setItem('i18nextLng', lng);

  // Reload necessary resources (not the whole page) to ensure correct translations
  // This is done in the LanguageSwitcher component now with a full page reload
  // But we can add more fine-grained control here in the future
});

// Set initial HTML lang attribute and ensure consistent language
const currentLanguage = localStorage.getItem('i18nextLng') || 'az'; // Default to Azerbaijani if not set
localStorage.setItem('i18nextLng', currentLanguage); // Ensure it's stored
i18n.changeLanguage(currentLanguage); // Force the language to match what's in localStorage
setHtmlLang(currentLanguage);

// Add a handler to ensure translations are loaded correctly
i18n.on('initialized', () => {
  // console.log('i18next initialized successfully');
});

export default i18n;