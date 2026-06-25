import { createColumnHelper } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteInsuranceModal } from '../components/insurance/DeleteInsuranceModal'
import { InsuranceFormModal } from '../components/insurance/InsuranceFormModal'
import { ViewInsuranceModal } from '../components/insurance/ViewInsuranceModal'
import { DataTable } from '../components/ui/DataTable'
import { EmployeeFilterSelect } from '../components/ui/EmployeeFilterSelect'
import { ExportButtons } from '../components/ui/ExportButtons'
import { FilterSelect } from '../components/ui/FilterSelect'
import { TableFilters } from '../components/ui/TableFilters'
import { initialInsurance } from '../data/insurance'
import { getInsuranceExportColumns } from '../export/columns'
import type { Insurance, InsuranceInput } from '../types/insurance'
import { formatCurrency } from '../utils/currency'
import { formatDate } from '../utils/date'
import { ALL_FILTER, hasActiveFilters } from '../utils/filters'
import { softDeleteById } from '../utils/softDelete'
import { filterBySearch, tableSearchText } from '../utils/tableSearch'
import { EXPORT_IS_ARABIC, EXPORT_LOCALE, getExportTranslation } from '../utils/exportLocale'

const columnHelper = createColumnHelper<Insurance>()

function StatusBadge({ status }: { status: Insurance['status'] }) {
  const { t } = useTranslation()

  const styles = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    expired: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status]].join(' ')}>
      {t(`insurance.status.${status}`)}
    </span>
  )
}

function TypeBadge({ type }: { type: Insurance['insuranceType'] }) {
  const { t } = useTranslation()

  const styles = {
    social: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    health: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    life: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
    accident: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
    other: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  }

  return (
    <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[type]].join(' ')}>
      {t(`insurance.type.${type}`)}
    </span>
  )
}

export function InsurancePage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [records, setRecords] = useState(initialInsurance)
  const [addOpen, setAddOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<Insurance | null>(null)
  const [editRecord, setEditRecord] = useState<Insurance | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<Insurance | null>(null)
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER)
  const [typeFilter, setTypeFilter] = useState(ALL_FILTER)
  const [employeeFilter, setEmployeeFilter] = useState(ALL_FILTER)
  const [search, setSearch] = useState('')

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((record) => {
      if (record.isDeleted) return false
      if (statusFilter !== ALL_FILTER && record.status !== statusFilter) return false
      if (typeFilter !== ALL_FILTER && record.insuranceType !== typeFilter) return false
      if (employeeFilter !== ALL_FILTER && record.employeeId !== Number(employeeFilter)) return false
      return true
    })
    return filterBySearch(filtered, search, tableSearchText.insurance)
  }, [records, statusFilter, typeFilter, employeeFilter, search])

  const exportColumns = useMemo(
    () => getInsuranceExportColumns(getExportTranslation(), EXPORT_IS_ARABIC, EXPORT_LOCALE),
    [getExportTranslation],
  )

  const activeCount = records.filter((r) => !r.isDeleted && r.status === 'active').length
  const pendingCount = records.filter((r) => !r.isDeleted && r.status === 'pending').length
  const totalPremium = records
    .filter((r) => r.status === 'active')
    .reduce((sum, r) => sum + r.monthlyPremium, 0)

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: () => t('insurance.table.id'),
        cell: (info) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">#{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'employee',
        header: () => t('insurance.table.employee'),
        cell: ({ row }) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {isArabic ? row.original.employeeNameAr : row.original.employeeName}
          </span>
        ),
      }),
      columnHelper.accessor('insuranceType', {
        header: () => t('insurance.table.type'),
        cell: (info) => <TypeBadge type={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'provider',
        header: () => t('insurance.table.provider'),
        cell: ({ row }) => (
          <span className="max-w-[140px] truncate">
            {isArabic ? row.original.providerAr : row.original.provider}
          </span>
        ),
      }),
      columnHelper.accessor('policyNumber', {
        header: () => t('insurance.table.policyNumber'),
        cell: (info) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('monthlyPremium', {
        header: () => t('insurance.table.monthlyPremium'),
        cell: (info) => formatCurrency(info.getValue(), i18n.language),
      }),
      columnHelper.accessor('endDate', {
        header: () => t('insurance.table.endDate'),
        cell: (info) => formatDate(info.getValue(), i18n.language),
      }),
      columnHelper.accessor('status', {
        header: () => t('insurance.table.status'),
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => t('insurance.table.actions'),
        cell: ({ row }) => {
          const name = isArabic ? row.original.employeeNameAr : row.original.employeeName
          return (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewRecord(row.original)}
                aria-label={t('insurance.actions.view', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
              >
                <Eye className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setEditRecord(row.original)}
                aria-label={t('insurance.actions.edit', { name })}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
              >
                <Pencil className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteRecord(row.original)}
                aria-label={t('insurance.actions.delete', { name })}
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

  const handleAdd = (input: InsuranceInput) => {
    setRecords((prev) => [...prev, { id: Date.now(), ...input, isDeleted: false }])
  }

  const handleEdit = (input: InsuranceInput) => {
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
          <StatCard label={t('insurance.stats.total')} value={records.length} />
          <StatCard
            label={t('insurance.stats.active')}
            value={activeCount}
            className="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label={t('insurance.stats.totalPremium')}
            value={formatCurrency(totalPremium, i18n.language)}
            isText
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('insurance.total', { count: records.length, pending: pendingCount })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ExportButtons
              filename="insurance"
              title={getExportTranslation()('nav.insurance')}
              data={filteredRecords}
              columns={exportColumns}
            />
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              {t('insurance.addNew')}
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
              { value: 'pending', label: t('insurance.status.pending') },
              { value: 'active', label: t('insurance.status.active') },
              { value: 'expired', label: t('insurance.status.expired') },
              { value: 'cancelled', label: t('insurance.status.cancelled') },
            ]}
          />
          <FilterSelect
            label={t('filters.type')}
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: ALL_FILTER, label: t('filters.all') },
              { value: 'social', label: t('insurance.type.social') },
              { value: 'health', label: t('insurance.type.health') },
              { value: 'life', label: t('insurance.type.life') },
              { value: 'accident', label: t('insurance.type.accident') },
              { value: 'other', label: t('insurance.type.other') },
            ]}
          />
          <EmployeeFilterSelect value={employeeFilter} onChange={setEmployeeFilter} />
        </TableFilters>

        <DataTable data={filteredRecords} columns={columns} pageSize={8} />
      </div>

      <InsuranceFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <InsuranceFormModal
        open={!!editRecord}
        mode="edit"
        record={editRecord ?? undefined}
        onClose={() => setEditRecord(null)}
        onSubmit={handleEdit}
      />

      <ViewInsuranceModal
        open={!!viewRecord}
        record={viewRecord}
        onClose={() => setViewRecord(null)}
      />

      <DeleteInsuranceModal
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
