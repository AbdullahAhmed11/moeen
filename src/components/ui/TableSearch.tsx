import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type TableSearchProps = {
  value: string
  onChange: (value: string) => void
}

export function TableSearch({ value, onChange }: TableSearchProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full min-w-[200px] flex-1 sm:max-w-xs">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t('filters.search')}
        </span>
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('filters.searchPlaceholder')}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 ps-9 pe-9 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label={t('filters.clearSearch')}
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </label>
    </div>
  )
}
