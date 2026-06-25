import { useTranslation } from 'react-i18next'
import type { Shift } from '../../types/shift'
import { SHIFT_HOURS, formatTime } from '../../utils/shift'
import { Modal } from '../ui/Modal'

type ViewShiftModalProps = {
  open: boolean
  record: Shift | null
  onClose: () => void
}

function StatusBadge({ status }: { status: Shift['status'] }) {
  const { t } = useTranslation()

  const styles = {
    active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status]].join(' ')}>
      {t(`shifts.status.${status}`)}
    </span>
  )
}

export function ViewShiftModal({ open, record, onClose }: ViewShiftModalProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  if (!record) return null

  const fields = [
    { label: t('shifts.table.id'), value: `#${record.id}` },
    { label: t('shifts.table.name'), value: isArabic ? record.nameAr : record.name },
    {
      label: t('shifts.table.startTime'),
      value: formatTime(record.startTime, i18n.language),
    },
    {
      label: t('shifts.table.endTime'),
      value: formatTime(record.endTime, i18n.language),
    },
    {
      label: t('shifts.table.shiftHours'),
      value: t('shifts.hoursCount', { count: record.shiftHours || SHIFT_HOURS }),
    },
    {
      label: t('shifts.table.workingDays'),
      value: isArabic ? record.workingDaysAr : record.workingDays,
    },
    { label: t('shifts.table.status'), value: <StatusBadge status={record.status} /> },
  ]

  return (
    <Modal open={open} onClose={onClose} title={t('shifts.view.title')} size="md">
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
