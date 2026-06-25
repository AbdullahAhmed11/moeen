import { createColumnHelper } from '@tanstack/react-table'
import { Check, Eye, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteLeaveModal } from '../components/leave/DeleteLeaveModal'
import { LeaveFormModal } from '../components/leave/LeaveFormModal'
import { ViewLeaveModal } from '../components/leave/ViewLeaveModal'
import { DataTable } from '../components/ui/DataTable'
import { EmployeeFilterSelect } from '../components/ui/EmployeeFilterSelect'
import { ExportButtons } from '../components/ui/ExportButtons'
import { FilterSelect } from '../components/ui/FilterSelect'
import { MobileRecordCard } from '../components/ui/MobileRecordCard'
import { TableFilters } from '../components/ui/TableFilters'
import { useLeaves } from '../context/LeaveContext'
import { getLeaveExportColumns } from '../export/columns'
import type { LeaveInput, LeaveRequest } from '../types/leave'
import { formatDate } from '../utils/date'
import { ALL_FILTER, hasActiveFilters } from '../utils/filters'
import { filterBySearch, tableSearchText } from '../utils/tableSearch'
import { EXPORT_IS_ARABIC, EXPORT_LOCALE, getExportTranslation } from '../utils/exportLocale'
import { useMediaQuery } from '../hooks/useMediaQuery'

const columnHelper = createColumnHelper<LeaveRequest>()

function StatusBadge({ status }: { status: LeaveRequest['status'] }) {
  const { t } = useTranslation()
  const styles = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    cancelled: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  }
  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status]].join(' ')}>
      {t(`leave.status.${status}`)}
    </span>
  )
}

function TypeBadge({ type }: { type: LeaveRequest['leaveType'] }) {
  const { t } = useTranslation()
  return (
    <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
      {t(`leave.type.${type}`)}
    </span>
  )
}

