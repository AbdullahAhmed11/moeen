import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { languages, type Language } from '../i18n'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const current = (i18n.language === 'ar' ? 'ar' : 'en') as Language

  const toggleLanguage = () => {
    const next: Language = current === 'en' ? 'ar' : 'en'
    void i18n.changeLanguage(next)
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t('language.label')}
      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
    >
      <Globe className="size-4 shrink-0 text-indigo-500 dark:text-indigo-400" strokeWidth={2} />
      <span className="hidden sm:inline">{languages[current === 'en' ? 'ar' : 'en'].label}</span>
      <span className="sm:hidden">{current === 'en' ? 'AR' : 'EN'}</span>
    </button>
  )
}
