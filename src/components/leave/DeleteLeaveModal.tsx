import { useTranslation } from 'react-i18next'
import type { LeaveRequest } from '../../types/leave'
import { Modal } from '../ui/Modal'

type DeleteLeaveModalProps = {
  open: boolean
  record: LeaveRequest | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteLeaveModal({ open, record, onClose, onConfirm }: DeleteLeaveModalProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  if (!record) return null

  const name = isArabic ? record.employeeNameAr : record.employeeName

  return (
    <Modal open={open} onClose={onClose} title={t('leave.delete.title')} size="sm">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {t('leave.delete.message', { name })}
      </p>
      <p className="mt-2 text-xs text-slate-500">{t('common.softDeleteWarning')}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          {t('common.cancel')}
        </button>
        <button type="button" onClick={onConfirm} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700">
          {t('leave.delete.confirm')}
        </button>
      </div>
    </Modal>
  )
}
