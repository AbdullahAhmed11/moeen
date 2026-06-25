import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from '../locales/ar.json'
import en from '../locales/en.json'

export const languages = {
  en: { label: 'English', dir: 'ltr' as const },
  ar: { label: 'العربية', dir: 'rtl' as const },
} as const

export type Language = keyof typeof languages

const STORAGE_KEY = 'hr-language'

function getStoredLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'ar') return stored
  return 'en'
}

function applyDocumentLanguage(lang: Language) {
  const { dir } = languages[lang]
  document.documentElement.lang = lang
  document.documentElement.dir = dir
}

const initialLanguage = getStoredLanguage()
applyDocumentLanguage(initialLanguage)

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lang) => {
  if (lang === 'en' || lang === 'ar') {
    localStorage.setItem(STORAGE_KEY, lang)
    applyDocumentLanguage(lang)
  }
})

export default i18n
