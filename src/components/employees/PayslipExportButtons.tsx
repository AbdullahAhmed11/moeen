import { FileSpreadsheet, FileText } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { EmployeePayrollRow } from '../../types/employeePayroll'
import { exportElementToPdf, exportToExcel } from '../../utils/export'
import {
  buildPayslipExportRow,
  getPayslipExportColumns,
  PAYSLIP_EXPORT_ELEMENT_ID,
} from '../../utils/payslipExport'
import { EXPORT_IS_ARABIC, getExportTranslation } from '../../utils/exportLocale'

type PayslipExportButtonsProps = {
  row: EmployeePayrollRow
  month: string
}

const buttonClassName =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300'

export function PayslipExportButtons({ row, month }: PayslipExportButtonsProps) {
  const { t, i18n } = useTranslation()
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null)
  const isArabic = i18n.language === 'ar'

  const exportT = getExportTranslation()
  const exportData = useMemo(
    () => [buildPayslipExportRow(row, month, EXPORT_IS_ARABIC)],
    [row, month, exportT],
  )
  const exportColumns = useMemo(() => getPayslipExportColumns(exportT), [exportT])

  const employeeName = isArabic ? row.employee.nameAr : row.employee.name
  const filename = `payslip-${employeeName.replace(/\s+/g, '-')}-${month}`
  const title = `${exportT('employees.payslip.exportTitle')} - ${employeeName}`

  const handlePdfExport = async () => {
    if (exporting) return
    const element = document.getElementById(PAYSLIP_EXPORT_ELEMENT_ID)
    if (!element) return

    setExporting('pdf')
    try {
      await exportElementToPdf(element, title, filename)
    } finally {
      setExporting(null)
    }
  }

  const handleExcelExport = () => {
    if (exporting) return
    setExporting('excel')
    try {
      exportToExcel(filename, exportData, exportColumns)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handlePdfExport}
        disabled={!!exporting}
        className={[buttonClassName, exporting ? 'cursor-not-allowed opacity-50' : ''].join(' ')}
      >
        <FileText className="size-4" strokeWidth={2} />
        {t('export.pdf')}
      </button>
      <button
        type="button"
        onClick={handleExcelExport}
        disabled={!!exporting}
        className={[buttonClassName, exporting ? 'cursor-not-allowed opacity-50' : ''].join(' ')}
      >
        <FileSpreadsheet className="size-4" strokeWidth={2} />
        {t('export.excel')}
      </button>
    </div>
  )
}
