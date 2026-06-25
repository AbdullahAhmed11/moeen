import { createColumnHelper } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteShiftModal } from '../components/shifts/DeleteShiftModal'
import { ShiftFormModal } from '../components/shifts/ShiftFormModal'
import { ViewShiftModal } from '../components/shifts/ViewShiftModal'
import { DataTable } from '../components/ui/DataTable'
import { ExportButtons } from '../components/ui/ExportButtons'
import { FilterSelect } from '../components/ui/FilterSelect'
import { TableFilters } from '../components/ui/TableFilters'
import { initialShifts } from '../data/shifts'
import { getShiftsExportColumns } from '../export/columns'
import type { Shift, ShiftInput } from '../types/shift'
import { SHIFT_HOURS, formatTime } from '../utils/shift'
import { ALL_FILTER, hasActiveFilters } from '../utils/filters'
import { softDeleteById } from '../utils/softDelete'
import { filterBySearch, tableSearchText } from '../utils/tableSearch'
import { EXPORT_IS_ARABIC, EXPORT_LOCALE, getExportTranslation } from '../utils/exportLocale'

const columnHelper = createColumnHelper<Shift>()

function StatusBadge({ status }: { status: Shift['status'] }) {
  const { t } = useTranslation()

  const styles = {
    active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status]].join(' ')}>
      {t(`shifts.status.${status}`)}
    </span>
  )
}

export function ShiftsPage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [records, setRecords] = useState(initialShifts)
  const [addOpen, setAddOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<Shift | null>(null)
  const [editRecord, setEditRecord] = useState<Shift | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<Shift | null>(null)
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER)
  const [search, setSearch] = useState('')

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((record) => {
      if (record.isDeleted) return false
      if (statusFilter !== ALL_FILTER && record.status !== statusFilter) return false
      return true
    })
    return filterBySearch(filtered, search, tableSearchText.shift)
  }, [records, statusFilter, search])

  const exportColumns = useMemo(
    () => getShiftsExportColumns(getExportTranslation(), EXPORT_IS_ARABIC, EXPORT_LOCALE),
    [getExportTranslation],
  )

  const activeCount = records.filter((r) => !r.isDeleted && r.status === 'active').length
  const inactiveCount = records.filter((r) => !r.isDeleted && r.status === 'inactive').length

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: () => t('shifts.table.id'),
        cell: (info) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">#{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'name',
        header: () => t('shifts.table.name'),
        cell: ({ row }) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {isArabic ? row.original.nameAr : row.original.name}
          </span>
        ),
      }),
      columnHelper.accessor('startTime', {
        header: () => t('shifts.table.startTime'),
        cell: (info) => formatTime(info.getValue(), i18n.language),
      }),
      columnHelper.accessor('endTime', {
        header: () => t('shifts.table.endTime'),
        cell: (info) => formatTime(info.getValue(), i18n.language),
      }),
      columnHelper.accessor('shiftHours', {
        header: () => t('shifts.table.shiftHours'),
        cell: (info) => (
          <span className="font-medium text-indigo-600 dark:text-indigo-400">
            {t('shifts.hoursCount', { count: info.getValue() || SHIFT_HOURS })}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'workingDays',
        header: () => t('shifts.table.workingDays'),
        cell: ({ row }) => (
          <span className="max-w-[140px] truncate">
            {isArabic ? row.original.workingDaysAr : row.original.workingDays}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: () => t('shifts.table.status'),
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => t('shifts.table.actions'),
        cell: ({ row }) => {
          const name = isArabic ? row.original.nameAr : row.original.name
          return (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewRecord(row.original)}
                aria-label={t('shifts.actions.view', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
              >
                <Eye className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setEditRecord(row.original)}
                aria-label={t('shifts.actions.edit', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
              >
                <Pencil className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteRecord(row.original)}
                aria-label={t('shifts.actions.delete', { name })}
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

  const handleAdd = (input: ShiftInput) => {
    setRecords((prev) => [...prev, { id: Date.now(), ...input, isDeleted: false }])
  }

  const handleEdit = (input: ShiftInput) => {
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
          <StatCard label={t('shifts.stats.total')} value={records.length} />
          <StatCard
            label={t('shifts.stats.active')}
            value={activeCount}
            className="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label={t('shifts.stats.shiftDuration')}
            value={t('shifts.hoursCount', { count: SHIFT_HOURS })}
            isText
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('shifts.total', { count: records.length, inactive: inactiveCount })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ExportButtons
              filename="shifts"
              title={getExportTranslation()('nav.shifts')}
              data={filteredRecords}
              columns={exportColumns}
            />
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              {t('shifts.addNew')}
            </button>
          </div>
        </div>

        <TableFilters
          search={search}
          onSearchChange={setSearch}
          showClear={hasActiveFilters([statusFilter], search)}
          onClear={() => {
            setSearch('')
            setStatusFilter(ALL_FILTER)
          }}
        >
          <FilterSelect
            label={t('filters.status')}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              { value: 'active', label: t('shifts.status.active') },
              { value: 'inactive', label: t('shifts.status.inactive') },
            ]}
          />
        </TableFilters>

        <DataTable data={filteredRecords} columns={columns} pageSize={8} />
      </div>

      <ShiftFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <ShiftFormModal
        open={!!editRecord}
        mode="edit"
        record={editRecord ?? undefined}
        onClose={() => setEditRecord(null)}
        onSubmit={handleEdit}
      />

      <ViewShiftModal
        open={!!viewRecord}
        record={viewRecord}
        onClose={() => setViewRecord(null)}
      />

      <DeleteShiftModal
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
