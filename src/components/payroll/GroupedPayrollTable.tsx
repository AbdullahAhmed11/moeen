import { flexRender, type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

type GroupedPayrollTableProps<T> = {
  table: Table<T>
  minWidth?: string
  getRowClassName?: (row: T) => string
}

export function GroupedPayrollTable<T>({
  table,
  minWidth = '1200px',
  getRowClassName,
}: GroupedPayrollTableProps<T>) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse text-xs"
          style={{ minWidth }}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup, rowIndex) => (
              <tr key={headerGroup.id} className="border-b border-slate-300/80">
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | { headerClassName?: string; groupHeaderClassName?: string }
                    | undefined
                  const className =
                    rowIndex === 0
                      ? meta?.groupHeaderClassName ?? meta?.headerClassName
                      : meta?.headerClassName

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={[
                        'border border-slate-300/60 px-2 py-2 text-center text-[11px] font-bold whitespace-nowrap',
                        className ?? 'bg-slate-50 dark:bg-slate-800',
                      ].join(' ')}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={[
                    'border-b border-slate-200 hover:bg-slate-50/80 dark:border-slate-700 dark:hover:bg-slate-800/40',
                    getRowClassName?.(row.original) ?? '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border border-slate-200/80 px-2 py-2 text-center whitespace-nowrap text-slate-700 dark:border-slate-700 dark:text-slate-300"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getAllLeafColumns().length}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  {t('pagination.noResults')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
