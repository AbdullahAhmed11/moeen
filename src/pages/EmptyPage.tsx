import { Construction } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavKey } from '../routes/nav'

type EmptyPageProps = {
  pageKey: NavKey
}

export function EmptyPage({ pageKey }: EmptyPageProps) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white p-8 text-center transition-colors duration-300 dark:border-slate-700/80 dark:bg-slate-900">
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10">
        <Construction className="size-8 text-indigo-500 dark:text-indigo-400" strokeWidth={1.75} />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        {t(`nav.${pageKey}`)}
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {t('pages.emptyDescription')}
      </p>
    </div>
  )
}
