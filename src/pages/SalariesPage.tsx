import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteSalaryModal } from '../components/salaries/DeleteSalaryModal'
import { SalaryFormModal } from '../components/salaries/SalaryFormModal'
import { SalaryPayrollTable } from '../components/salaries/SalaryPayrollTable'
import { ViewSalaryModal } from '../components/salaries/ViewSalaryModal'
import { ExportButtons } from '../components/ui/ExportButtons'
import { FilterSelect } from '../components/ui/FilterSelect'
import { TableFilters } from '../components/ui/TableFilters'
import { useEmployees } from '../context/EmployeesContext'
import { initialSalaries } from '../data/salaries'
import { getSalariesPayrollExportColumns } from '../export/columns'
import type { Salary, SalaryInput } from '../types/salary'
import type { SalaryPayrollTableRow } from '../types/salaryPayroll'
import { formatCurrency } from '../utils/currency'
import { buildPayrollRow } from '../utils/employeePayroll'
import { ALL_FILTER, hasActiveFilters } from '../utils/filters'
import { softDeleteById } from '../utils/softDelete'
import { EmployeeFilterSelect } from '../components/ui/EmployeeFilterSelect'
import { filterBySearch, tableSearchText } from '../utils/tableSearch'
import { EXPORT_IS_ARABIC, EXPORT_LOCALE, getExportTranslation } from '../utils/exportLocale'

function formatMonth(month: string, locale: string) {
  const [year, monthNum] = month.split('-')
  const date = new Date(Number(year), Number(monthNum) - 1)
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function SalariesPage() {
  const { t, i18n } = useTranslation()
  const { employees } = useEmployees()

  const [records, setRecords] = useState(initialSalaries)
  const [addOpen, setAddOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<Salary | null>(null)
  const [editRecord, setEditRecord] = useState<Salary | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<Salary | null>(null)
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER)
  const [monthFilter, setMonthFilter] = useState(ALL_FILTER)
  const [employeeFilter, setEmployeeFilter] = useState(ALL_FILTER)
  const [search, setSearch] = useState('')

  const monthOptions = useMemo(() => {
    const months = [...new Set(records.map((record) => record.month))].sort().reverse()
    return months.map((month) => ({
      value: month,
      label: formatMonth(month, i18n.language),
    }))
  }, [records, i18n.language])

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((record) => {
      if (record.isDeleted) return false
      if (statusFilter !== ALL_FILTER && record.status !== statusFilter) return false
      if (monthFilter !== ALL_FILTER && record.month !== monthFilter) return false
      if (employeeFilter !== ALL_FILTER && record.employeeId !== Number(employeeFilter)) return false
      return true
    })
    return filterBySearch(filtered, search, tableSearchText.salary)
  }, [records, statusFilter, monthFilter, employeeFilter, search])

  const payrollRows = useMemo(() => {
    return filteredRecords
      .map((salary, index) => {
        const employee = employees.find((item) => item.id === salary.employeeId)
        if (!employee) return null
        return { ...buildPayrollRow(employee, index), salary } satisfies SalaryPayrollTableRow
      })
      .filter((row): row is SalaryPayrollTableRow => row !== null)
  }, [filteredRecords, employees])

  const exportColumns = useMemo(
    () => getSalariesPayrollExportColumns(getExportTranslation(), EXPORT_IS_ARABIC, EXPORT_LOCALE),
    [],
  )

  const totalNet = records.filter((r) => !r.isDeleted && r.status === 'paid').reduce((sum, r) => sum + r.netSalary, 0)
  const pendingCount = records.filter((r) => !r.isDeleted && r.status === 'pending').length
  const paidCount = records.filter((r) => !r.isDeleted && r.status === 'paid').length

  const handleAdd = (input: SalaryInput) => {
    setRecords((prev) => [...prev, { id: Date.now(), ...input, isDeleted: false }])
  }

  const handleEdit = (input: SalaryInput) => {
    if (!editRecord) return
    setRecords((prev) =>
      prev.map((r) => (r.id === editRecord.id ? { id: editRecord.id, ...input, isDeleted: r.isDeleted } : r)),
    )
  }

  const handleDelete = () => {
    if (!deleteRecord) return
    setRecords((prev) => softDeleteById(prev, deleteRecord.id))
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label={t('salaries.stats.total')} value={records.length} />
          <StatCard
            label={t('salaries.stats.totalPaid')}
            value={formatCurrency(totalNet, i18n.language)}
            isText
            className="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label={t('salaries.stats.paid')}
            value={paidCount}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('salaries.total', { count: records.length, pending: pendingCount })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ExportButtons
              filename="salaries-payroll"
              title={getExportTranslation()('nav.salaries')}
              data={payrollRows}
              columns={exportColumns}
            />
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              {t('salaries.addNew')}
            </button>
          </div>
        </div>

        <TableFilters
          search={search}
          onSearchChange={setSearch}
          showClear={hasActiveFilters([statusFilter, monthFilter, employeeFilter], search)}
          onClear={() => {
            setSearch('')
            setStatusFilter(ALL_FILTER)
            setMonthFilter(ALL_FILTER)
            setEmployeeFilter(ALL_FILTER)
          }}
        >
          <FilterSelect
            label={t('filters.status')}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              { value: 'pending', label: t('salaries.status.pending') },
              { value: 'approved', label: t('salaries.status.approved') },
              { value: 'paid', label: t('salaries.status.paid') },
              { value: 'cancelled', label: t('salaries.status.cancelled') },
            ]}
          />
          <FilterSelect
            label={t('filters.month')}
            value={monthFilter}
            onChange={setMonthFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              ...monthOptions,
            ]}
          />
          <EmployeeFilterSelect value={employeeFilter} onChange={setEmployeeFilter} />
        </TableFilters>

        <SalaryPayrollTable
          rows={payrollRows}
          onView={setViewRecord}
          onEdit={setEditRecord}
          onDelete={setDeleteRecord}
        />
      </div>

      <SalaryFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <SalaryFormModal
        open={!!editRecord}
        mode="edit"
        record={editRecord ?? undefined}
        onClose={() => setEditRecord(null)}
        onSubmit={handleEdit}
      />

      <ViewSalaryModal
        open={!!viewRecord}
        record={viewRecord}
        onClose={() => setViewRecord(null)}
      />

      <DeleteSalaryModal
        open={!!deleteRecord}
        record={deleteRecord}
        onClose={() => setDeleteRecord(null)}
        onConfirm={handleDelete}
      />
    </>
  )
}

function StatCard({
  label,
  value,
  className,
  isText,
}: {
  label: string
  value: number | string
  className?: string
  isText?: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p
        className={[
          'mt-1 font-bold text-slate-900 dark:text-slate-100',
          isText ? 'text-xl' : 'text-2xl',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </p>
    </div>
  )
}
