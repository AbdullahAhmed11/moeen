import type { ReactNode } from 'react'

type MobileRecordCardProps = {
  title: string
  subtitle?: string
  badge?: ReactNode
  fields: { label: string; value: ReactNode }[]
  actions?: ReactNode
}

export function MobileRecordCard({
  title,
  subtitle,
  badge,
  fields,
  actions,
}: MobileRecordCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {badge}
      </div>

      <dl className="mt-3 grid gap-2">
        {fields.map((field) => (
          <div key={field.label} className="flex items-start justify-between gap-3 text-xs">
            <dt className="text-slate-500 dark:text-slate-400">{field.label}</dt>
            <dd className="text-end font-medium text-slate-800 dark:text-slate-200">{field.value}</dd>
          </div>
        ))}
      </dl>

      {actions && <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-700/80">{actions}</div>}
    </article>
  )
}
