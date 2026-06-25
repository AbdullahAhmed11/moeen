import { FileSpreadsheet, FileText } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ExportColumn } from '../../types/export'
import { exportToExcel, exportToPdf } from '../../utils/export'

type ExportButtonsProps<T> = {
  filename: string
  title: string
  data: T[]
  columns: ExportColumn<T>[]
}

const buttonClassName =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300'

export function ExportButtons<T>({ filename, title, data, columns }: ExportButtonsProps<T>) {
  const { t } = useTranslation()
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null)

  const handleExport = async (type: 'pdf' | 'excel') => {
    if (data.length === 0 || exporting) return
    setExporting(type)
    try {
      if (type === 'pdf') {
        await exportToPdf(title, filename, data, columns)
        return
      }
      exportToExcel(filename, data, columns)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => handleExport('pdf')}
        disabled={data.length === 0 || !!exporting}
        className={[buttonClassName, data.length === 0 ? 'cursor-not-allowed opacity-50' : ''].join(' ')}
      >
        <FileText className="size-4" strokeWidth={2} />
        {t('export.pdf')}
      </button>
      <button
        type="button"
        onClick={() => handleExport('excel')}
        disabled={data.length === 0 || !!exporting}
        className={[buttonClassName, data.length === 0 ? 'cursor-not-allowed opacity-50' : ''].join(' ')}
      >
        <FileSpreadsheet className="size-4" strokeWidth={2} />
        {t('export.excel')}
      </button>
    </div>
  )
}
