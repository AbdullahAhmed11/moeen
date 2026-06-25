import { createColumnHelper } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteWorkHoursDeductionModal } from '../components/workHoursDeduction/DeleteWorkHoursDeductionModal'
import { ViewWorkHoursDeductionModal } from '../components/workHoursDeduction/ViewWorkHoursDeductionModal'
import { WorkHoursDeductionFormModal } from '../components/workHoursDeduction/WorkHoursDeductionFormModal'
import { DataTable } from '../components/ui/DataTable'
import { EmployeeFilterSelect } from '../components/ui/EmployeeFilterSelect'
import { ExportButtons } from '../components/ui/ExportButtons'
import { FilterSelect } from '../components/ui/FilterSelect'
import { TableFilters } from '../components/ui/TableFilters'
import { initialWorkHoursDeductions } from '../data/workHoursDeductions'
import { getWorkHoursDeductionExportColumns } from '../export/columns'
import type { WorkHoursDeduction, WorkHoursDeductionInput } from '../types/workHoursDeduction'
import { formatCurrency } from '../utils/currency'
import { formatDate } from '../utils/date'
import { ALL_FILTER, hasActiveFilters } from '../utils/filters'
import { softDeleteById } from '../utils/softDelete'
import { filterBySearch, tableSearchText } from '../utils/tableSearch'
import { formatWorkHours } from '../utils/workHours'
import { EXPORT_IS_ARABIC, EXPORT_LOCALE, getExportTranslation } from '../utils/exportLocale'

const columnHelper = createColumnHelper<WorkHoursDeduction>()

function StatusBadge({ status }: { status: WorkHoursDeduction['status'] }) {
  const { t } = useTranslation()

  const styles = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status]].join(' ')}>
      {t(`workHoursDeduction.status.${status}`)}
    </span>
  )
}

export function WorkHoursDeductionPage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [records, setRecords] = useState(initialWorkHoursDeductions)
  const [addOpen, setAddOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<WorkHoursDeduction | null>(null)
  const [editRecord, setEditRecord] = useState<WorkHoursDeduction | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<WorkHoursDeduction | null>(null)
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER)
  const [employeeFilter, setEmployeeFilter] = useState(ALL_FILTER)
  const [search, setSearch] = useState('')

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((record) => {
      if (record.isDeleted) return false
      if (statusFilter !== ALL_FILTER && record.status !== statusFilter) return false
      if (employeeFilter !== ALL_FILTER && record.employeeId !== Number(employeeFilter)) return false
      return true
    })
    return filterBySearch(filtered, search, tableSearchText.workHoursDeduction)
  }, [records, statusFilter, employeeFilter, search])

  const exportColumns = useMemo(
    () => getWorkHoursDeductionExportColumns(getExportTranslation(), EXPORT_IS_ARABIC, EXPORT_LOCALE),
    [getExportTranslation],
  )

  const totalAmount = records.reduce((sum, r) => sum + r.amount, 0)
  const totalMinutes = records.reduce((sum, r) => sum + r.deductedMinutes, 0)
  const pendingCount = records.filter((r) => !r.isDeleted && r.status === 'pending').length

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: () => t('workHoursDeduction.table.id'),
        cell: (info) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">#{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'employee',
        header: () => t('workHoursDeduction.table.employee'),
        cell: ({ row }) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {isArabic ? row.original.employeeNameAr : row.original.employeeName}
          </span>
        ),
      }),
      columnHelper.accessor('date', {
        header: () => t('workHoursDeduction.table.date'),
        cell: (info) => formatDate(info.getValue(), i18n.language),
      }),
      columnHelper.accessor('deductedMinutes', {
        header: () => t('workHoursDeduction.table.deductedHours'),
        cell: (info) => (
          <span className="font-medium text-orange-600 dark:text-orange-400">
            {formatWorkHours(info.getValue(), i18n.language)}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'reason',
        header: () => t('workHoursDeduction.table.reason'),
        cell: ({ row }) => (
          <span className="max-w-[180px] truncate">
            {isArabic ? row.original.reasonAr : row.original.reason}
          </span>
        ),
      }),
      columnHelper.accessor('amount', {
        header: () => t('workHoursDeduction.table.amount'),
        cell: (info) => (
          <span className="font-medium text-red-600 dark:text-red-400">
            {formatCurrency(info.getValue(), i18n.language)}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: () => t('workHoursDeduction.table.status'),
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => t('workHoursDeduction.table.actions'),
        cell: ({ row }) => {
          const name = isArabic ? row.original.employeeNameAr : row.original.employeeName
          return (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewRecord(row.original)}
                aria-label={t('workHoursDeduction.actions.view', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
              >
                <Eye className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setEditRecord(row.original)}
                aria-label={t('workHoursDeduction.actions.edit', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
              >
                <Pencil className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteRecord(row.original)}
                aria-label={t('workHoursDeduction.actions.delete', { name })}
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

  const handleAdd = (input: WorkHoursDeductionInput) => {
    setRecords((prev) => [...prev, { id: Date.now(), ...input, isDeleted: false }])
  }

  const handleEdit = (input: WorkHoursDeductionInput) => {
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
          <StatCard label={t('workHoursDeduction.stats.total')} value={records.length} />
          <StatCard
            label={t('workHoursDeduction.stats.totalHours')}
            value={formatWorkHours(totalMinutes, i18n.language)}
            isText
            className="text-orange-600 dark:text-orange-400"
          />
          <StatCard
            label={t('workHoursDeduction.stats.totalAmount')}
            value={formatCurrency(totalAmount, i18n.language)}
            isText
            className="text-red-600 dark:text-red-400"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('workHoursDeduction.total', { count: records.length, pending: pendingCount })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ExportButtons
              filename="work-hours-deduction"
              title={getExportTranslation()('nav.workHoursDeduction')}
              data={filteredRecords}
              columns={exportColumns}
            />
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              {t('workHoursDeduction.addNew')}
            </button>
          </div>
        </div>

        <TableFilters
          search={search}
          onSearchChange={setSearch}
          showClear={hasActiveFilters([statusFilter, employeeFilter], search)}
          onClear={() => {
            setSearch('')
            setStatusFilter(ALL_FILTER)
            setEmployeeFilter(ALL_FILTER)
          }}
        >
          <FilterSelect
            label={t('filters.status')}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              { value: 'pending', label: t('workHoursDeduction.status.pending') },
              { value: 'approved', label: t('workHoursDeduction.status.approved') },
              { value: 'rejected', label: t('workHoursDeduction.status.rejected') },
            ]}
          />
          <EmployeeFilterSelect value={employeeFilter} onChange={setEmployeeFilter} />
        </TableFilters>

        <DataTable data={filteredRecords} columns={columns} pageSize={8} />
      </div>

      <WorkHoursDeductionFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <WorkHoursDeductionFormModal
        open={!!editRecord}
        mode="edit"
        record={editRecord ?? undefined}
        onClose={() => setEditRecord(null)}
        onSubmit={handleEdit}
      />

      <ViewWorkHoursDeductionModal
        open={!!viewRecord}
        record={viewRecord}
        onClose={() => setViewRecord(null)}
      />

      <DeleteWorkHoursDeductionModal
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
