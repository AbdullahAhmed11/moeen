import type { ReactNode } from 'react'

type ChartCardProps = {
  title: string
  children: ReactNode
  className?: string
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <div
      className={[
        'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {children}
    </div>
  )
}
