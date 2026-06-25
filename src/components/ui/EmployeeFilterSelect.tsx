import { useTranslation } from 'react-i18next'
import { useEmployees } from '../../context/EmployeesContext'
import { FilterSelect } from './FilterSelect'

type EmployeeFilterSelectProps = {
  value: string
  onChange: (value: string) => void
}

export function EmployeeFilterSelect({ value, onChange }: EmployeeFilterSelectProps) {
  const { t, i18n } = useTranslation()
  const { employees } = useEmployees()
  const isArabic = i18n.language === 'ar'

  return (
    <FilterSelect
      label={t('filters.employee')}
      value={value}
      onChange={onChange}
      options={[
        { value: 'all', label: t('filters.all') },
        ...employees.map((employee) => ({
          value: String(employee.id),
          label: isArabic ? employee.nameAr : employee.name,
        })),
      ]}
    />
  )
}
