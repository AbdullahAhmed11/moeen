import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
      className="relative flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
    >
      <Sun
        className={[
          'absolute size-[18px] transition-all duration-500',
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
        ].join(' ')}
        strokeWidth={2}
      />
      <Moon
        className={[
          'absolute size-[18px] transition-all duration-500',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
        ].join(' ')}
        strokeWidth={2}
      />
    </button>
  )
}
