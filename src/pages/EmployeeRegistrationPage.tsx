import { createColumnHelper } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteEmployeeRegistrationModal } from '../components/employeeRegistration/DeleteEmployeeRegistrationModal'
import { EmployeeRegistrationFormModal } from '../components/employeeRegistration/EmployeeRegistrationFormModal'
import { ViewEmployeeRegistrationModal } from '../components/employeeRegistration/ViewEmployeeRegistrationModal'
import { DataTable } from '../components/ui/DataTable'
import { EmployeeFilterSelect } from '../components/ui/EmployeeFilterSelect'
import { ExportButtons } from '../components/ui/ExportButtons'
import { FilterSelect } from '../components/ui/FilterSelect'
import { TableFilters } from '../components/ui/TableFilters'
import { initialEmployeeRegistrations } from '../data/employeeRegistrations'
import { getEmployeeRegistrationExportColumns } from '../export/columns'
import type { EmployeeRegistration, EmployeeRegistrationInput } from '../types/employeeRegistration'
import { formatDate } from '../utils/date'
import { ALL_FILTER, hasActiveFilters } from '../utils/filters'
import { softDeleteById } from '../utils/softDelete'
import { filterBySearch, tableSearchText } from '../utils/tableSearch'
import { EXPORT_IS_ARABIC, EXPORT_LOCALE, getExportTranslation } from '../utils/exportLocale'

const columnHelper = createColumnHelper<EmployeeRegistration>()

function StatusBadge({ status }: { status: EmployeeRegistration['status'] }) {
  const { t } = useTranslation()

  const styles = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    suspended: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
    terminated: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status]].join(' ')}>
      {t(`employeeRegistration.status.${status}`)}
    </span>
  )
}

