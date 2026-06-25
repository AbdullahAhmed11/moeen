import { useTranslation } from 'react-i18next'
import type { Employee } from '../../types/employee'

type EmployeeStatusBadgesProps = {
  employee: Employee
}

export function EmployeeStatusBadges({ employee }: EmployeeStatusBadgesProps) {
  const { t } = useTranslation()

  if (!employee.isDeleted && !employee.isBlocked) return null

  return (
    <div className="mt-1 flex flex-wrap justify-center gap-1">
      {employee.isDeleted ? (
        <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
          {t('employees.badges.deleted')}
        </span>
      ) : null}
      {employee.isBlocked ? (
        <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
          {t('employees.badges.blocked')}
        </span>
      ) : null}
    </div>
  )
}
