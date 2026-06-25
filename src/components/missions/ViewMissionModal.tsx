import { useTranslation } from 'react-i18next'
import type { Mission } from '../../types/mission'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { Modal } from '../ui/Modal'

type ViewMissionModalProps = {
  open: boolean
  record: Mission | null
  onClose: () => void
}

function StatusBadge({ status }: { status: Mission['status'] }) {
  const { t } = useTranslation()

  const styles = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    approved: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    in_progress: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
    completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status]].join(' ')}>
      {t(`missions.status.${status}`)}
    </span>
  )
}

export function ViewMissionModal({ open, record, onClose }: ViewMissionModalProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  if (!record) return null

  const fields = [
    { label: t('missions.table.id'), value: `#${record.id}` },
    {
      label: t('missions.table.employee'),
      value: isArabic ? record.employeeNameAr : record.employeeName,
    },
    {
      label: t('missions.table.destination'),
      value: isArabic ? record.destinationAr : record.destination,
    },
    {
      label: t('missions.table.purpose'),
      value: isArabic ? record.purposeAr : record.purpose,
    },
    { label: t('missions.table.startDate'), value: formatDate(record.startDate, i18n.language) },
    { label: t('missions.table.endDate'), value: formatDate(record.endDate, i18n.language) },
    { label: t('missions.table.missionDays'), value: t('missions.daysCount', { count: record.missionDays }) },
    {
      label: t('missions.table.allowance'),
      value: formatCurrency(record.allowance, i18n.language),
    },
    { label: t('missions.table.status'), value: <StatusBadge status={record.status} /> },
  ]

  return (
    <Modal open={open} onClose={onClose} title={t('missions.view.title')} size="md">
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