export function LeavePage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const isMobile = useMediaQuery('(max-width: 767px)')
  const { leaves, addLeave, updateLeave, deleteLeave, approveLeave, rejectLeave } = useLeaves()

  const [addOpen, setAddOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<LeaveRequest | null>(null)
  const [editRecord, setEditRecord] = useState<LeaveRequest | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<LeaveRequest | null>(null)
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER)
  const [typeFilter, setTypeFilter] = useState(ALL_FILTER)
  const [employeeFilter, setEmployeeFilter] = useState(ALL_FILTER)
  const [search, setSearch] = useState('')

  const filteredLeaves = useMemo(() => {
    const filtered = leaves.filter((leave) => {
      if (leave.isDeleted) return false
      if (statusFilter !== ALL_FILTER && leave.status !== statusFilter) return false
      if (typeFilter !== ALL_FILTER && leave.leaveType !== typeFilter) return false
      if (employeeFilter !== ALL_FILTER && leave.employeeId !== Number(employeeFilter)) return false
      return true
    })
    return filterBySearch(filtered, search, tableSearchText.leave)
  }, [leaves, statusFilter, typeFilter, employeeFilter, search])

  const exportColumns = useMemo(
    () => getLeaveExportColumns(getExportTranslation(), EXPORT_IS_ARABIC, EXPORT_LOCALE),
    [],
  )

  const pendingCount = leaves.filter((leave) => !leave.isDeleted && leave.status === 'pending').length
  const approvedCount = leaves.filter((leave) => !leave.isDeleted && leave.status === 'approved').length
  const activeLeaves = leaves.filter((leave) => !leave.isDeleted)
  const totalDays = leaves.reduce((sum, leave) => sum + leave.days, 0)

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: () => t('leave.table.id'),
        cell: (info) => <span className="font-medium">#{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: 'employee',
        header: () => t('leave.table.employee'),
        cell: ({ row }) => (isArabic ? row.original.employeeNameAr : row.original.employeeName),
      }),
      columnHelper.accessor('leaveType', {
        header: () => t('leave.table.type'),
        cell: (info) => <TypeBadge type={info.getValue()} />,
      }),
      columnHelper.accessor('startDate', {
        header: () => t('leave.table.startDate'),
        cell: (info) => formatDate(info.getValue(), i18n.language),
      }),
      columnHelper.accessor('endDate', {
        header: () => t('leave.table.endDate'),
        cell: (info) => formatDate(info.getValue(), i18n.language),
      }),
      columnHelper.accessor('days', {
        header: () => t('leave.table.days'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('status', {
        header: () => t('leave.table.status'),
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => t('leave.table.actions'),
        cell: ({ row }) => {
          const name = isArabic ? row.original.employeeNameAr : row.original.employeeName
          return (
            <div className="flex items-center gap-1">
              {row.original.status === 'pending' && (
                <>
                  <button type="button" onClick={() => approveLeave(row.original.id)} aria-label={t('leave.actions.approve', { name })} className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
                    <Check className="size-4" />
                  </button>
                  <button type="button" onClick={() => rejectLeave(row.original.id)} aria-label={t('leave.actions.reject', { name })} className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10">
                    <X className="size-4" />
                  </button>
                </>
              )}
              <button type="button" onClick={() => setViewRecord(row.original)} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600">
                <Eye className="size-4" />
              </button>
              <button type="button" onClick={() => setEditRecord(row.original)} className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600">
                <Pencil className="size-4" />
              </button>
              <button type="button" onClick={() => setDeleteRecord(row.original)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="size-4" />
              </button>
            </div>
          )
        },
      }),
    ],
    [t, i18n.language, isArabic, approveLeave, rejectLeave],
  )

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label={t('leave.stats.total')} value={activeLeaves.length} />
          <StatCard label={t('leave.stats.pending')} value={pendingCount} className="text-amber-600 dark:text-amber-400" />
          <StatCard label={t('leave.stats.totalDays')} value={totalDays} className="text-indigo-600 dark:text-indigo-400" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('leave.summary', { count: activeLeaves.length, pending: pendingCount, approved: approvedCount })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ExportButtons filename="leave" title={getExportTranslation()('nav.leave')} data={filteredLeaves} columns={exportColumns} />
            <button type="button" onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
              <Plus className="size-4" />
              {t('leave.addNew')}
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
              { value: 'pending', label: t('leave.status.pending') },
              { value: 'approved', label: t('leave.status.approved') },
              { value: 'rejected', label: t('leave.status.rejected') },
              { value: 'cancelled', label: t('leave.status.cancelled') },
            ]}
          />
          <FilterSelect
            label={t('filters.type')}
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              { value: 'annual', label: t('leave.type.annual') },
              { value: 'sick', label: t('leave.type.sick') },
              { value: 'unpaid', label: t('leave.type.unpaid') },
              { value: 'emergency', label: t('leave.type.emergency') },
              { value: 'other', label: t('leave.type.other') },
            ]}
          />
          <EmployeeFilterSelect value={employeeFilter} onChange={setEmployeeFilter} />
        </TableFilters>

        {isMobile ? (
          <div className="space-y-3">
            {filteredLeaves.map((leave) => (
              <MobileRecordCard
                key={leave.id}
                title={isArabic ? leave.employeeNameAr : leave.employeeName}
                subtitle={t(`leave.type.${leave.leaveType}`)}
                badge={<StatusBadge status={leave.status} />}
                fields={[
                  { label: t('leave.table.startDate'), value: formatDate(leave.startDate, i18n.language) },
                  { label: t('leave.table.endDate'), value: formatDate(leave.endDate, i18n.language) },
                  { label: t('leave.table.days'), value: leave.days },
                ]}
                actions={
                  leave.status === 'pending' ? (
                    <>
                      <button type="button" onClick={() => approveLeave(leave.id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">{t('leave.actions.approveShort')}</button>
                      <button type="button" onClick={() => rejectLeave(leave.id)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white">{t('leave.actions.rejectShort')}</button>
                    </>
                  ) : undefined
                }
              />
            ))}
          </div>
        ) : (
          <DataTable data={filteredLeaves} columns={columns} pageSize={8} />
        )}
      </div>

      <LeaveFormModal open={addOpen} mode="add" onClose={() => setAddOpen(false)} onSubmit={addLeave} />
      <LeaveFormModal open={!!editRecord} mode="edit" record={editRecord ?? undefined} onClose={() => setEditRecord(null)} onSubmit={(input: LeaveInput) => editRecord && updateLeave(editRecord.id, input)} />
      <ViewLeaveModal open={!!viewRecord} record={viewRecord} onClose={() => setViewRecord(null)} />
      <DeleteLeaveModal open={!!deleteRecord} record={deleteRecord} onClose={() => setDeleteRecord(null)} onConfirm={() => deleteRecord && deleteLeave(deleteRecord.id)} />
    </>
  )
}

function StatCard({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={['mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100', className].filter(Boolean).join(' ')}>{value}</p>
    </div>
  )
}
