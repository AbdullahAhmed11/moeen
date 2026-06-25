import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getPageNumbers, getPaginationRange } from '../../utils/pagination'

export type PaginationProps = {
  page: number
  pageCount: number
  pageSize: number
  totalItems: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const defaultPageSizeOptions = [5, 10, 20, 50]

export function Pagination({
  page,
  pageCount,
  pageSize,
  totalItems,
  pageSizeOptions = defaultPageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const { t } = useTranslation()

  const currentPage = page + 1
  const { from, to } = getPaginationRange(page, pageSize, totalItems)
  const pages = getPageNumbers(currentPage, Math.max(pageCount, 1))

  const canPrevious = page > 0
  const canNext = page < pageCount - 1

  if (totalItems === 0) return null

  const navButtonClass =
    'inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400'

  const pageButtonClass = (active: boolean) =>
    [
      'inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-all',
      active
        ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
        : 'border border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
    ].join(' ')

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200/80 px-4 py-4 dark:border-slate-700/80 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('pagination.showing', { from, to, total: totalItems })}
        </p>

        <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="whitespace-nowrap">{t('pagination.rowsPerPage')}</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(0)}
          disabled={!canPrevious}
          aria-label={t('pagination.first')}
          className={navButtonClass}
        >
          <ChevronsLeft className="size-4 rtl:rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrevious}
          aria-label={t('pagination.previous')}
          className={navButtonClass}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </button>

        <div className="hidden items-center gap-0.5 px-1 sm:flex">
          {pages.map((pageNum, index) =>
            pageNum === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex size-9 items-center justify-center text-slate-400"
                aria-hidden
              >
                <MoreHorizontal className="size-4" />
              </span>
            ) : (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum - 1)}
                aria-label={t('pagination.page', { page: pageNum })}
                aria-current={pageNum === currentPage ? 'page' : undefined}
                className={pageButtonClass(pageNum === currentPage)}
              >
                {pageNum}
              </button>
            ),
          )}
        </div>

        <span className="px-2 text-sm text-slate-500 sm:hidden dark:text-slate-400">
          {t('pagination.pageOf', { current: currentPage, total: pageCount })}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          aria-label={t('pagination.next')}
          className={navButtonClass}
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(pageCount - 1)}
          disabled={!canNext}
          aria-label={t('pagination.last')}
          className={navButtonClass}
        >
          <ChevronsRight className="size-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  )
}
