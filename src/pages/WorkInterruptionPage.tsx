import { createColumnHelper } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteWorkInterruptionModal } from '../components/workInterruption/DeleteWorkInterruptionModal'
import { ViewWorkInterruptionModal } from '../components/workInterruption/ViewWorkInterruptionModal'
import { WorkInterruptionFormModal } from '../components/workInterruption/WorkInterruptionFormModal'
import { DataTable } from '../components/ui/DataTable'
import { EmployeeFilterSelect } from '../components/ui/EmployeeFilterSelect'
import { ExportButtons } from '../components/ui/ExportButtons'
import { FilterSelect } from '../components/ui/FilterSelect'
import { TableFilters } from '../components/ui/TableFilters'
import { initialWorkInterruptions } from '../data/workInterruptions'
import { getWorkInterruptionExportColumns } from '../export/columns'
import type { WorkInterruption, WorkInterruptionInput } from '../types/workInterruption'
import { formatDate } from '../utils/date'
import { ALL_FILTER, hasActiveFilters } from '../utils/filters'
import { softDeleteById } from '../utils/softDelete'
import { filterBySearch, tableSearchText } from '../utils/tableSearch'
import { EXPORT_IS_ARABIC, EXPORT_LOCALE, getExportTranslation } from '../utils/exportLocale'

const columnHelper = createColumnHelper<WorkInterruption>()

function StatusBadge({ status }: { status: WorkInterruption['status'] }) {
  const { t } = useTranslation()

  const styles = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status]].join(' ')}>
      {t(`workInterruption.status.${status}`)}
    </span>
  )
}

function TypeBadge({ type }: { type: WorkInterruption['interruptionType'] }) {
  const { t } = useTranslation()

  const styles = {
    absence: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    leave: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    sick: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
    unauthorized: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
    other: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[type]].join(' ')}>
      {t(`workInterruption.type.${type}`)}
    </span>
  )
}

