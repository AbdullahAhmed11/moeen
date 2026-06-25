import { useTranslation } from 'react-i18next'
import type { Penalty } from '../../types/penalty'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { Modal } from '../ui/Modal'

type ViewPenaltyModalProps = {
  open: boolean
  record: Penalty | null
  onClose: () => void
}

function StatusBadge({ status }: { status: Penalty['status'] }) {
  const { t } = useTranslation()

  const styles = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    approved: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    applied: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status]].join(' ')}>
      {t(`penalties.status.${status}`)}
    </span>
  )
}

export function ViewPenaltyModal({ open, record, onClose }: ViewPenaltyModalProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  if (!record) return null

  const fields = [
    { label: t('penalties.table.id'), value: `#${record.id}` },
    {
      label: t('penalties.table.employee'),
      value: isArabic ? record.employeeNameAr : record.employeeName,
    },
    { label: t('penalties.table.date'), value: formatDate(record.date, i18n.language) },
    { label: t('penalties.table.type'), value: t(`penalties.type.${record.penaltyType}`) },
    {
      label: t('penalties.table.amount'),
      value:
        record.amount > 0
          ? formatCurrency(record.amount, i18n.language)
          : t('penalties.noAmount'),
    },
    {
      label: t('penalties.table.reason'),
      value: isArabic ? record.reasonAr : record.reason,
    },
    { label: t('penalties.table.status'), value: <StatusBadge status={record.status} /> },
  ]

  return (
    <Modal open={open} onClose={onClose} title={t('penalties.view.title')} size="md">
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