export function EmployeeRegistrationPage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [records, setRecords] = useState(initialEmployeeRegistrations)
  const [addOpen, setAddOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<EmployeeRegistration | null>(null)
  const [editRecord, setEditRecord] = useState<EmployeeRegistration | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<EmployeeRegistration | null>(null)
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER)
  const [contractFilter, setContractFilter] = useState(ALL_FILTER)
  const [employeeFilter, setEmployeeFilter] = useState(ALL_FILTER)
  const [search, setSearch] = useState('')

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((record) => {
      if (record.isDeleted) return false
      if (statusFilter !== ALL_FILTER && record.status !== statusFilter) return false
      if (contractFilter !== ALL_FILTER && record.contractType !== contractFilter) return false
      if (employeeFilter !== ALL_FILTER && record.employeeId !== Number(employeeFilter)) return false
      return true
    })
    return filterBySearch(filtered, search, tableSearchText.employeeRegistration)
  }, [records, statusFilter, contractFilter, employeeFilter, search])

  const exportColumns = useMemo(
    () => getEmployeeRegistrationExportColumns(getExportTranslation(), EXPORT_IS_ARABIC, EXPORT_LOCALE),
    [getExportTranslation],
  )

  const activeCount = records.filter((r) => !r.isDeleted && r.status === 'active').length
  const pendingCount = records.filter((r) => !r.isDeleted && r.status === 'pending').length

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: () => t('employeeRegistration.table.id'),
        cell: (info) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">#{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'employee',
        header: () => t('employeeRegistration.table.employee'),
        cell: ({ row }) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {isArabic ? row.original.employeeNameAr : row.original.employeeName}
          </span>
        ),
      }),
      columnHelper.accessor('nationalId', {
        header: () => t('employeeRegistration.table.nationalId'),
        cell: (info) => (
          <span className="tabular-nums text-slate-600 dark:text-slate-400" dir="ltr">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('registrationDate', {
        header: () => t('employeeRegistration.table.registrationDate'),
        cell: (info) => formatDate(info.getValue(), i18n.language),
      }),
      columnHelper.display({
        id: 'jobTitle',
        header: () => t('employeeRegistration.table.jobTitle'),
        cell: ({ row }) => (
          <span className="max-w-[140px] truncate">
            {isArabic ? row.original.jobTitleAr : row.original.jobTitle}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'department',
        header: () => t('employeeRegistration.table.department'),
        cell: ({ row }) => (
          <span className="max-w-[140px] truncate">
            {isArabic ? row.original.departmentAr : row.original.department}
          </span>
        ),
      }),
      columnHelper.accessor('contractType', {
        header: () => t('employeeRegistration.table.contractType'),
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300">
            {t(`employeeRegistration.contractType.${info.getValue()}`)}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: () => t('employeeRegistration.table.status'),
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => t('employeeRegistration.table.actions'),
        cell: ({ row }) => {
          const name = isArabic ? row.original.employeeNameAr : row.original.employeeName
          return (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewRecord(row.original)}
                aria-label={t('employeeRegistration.actions.view', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
              >
                <Eye className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setEditRecord(row.original)}
                aria-label={t('employeeRegistration.actions.edit', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
              >
                <Pencil className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteRecord(row.original)}
                aria-label={t('employeeRegistration.actions.delete', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <Trash2 className="size-4" strokeWidth={2} />
              </button>
            </div>
          )
        },
      }),
    ],
    [t, i18n.language, isArabic],
  )

  const handleAdd = (input: EmployeeRegistrationInput) => {
    setRecords((prev) => [...prev, { id: Date.now(), ...input, isDeleted: false }])
  }

  const handleEdit = (input: EmployeeRegistrationInput) => {
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
          <StatCard label={t('employeeRegistration.stats.total')} value={records.length} />
          <StatCard
            label={t('employeeRegistration.stats.active')}
            value={activeCount}
            className="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label={t('employeeRegistration.stats.pending')}
            value={pendingCount}
            className="text-amber-600 dark:text-amber-400"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('employeeRegistration.total', { count: records.length })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ExportButtons
              filename="employee-registration"
              title={getExportTranslation()('nav.employeeRegistration')}
              data={filteredRecords}
              columns={exportColumns}
            />
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              {t('employeeRegistration.addNew')}
            </button>
          </div>
        </div>

        <TableFilters
          search={search}
          onSearchChange={setSearch}
          showClear={hasActiveFilters([statusFilter, contractFilter, employeeFilter], search)}
          onClear={() => {
            setSearch('')
            setStatusFilter(ALL_FILTER)
            setContractFilter(ALL_FILTER)
            setEmployeeFilter(ALL_FILTER)
          }}
        >
          <FilterSelect
            label={t('filters.status')}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              { value: 'pending', label: t('employeeRegistration.status.pending') },
              { value: 'active', label: t('employeeRegistration.status.active') },
              { value: 'suspended', label: t('employeeRegistration.status.suspended') },
              { value: 'terminated', label: t('employeeRegistration.status.terminated') },
            ]}
          />
          <FilterSelect
            label={t('filters.contractType')}
            value={contractFilter}
            onChange={setContractFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              { value: 'permanent', label: t('employeeRegistration.contractType.permanent') },
              { value: 'temporary', label: t('employeeRegistration.contractType.temporary') },
              { value: 'contract', label: t('employeeRegistration.contractType.contract') },
            ]}
          />
          <EmployeeFilterSelect value={employeeFilter} onChange={setEmployeeFilter} />
        </TableFilters>

        <DataTable data={filteredRecords} columns={columns} pageSize={8} />
      </div>

      <EmployeeRegistrationFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <EmployeeRegistrationFormModal
        open={!!editRecord}
        mode="edit"
        record={editRecord ?? undefined}
        onClose={() => setEditRecord(null)}
        onSubmit={handleEdit}
      />

      <ViewEmployeeRegistrationModal
        open={!!viewRecord}
        record={viewRecord}
        onClose={() => setViewRecord(null)}
      />

      <DeleteEmployeeRegistrationModal
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
}: {
  label: string
  value: number
  className?: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p
        className={['mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100', className]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </p>
    </div>
  )
}
