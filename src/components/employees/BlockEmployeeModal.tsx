import { Ban } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../ui/Modal'
import type { Employee } from '../../types/employee'

type BlockEmployeeModalProps = {
  open: boolean
  employee: Employee | null
  onClose: () => void
  onConfirm: () => void
}

export function BlockEmployeeModal({
  open,
  employee,
  onClose,
  onConfirm,
}: BlockEmployeeModalProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  if (!employee) return null

  const displayName = isArabic ? employee.nameAr : employee.name
  const isBlocked = employee.isBlocked

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t(isBlocked ? 'employees.block.unblockTitle' : 'employees.block.title')}
      size="sm"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10">
          <Ban className="size-7 text-amber-600" strokeWidth={2} />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t(isBlocked ? 'employees.block.unblockMessage' : 'employees.block.message', {
            name: displayName,
          })}
        </p>
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
          className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
        >
          {t(isBlocked ? 'employees.block.unblockConfirm' : 'employees.block.confirm')}
        </button>
      </div>
    </Modal>
  )
}