export function WorkInterruptionPage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [records, setRecords] = useState(initialWorkInterruptions)
  const [addOpen, setAddOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<WorkInterruption | null>(null)
  const [editRecord, setEditRecord] = useState<WorkInterruption | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<WorkInterruption | null>(null)
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER)
  const [typeFilter, setTypeFilter] = useState(ALL_FILTER)
  const [employeeFilter, setEmployeeFilter] = useState(ALL_FILTER)
  const [search, setSearch] = useState('')

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((record) => {
      if (record.isDeleted) return false
      if (statusFilter !== ALL_FILTER && record.status !== statusFilter) return false
      if (typeFilter !== ALL_FILTER && record.interruptionType !== typeFilter) return false
      if (employeeFilter !== ALL_FILTER && record.employeeId !== Number(employeeFilter)) return false
      return true
    })
    return filterBySearch(filtered, search, tableSearchText.workInterruption)
  }, [records, statusFilter, typeFilter, employeeFilter, search])

  const exportColumns = useMemo(
    () => getWorkInterruptionExportColumns(getExportTranslation(), EXPORT_IS_ARABIC, EXPORT_LOCALE),
    [getExportTranslation],
  )

  const totalDays = records.reduce((sum, r) => sum + r.interruptedDays, 0)
  const pendingCount = records.filter((r) => !r.isDeleted && r.status === 'pending').length
  const approvedCount = records.filter((r) => !r.isDeleted && r.status === 'approved').length

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: () => t('workInterruption.table.id'),
        cell: (info) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">#{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'employee',
        header: () => t('workInterruption.table.employee'),
        cell: ({ row }) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {isArabic ? row.original.employeeNameAr : row.original.employeeName}
          </span>
        ),
      }),
      columnHelper.accessor('startDate', {
        header: () => t('workInterruption.table.startDate'),
        cell: (info) => formatDate(info.getValue(), i18n.language),
      }),
      columnHelper.accessor('endDate', {
        header: () => t('workInterruption.table.endDate'),
        cell: (info) => formatDate(info.getValue(), i18n.language),
      }),
      columnHelper.accessor('interruptedDays', {
        header: () => t('workInterruption.table.days'),
        cell: (info) => (
          <span className="font-medium text-orange-600 dark:text-orange-400">
            {t('workInterruption.daysCount', { count: info.getValue() })}
          </span>
        ),
      }),
      columnHelper.accessor('interruptionType', {
        header: () => t('workInterruption.table.type'),
        cell: (info) => <TypeBadge type={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'reason',
        header: () => t('workInterruption.table.reason'),
        cell: ({ row }) => (
          <span className="max-w-[160px] truncate">
            {isArabic ? row.original.reasonAr : row.original.reason}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: () => t('workInterruption.table.status'),
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => t('workInterruption.table.actions'),
        cell: ({ row }) => {
          const name = isArabic ? row.original.employeeNameAr : row.original.employeeName
          return (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewRecord(row.original)}
                aria-label={t('workInterruption.actions.view', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
              >
                <Eye className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setEditRecord(row.original)}
                aria-label={t('workInterruption.actions.edit', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
              >
                <Pencil className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteRecord(row.original)}
                aria-label={t('workInterruption.actions.delete', { name })}
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

  const handleAdd = (input: WorkInterruptionInput) => {
    setRecords((prev) => [...prev, { id: Date.now(), ...input, isDeleted: false }])
  }

  const handleEdit = (input: WorkInterruptionInput) => {
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
          <StatCard label={t('workInterruption.stats.total')} value={records.length} />
          <StatCard
            label={t('workInterruption.stats.totalDays')}
            value={t('workInterruption.daysCount', { count: totalDays })}
            isText
            className="text-orange-600 dark:text-orange-400"
          />
          <StatCard
            label={t('workInterruption.stats.approved')}
            value={approvedCount}
            className="text-emerald-600 dark:text-emerald-400"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('workInterruption.total', { count: records.length, pending: pendingCount })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ExportButtons
              filename="work-interruption"
              title={getExportTranslation()('nav.workInterruption')}
              data={filteredRecords}
              columns={exportColumns}
            />
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              {t('workInterruption.addNew')}
            </button>
          </div>
        </div>

        <TableFilters
          search={search}
          onSearchChange={setSearch}
          showClear={hasActiveFilters([statusFilter, typeFilter, employeeFilter], search)}
          onClear={() => {
            setSearch('')
            setStatusFilter(ALL_FILTER)
            setTypeFilter(ALL_FILTER)
            setEmployeeFilter(ALL_FILTER)
          }}
        >
          <FilterSelect
            label={t('filters.status')}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              { value: 'pending', label: t('workInterruption.status.pending') },
              { value: 'approved', label: t('workInterruption.status.approved') },
              { value: 'rejected', label: t('workInterruption.status.rejected') },
            ]}
          />
          <FilterSelect
            label={t('filters.type')}
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              { value: 'absence', label: t('workInterruption.type.absence') },
              { value: 'leave', label: t('workInterruption.type.leave') },
              { value: 'sick', label: t('workInterruption.type.sick') },
              { value: 'unauthorized', label: t('workInterruption.type.unauthorized') },
              { value: 'other', label: t('workInterruption.type.other') },
            ]}
          />
          <EmployeeFilterSelect value={employeeFilter} onChange={setEmployeeFilter} />
        </TableFilters>

        <DataTable data={filteredRecords} columns={columns} pageSize={8} />
      </div>

      <WorkInterruptionFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <WorkInterruptionFormModal
        open={!!editRecord}
        mode="edit"
        record={editRecord ?? undefined}
        onClose={() => setEditRecord(null)}
        onSubmit={handleEdit}
      />

      <ViewWorkInterruptionModal
        open={!!viewRecord}
        record={viewRecord}
        onClose={() => setViewRecord(null)}
      />

      <DeleteWorkInterruptionModal
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
