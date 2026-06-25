import { useTranslation } from 'react-i18next'
import type { Salary } from '../../types/salary'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { Modal } from '../ui/Modal'

type ViewSalaryModalProps = {
  open: boolean
  record: Salary | null
  onClose: () => void
}

function StatusBadge({ status }: { status: Salary['status'] }) {
  const { t } = useTranslation()

  const styles = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    approved: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status]].join(' ')}>
      {t(`salaries.status.${status}`)}
    </span>
  )
}

function formatMonth(month: string, locale: string) {
  const [year, monthNum] = month.split('-')
  const date = new Date(Number(year), Number(monthNum) - 1)
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function ViewSalaryModal({ open, record, onClose }: ViewSalaryModalProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  if (!record) return null

  const fields = [
    { label: t('salaries.table.id'), value: `#${record.id}` },
    {
      label: t('salaries.table.employee'),
      value: isArabic ? record.employeeNameAr : record.employeeName,
    },
    { label: t('salaries.table.month'), value: formatMonth(record.month, i18n.language) },
    {
      label: t('salaries.table.basicSalary'),
      value: formatCurrency(record.basicSalary, i18n.language),
    },
    {
      label: t('salaries.table.allowances'),
      value: formatCurrency(record.allowances, i18n.language),
    },
    {
      label: t('salaries.table.overtime'),
      value: formatCurrency(record.overtime, i18n.language),
    },
    {
      label: t('salaries.table.deductions'),
      value: formatCurrency(record.deductions, i18n.language),
    },
    {
      label: t('salaries.table.netSalary'),
      value: (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(record.netSalary, i18n.language)}
        </span>
      ),
    },
    {
      label: t('salaries.table.paymentDate'),
      value: formatDate(record.paymentDate, i18n.language),
    },
    { label: t('salaries.table.status'), value: <StatusBadge status={record.status} /> },
  ]

  return (
    <Modal open={open} onClose={onClose} title={t('salaries.view.title')} size="md">
      <div className="space-y-3">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex flex-col gap-1 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm text-slate-500 dark:text-slate-400">{field.label}</span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{field.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end border-t border-slate-200/80 pt-4 dark:border-slate-700/80">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {t('common.close')}
        </button>
      </div>
    </Modal>
  )
}
