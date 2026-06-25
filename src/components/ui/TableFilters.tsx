import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { TableSearch } from './TableSearch'

type TableFiltersProps = {
  children: ReactNode
  onClear?: () => void
  showClear?: boolean
  search?: string
  onSearchChange?: (value: string) => void
}

export function TableFilters({
  children,
  onClear,
  showClear,
  search,
  onSearchChange,
}: TableFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
      {onSearchChange && (
        <TableSearch value={search ?? ''} onChange={onSearchChange} />
      )}
      {children}
      {showClear && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <X className="size-4" strokeWidth={2} />
          {t('filters.clear')}
        </button>
      )}
    </div>
  )
}
