import { createColumnHelper } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteWorkHoursAdditionModal } from '../components/workHoursAddition/DeleteWorkHoursAdditionModal'
import { ViewWorkHoursAdditionModal } from '../components/workHoursAddition/ViewWorkHoursAdditionModal'
import { WorkHoursAdditionFormModal } from '../components/workHoursAddition/WorkHoursAdditionFormModal'
import { DataTable } from '../components/ui/DataTable'
import { EmployeeFilterSelect } from '../components/ui/EmployeeFilterSelect'
import { ExportButtons } from '../components/ui/ExportButtons'
import { FilterSelect } from '../components/ui/FilterSelect'
import { TableFilters } from '../components/ui/TableFilters'
import { initialWorkHoursAdditions } from '../data/workHoursAdditions'
import { getWorkHoursAdditionExportColumns } from '../export/columns'
import type { WorkHoursAddition, WorkHoursAdditionInput } from '../types/workHoursAddition'
import { formatCurrency } from '../utils/currency'
import { formatDate } from '../utils/date'
import { ALL_FILTER, hasActiveFilters } from '../utils/filters'
import { softDeleteById } from '../utils/softDelete'
import { filterBySearch, tableSearchText } from '../utils/tableSearch'
import { formatWorkHours } from '../utils/workHours'
import { EXPORT_IS_ARABIC, EXPORT_LOCALE, getExportTranslation } from '../utils/exportLocale'

const columnHelper = createColumnHelper<WorkHoursAddition>()

function StatusBadge({ status }: { status: WorkHoursAddition['status'] }) {
  const { t } = useTranslation()

  const styles = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status]].join(' ')}>
      {t(`workHoursAddition.status.${status}`)}
    </span>
  )
}

export function WorkHoursAdditionPage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [records, setRecords] = useState(initialWorkHoursAdditions)
  const [addOpen, setAddOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<WorkHoursAddition | null>(null)
  const [editRecord, setEditRecord] = useState<WorkHoursAddition | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<WorkHoursAddition | null>(null)
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
    return filterBySearch(filtered, search, tableSearchText.workHoursAddition)
  }, [records, statusFilter, employeeFilter, search])

  const exportColumns = useMemo(
    () => getWorkHoursAdditionExportColumns(getExportTranslation(), EXPORT_IS_ARABIC, EXPORT_LOCALE),
    [getExportTranslation],
  )

  const totalAmount = records.reduce((sum, r) => sum + r.amount, 0)
  const totalMinutes = records.reduce((sum, r) => sum + r.addedMinutes, 0)
  const pendingCount = records.filter((r) => !r.isDeleted && r.status === 'pending').length

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: () => t('workHoursAddition.table.id'),
        cell: (info) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">#{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'employee',
        header: () => t('workHoursAddition.table.employee'),
        cell: ({ row }) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {isArabic ? row.original.employeeNameAr : row.original.employeeName}
          </span>
        ),
      }),
      columnHelper.accessor('date', {
        header: () => t('workHoursAddition.table.date'),
        cell: (info) => formatDate(info.getValue(), i18n.language),
      }),
      columnHelper.accessor('addedMinutes', {
        header: () => t('workHoursAddition.table.addedHours'),
        cell: (info) => (
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            {formatWorkHours(info.getValue(), i18n.language)}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'reason',
        header: () => t('workHoursAddition.table.reason'),
        cell: ({ row }) => (
          <span className="max-w-[180px] truncate">
            {isArabic ? row.original.reasonAr : row.original.reason}
          </span>
        ),
      }),
      columnHelper.accessor('amount', {
        header: () => t('workHoursAddition.table.amount'),
        cell: (info) => (
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            {formatCurrency(info.getValue(), i18n.language)}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: () => t('workHoursAddition.table.status'),
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => t('workHoursAddition.table.actions'),
        cell: ({ row }) => {
          const name = isArabic ? row.original.employeeNameAr : row.original.employeeName
          return (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewRecord(row.original)}
                aria-label={t('workHoursAddition.actions.view', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
              >
                <Eye className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setEditRecord(row.original)}
                aria-label={t('workHoursAddition.actions.edit', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
              >
                <Pencil className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteRecord(row.original)}
                aria-label={t('workHoursAddition.actions.delete', { name })}
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

  const handleAdd = (input: WorkHoursAdditionInput) => {
    setRecords((prev) => [...prev, { id: Date.now(), ...input, isDeleted: false }])
  }

  const handleEdit = (input: WorkHoursAdditionInput) => {
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
          <StatCard label={t('workHoursAddition.stats.total')} value={records.length} />
          <StatCard
            label={t('workHoursAddition.stats.totalHours')}
            value={formatWorkHours(totalMinutes, i18n.language)}
            isText
            className="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label={t('workHoursAddition.stats.totalAmount')}
            value={formatCurrency(totalAmount, i18n.language)}
            isText
            className="text-emerald-600 dark:text-emerald-400"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('workHoursAddition.total', { count: records.length, pending: pendingCount })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ExportButtons
              filename="work-hours-addition"
              title={getExportTranslation()('nav.workHoursAddition')}
              data={filteredRecords}
              columns={exportColumns}
            />
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              {t('workHoursAddition.addNew')}
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
              { value: 'pending', label: t('workHoursAddition.status.pending') },
              { value: 'approved', label: t('workHoursAddition.status.approved') },
              { value: 'rejected', label: t('workHoursAddition.status.rejected') },
            ]}
          />
          <EmployeeFilterSelect value={employeeFilter} onChange={setEmployeeFilter} />
        </TableFilters>

        <DataTable data={filteredRecords} columns={columns} pageSize={8} />
      </div>

      <WorkHoursAdditionFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <WorkHoursAdditionFormModal
        open={!!editRecord}
        mode="edit"
        record={editRecord ?? undefined}
        onClose={() => setEditRecord(null)}
        onSubmit={handleEdit}
      />

      <ViewWorkHoursAdditionModal
        open={!!viewRecord}
        record={viewRecord}
        onClose={() => setViewRecord(null)}
      />

      <DeleteWorkHoursAdditionModal
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
