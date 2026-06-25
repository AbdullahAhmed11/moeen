import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { EmployeeRegistration } from '../../types/employeeRegistration'
import { Modal } from '../ui/Modal'

type DeleteEmployeeRegistrationModalProps = {
  open: boolean
  record: EmployeeRegistration | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteEmployeeRegistrationModal({
  open,
  record,
  onClose,
  onConfirm,
}: DeleteEmployeeRegistrationModalProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  if (!record) return null

  const displayName = isArabic ? record.employeeNameAr : record.employeeName

  return (
    <Modal open={open} onClose={onClose} title={t('employeeRegistration.delete.title')} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
          <AlertTriangle className="size-7 text-red-500" strokeWidth={2} />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('employeeRegistration.delete.message', { name: displayName })}
        </p>
        <p className="mt-2 text-xs text-slate-500">{t('common.softDeleteWarning')}</p>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t border-slate-200/80 pt-4 dark:border-slate-700/80">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {t('common.cancel')}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          {t('employeeRegistration.delete.confirm')}
        </button>
      </div>
    </Modal>
  )
}
