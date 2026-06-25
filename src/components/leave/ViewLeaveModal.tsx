import { useTranslation } from 'react-i18next'
import type { LeaveRequest } from '../../types/leave'
import { formatDate } from '../../utils/date'
import { Modal } from '../ui/Modal'

type ViewLeaveModalProps = {
  open: boolean
  record: LeaveRequest | null
  onClose: () => void
}

export function ViewLeaveModal({ open, record, onClose }: ViewLeaveModalProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  if (!record) return null

  const fields = [
    { label: t('leave.table.employee'), value: isArabic ? record.employeeNameAr : record.employeeName },
    { label: t('leave.table.type'), value: t(`leave.type.${record.leaveType}`) },
    { label: t('leave.table.startDate'), value: formatDate(record.startDate, i18n.language) },
    { label: t('leave.table.endDate'), value: formatDate(record.endDate, i18n.language) },
    { label: t('leave.table.days'), value: String(record.days) },
    { label: t('leave.table.status'), value: t(`leave.status.${record.status}`) },
    { label: t('leave.table.reason'), value: isArabic ? record.reasonAr : record.reason },
  ]

  return (
    <Modal open={open} onClose={onClose} title={t('leave.viewTitle')} size="md">
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.label} className="rounded-xl border border-slate-200/80 px-4 py-3 dark:border-slate-700/80">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {field.label}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{field.value}</p>
          </div>
        ))}
      </div>
    </Modal>
  )
}
