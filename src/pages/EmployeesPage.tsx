import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DeleteEmployeeModal } from '../components/employees/DeleteEmployeeModal'
import { BlockEmployeeModal } from '../components/employees/BlockEmployeeModal'
import { RestoreEmployeeModal } from '../components/employees/RestoreEmployeeModal'
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal'
import { EmployeePayrollTable } from '../components/employees/EmployeePayrollTable'
import { ExportButtons } from '../components/ui/ExportButtons'
import { FilterSelect } from '../components/ui/FilterSelect'
import { TableFilters } from '../components/ui/TableFilters'
import { useEmployees } from '../context/EmployeesContext'
import { getEmployeesPayrollExportColumns } from '../export/columns'
import type { Employee, EmployeeInput } from '../types/employee'
import { buildDefaultPayrollData, buildPayrollRow } from '../utils/employeePayroll'
import { ALL_FILTER, hasActiveFilters } from '../utils/filters'
import { filterBySearch, tableSearchText } from '../utils/tableSearch'
import { EXPORT_IS_ARABIC, EXPORT_LOCALE, getExportTranslation } from '../utils/exportLocale'

export function EmployeesPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { employees, addEmployee, updateEmployee, deleteEmployee, restoreEmployee, blockEmployee, unblockEmployee } =
    useEmployees()
  const isArabic = i18n.language === 'ar'

  const [addOpen, setAddOpen] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
  const [deleteEmployeeTarget, setDeleteEmployeeTarget] = useState<Employee | null>(null)
  const [blockEmployeeTarget, setBlockEmployeeTarget] = useState<Employee | null>(null)
  const [restoreEmployeeTarget, setRestoreEmployeeTarget] = useState<Employee | null>(null)
  const [branchFilter, setBranchFilter] = useState(ALL_FILTER)
  const [administrationFilter, setAdministrationFilter] = useState(ALL_FILTER)
  const [penaltiesFilter, setPenaltiesFilter] = useState(ALL_FILTER)
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER)
  const [search, setSearch] = useState('')

  const branchOptions = useMemo(() => {
    const branches = new Map<string, { en: string; ar: string }>()
    employees.forEach((employee) => {
      const payroll = buildDefaultPayrollData(employee)
      branches.set(payroll.branch, { en: payroll.branch, ar: payroll.branchAr })
    })
    return Array.from(branches.entries()).map(([value, labels]) => ({
      value,
      label: isArabic ? labels.ar : labels.en,
    }))
  }, [employees, isArabic])

  const administrationOptions = useMemo(() => {
    const administrations = new Map<string, { en: string; ar: string }>()
    employees.forEach((employee) => {
      const payroll = buildDefaultPayrollData(employee)
      administrations.set(payroll.department, {
        en: payroll.department,
        ar: payroll.departmentAr,
      })
    })
    return Array.from(administrations.entries()).map(([value, labels]) => ({
      value,
      label: isArabic ? labels.ar : labels.en,
    }))
  }, [employees, isArabic])

  const filteredEmployees = useMemo(() => {
    const filtered = employees.filter((employee) => {
      const payroll = buildDefaultPayrollData(employee)
      if (branchFilter !== ALL_FILTER && payroll.branch !== branchFilter) return false
      if (administrationFilter !== ALL_FILTER && payroll.department !== administrationFilter) return false
      if (penaltiesFilter === 'with' && employee.penalties <= 0) return false
      if (penaltiesFilter === 'without' && employee.penalties > 0) return false
      if (statusFilter === 'active' && (employee.isDeleted || employee.isBlocked)) return false
      if (statusFilter === 'removed' && !employee.isDeleted) return false
      if (statusFilter === 'blocked' && !employee.isBlocked) return false
      if (statusFilter === 'removedOrBlocked' && !employee.isDeleted && !employee.isBlocked) return false
      return true
    })
    return filterBySearch(filtered, search, tableSearchText.employee)
  }, [employees, branchFilter, administrationFilter, penaltiesFilter, statusFilter, search])

  const payrollExportData = useMemo(
    () => filteredEmployees.map((employee, index) => buildPayrollRow(employee, index)),
    [filteredEmployees],
  )

  const exportColumns = useMemo(
    () => getEmployeesPayrollExportColumns(getExportTranslation(), EXPORT_IS_ARABIC, EXPORT_LOCALE),
    [],
  )

  const handleAdd = (input: EmployeeInput) => {
    addEmployee(input)
  }

  const handleEdit = (input: EmployeeInput) => {
    if (editEmployee) updateEmployee(editEmployee.id, input)
  }

  const handleDelete = () => {
    if (deleteEmployeeTarget) deleteEmployee(deleteEmployeeTarget.id)
  }

  const handleBlock = () => {
    if (!blockEmployeeTarget) return
    if (blockEmployeeTarget.isBlocked) {
      unblockEmployee(blockEmployeeTarget.id)
    } else {
      blockEmployee(blockEmployeeTarget.id)
    }
  }

  const handleRestore = () => {
    if (restoreEmployeeTarget) restoreEmployee(restoreEmployeeTarget.id)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('employees.total', { count: employees.length })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ExportButtons
              filename="employees-payroll"
              title={getExportTranslation()('nav.employees')}
              data={payrollExportData}
              columns={exportColumns}
            />
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              {t('employees.addNew')}
            </button>
          </div>
        </div>

        <TableFilters
          search={search}
          onSearchChange={setSearch}
          showClear={hasActiveFilters([branchFilter, administrationFilter, penaltiesFilter, statusFilter], search)}
          onClear={() => {
            setSearch('')
            setBranchFilter(ALL_FILTER)
            setAdministrationFilter(ALL_FILTER)
            setPenaltiesFilter(ALL_FILTER)
            setStatusFilter(ALL_FILTER)
          }}
        >
          <FilterSelect
            label={t('employees.payroll.cols.branch')}
            value={branchFilter}
            onChange={setBranchFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              ...branchOptions,
            ]}
          />
          <FilterSelect
            label={t('employees.payroll.cols.department')}
            value={administrationFilter}
            onChange={setAdministrationFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              ...administrationOptions,
            ]}
          />
          <FilterSelect
            label={t('filters.penalties')}
            value={penaltiesFilter}
            onChange={setPenaltiesFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              { value: 'with', label: t('filters.withPenalties') },
              { value: 'without', label: t('filters.withoutPenalties') },
            ]}
          />
          <FilterSelect
            label={t('filters.employeeStatus')}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              { value: 'active', label: t('filters.activeEmployees') },
              { value: 'removed', label: t('filters.removedEmployees') },
              { value: 'blocked', label: t('filters.blockedEmployees') },
              { value: 'removedOrBlocked', label: t('filters.removedOrBlockedEmployees') },
            ]}
          />
        </TableFilters>

        <EmployeePayrollTable
          employees={filteredEmployees}
          onView={(employee) => navigate(`/employees/${employee.id}`)}
          onEdit={setEditEmployee}
          onDelete={setDeleteEmployeeTarget}
          onBlock={setBlockEmployeeTarget}
          onRestore={setRestoreEmployeeTarget}
        />
      </div>

      <EmployeeFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <EmployeeFormModal
        open={!!editEmployee}
        mode="edit"
        employee={editEmployee ?? undefined}
        onClose={() => setEditEmployee(null)}
        onSubmit={handleEdit}
      />

      <DeleteEmployeeModal
        open={!!deleteEmployeeTarget}
        employee={deleteEmployeeTarget}
        onClose={() => setDeleteEmployeeTarget(null)}
        onConfirm={handleDelete}
      />

      <BlockEmployeeModal
        open={!!blockEmployeeTarget}
        employee={blockEmployeeTarget}
        onClose={() => setBlockEmployeeTarget(null)}
        onConfirm={handleBlock}
      />

      <RestoreEmployeeModal
        open={!!restoreEmployeeTarget}
        employee={restoreEmployeeTarget}
        onClose={() => setRestoreEmployeeTarget(null)}
        onConfirm={handleRestore}
      />
    </>
  )
}
