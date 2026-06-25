import { createColumnHelper } from '@tanstack/react-table'
import { Fingerprint, LogIn, LogOut, MapPin, ScanFace, Smartphone } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MobileCheckInPanel } from '../components/attendance/MobileCheckInPanel'
import { DataTable } from '../components/ui/DataTable'
import { EmployeeFilterSelect } from '../components/ui/EmployeeFilterSelect'
import { ExportButtons } from '../components/ui/ExportButtons'
import { FilterSelect } from '../components/ui/FilterSelect'
import { MobileRecordCard } from '../components/ui/MobileRecordCard'
import { TableFilters } from '../components/ui/TableFilters'
import { useAttendance } from '../context/AttendanceContext'
import { getFingerprintExportColumns } from '../export/columns'
import { useMediaQuery } from '../hooks/useMediaQuery'
import type { AttendanceRecord, FingerprintMethod } from '../types/fingerprint'
import { formatCoordinates } from '../utils/attendance'
import { formatDate, formatTime } from '../utils/date'
import { ALL_FILTER, hasActiveFilters } from '../utils/filters'
import { filterBySearch, tableSearchText } from '../utils/tableSearch'
import { EXPORT_IS_ARABIC, EXPORT_LOCALE, getExportTranslation } from '../utils/exportLocale'
import { formatWorkHours } from '../utils/workHours'

const columnHelper = createColumnHelper<AttendanceRecord>()

function MethodBadge({ method }: { method: FingerprintMethod }) {
  const { t } = useTranslation()

  const config = {
    finger: {
      icon: Fingerprint,
      className: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
    },
    face: {
      icon: ScanFace,
      className: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
    },
    mobile: {
      icon: Smartphone,
      className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    },
  }[method]

  const Icon = config.icon

  return (
    <span className={['inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium', config.className].join(' ')}>
      <Icon className="size-3 shrink-0" />
      {t(`fingerprint.method.${method}`)}
    </span>
  )
}

function PunchCell({
  time,
  method,
  type,
}: {
  time: string | null
  method: FingerprintMethod | null
  type: 'in' | 'out'
}) {
  const { t, i18n } = useTranslation()

  if (!time || !method) {
    return (
      <span className="text-xs text-slate-400 dark:text-slate-500">
        {t('fingerprint.notRecorded')}
      </span>
    )
  }

  const Icon = type === 'in' ? LogIn : LogOut
  const iconClass =
    type === 'in'
      ? 'text-emerald-500 dark:text-emerald-400'
      : 'text-orange-500 dark:text-orange-400'

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <Icon className={['size-3.5 shrink-0', iconClass].join(' ')} strokeWidth={2.5} />
        <span className="font-medium tabular-nums text-slate-800 dark:text-slate-200">
          {formatTime(time, i18n.language)}
        </span>
      </div>
      <MethodBadge method={method} />
    </div>
  )
}

export function FingerprintPage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const isMobile = useMediaQuery('(max-width: 767px)')
  const { records } = useAttendance()
  const [employeeFilter, setEmployeeFilter] = useState(ALL_FILTER)
  const [methodFilter, setMethodFilter] = useState(ALL_FILTER)
  const [attendanceFilter, setAttendanceFilter] = useState(ALL_FILTER)
  const [search, setSearch] = useState('')

  const filteredAttendance = useMemo(() => {
    const filtered = records.filter((record) => {
      if (record.isDeleted) return false
      if (employeeFilter !== ALL_FILTER && record.employeeId !== Number(employeeFilter)) return false
      if (methodFilter !== ALL_FILTER) {
        const usesMethod =
          record.checkInMethod === methodFilter || record.checkOutMethod === methodFilter
        if (!usesMethod) return false
      }
      if (attendanceFilter === 'checkedIn' && !record.checkIn) return false
      if (attendanceFilter === 'checkedOut' && !record.checkOut) return false
      if (attendanceFilter === 'incomplete' && record.checkOut) return false
      return true
    })
    return filterBySearch(filtered, search, tableSearchText.attendance)
  }, [records, employeeFilter, methodFilter, attendanceFilter, search])

  const exportColumns = useMemo(
    () => getFingerprintExportColumns(getExportTranslation(), EXPORT_IS_ARABIC, EXPORT_LOCALE),
    [],
  )

  const checkedIn = filteredAttendance.filter((record) => record.checkIn).length
  const mobileCount = filteredAttendance.filter(
    (record) => record.checkInMethod === 'mobile' || record.checkOutMethod === 'mobile',
  ).length
  const avgMinutes =
    filteredAttendance.filter((record) => record.workHoursMinutes > 0).reduce((sum, record) => sum + record.workHoursMinutes, 0) /
    Math.max(filteredAttendance.filter((record) => record.workHoursMinutes > 0).length, 1)

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: () => t('fingerprint.table.id'),
        cell: (info) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">#{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'employee',
        header: () => t('fingerprint.table.employee'),
        cell: ({ row }) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {isArabic ? row.original.employeeNameAr : row.original.employeeName}
          </span>
        ),
      }),
      columnHelper.accessor('date', {
        header: () => t('fingerprint.table.date'),
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300">
            {formatDate(info.getValue(), i18n.language)}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'checkIn',
        header: () => t('fingerprint.table.checkIn'),
        cell: ({ row }) => (
          <PunchCell time={row.original.checkIn} method={row.original.checkInMethod} type="in" />
        ),
      }),
      columnHelper.display({
        id: 'checkOut',
        header: () => t('fingerprint.table.checkOut'),
        cell: ({ row }) => (
          <PunchCell time={row.original.checkOut} method={row.original.checkOutMethod} type="out" />
        ),
      }),
      columnHelper.display({
        id: 'location',
        header: () => t('fingerprint.table.location'),
        cell: ({ row }) => (
          <span className="inline-flex max-w-[180px] items-start gap-1 text-xs text-slate-600 dark:text-slate-400">
            <MapPin className="mt-0.5 size-3 shrink-0" />
            {formatCoordinates(row.original.checkInLocation, isArabic)}
          </span>
        ),
      }),
      columnHelper.accessor('workHoursMinutes', {
        header: () => t('fingerprint.table.workHours'),
        cell: (info) => {
          const minutes = info.getValue()
          if (minutes === 0) {
            return <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
          }
          return (
            <span className="inline-flex items-center rounded-lg bg-sky-50 px-2.5 py-1 text-sm font-semibold tabular-nums text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
              {formatWorkHours(minutes, i18n.language)}
            </span>
          )
        },
      }),
    ],
    [t, i18n.language, isArabic],
  )

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={t('fingerprint.stats.total')} value={filteredAttendance.length} className="text-slate-900 dark:text-slate-100" />
          <StatCard label={t('fingerprint.stats.checkIn')} value={checkedIn} icon={<LogIn className="size-4 text-emerald-500" />} className="text-emerald-600 dark:text-emerald-400" />
          <StatCard label={t('fingerprint.stats.mobile')} value={mobileCount} icon={<Smartphone className="size-4 text-indigo-500" />} className="text-indigo-600 dark:text-indigo-400" />
          <StatCard label={t('fingerprint.stats.avgHours')} value={formatWorkHours(Math.round(avgMinutes), i18n.language)} isText className="text-sky-600 dark:text-sky-400" />
        </div>
        <MobileCheckInPanel />
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">{t('fingerprint.hint')}</p>

      <TableFilters
        search={search}
        onSearchChange={setSearch}
        showClear={hasActiveFilters([employeeFilter, methodFilter, attendanceFilter], search)}
        onClear={() => {
          setSearch('')
          setEmployeeFilter(ALL_FILTER)
          setMethodFilter(ALL_FILTER)
          setAttendanceFilter(ALL_FILTER)
        }}
      >
        <EmployeeFilterSelect value={employeeFilter} onChange={setEmployeeFilter} />
        <FilterSelect
          label={t('filters.method')}
          value={methodFilter}
          onChange={setMethodFilter}
          options={[
            { value: ALL_FILTER, label: t('filters.all') },
            { value: 'finger', label: t('fingerprint.method.finger') },
            { value: 'face', label: t('fingerprint.method.face') },
            { value: 'mobile', label: t('fingerprint.method.mobile') },
          ]}
        />
        <FilterSelect
          label={t('filters.attendance')}
          value={attendanceFilter}
          onChange={setAttendanceFilter}
          options={[
            { value: ALL_FILTER, label: t('filters.all') },
            { value: 'checkedIn', label: t('filters.checkedIn') },
            { value: 'checkedOut', label: t('filters.checkedOut') },
            { value: 'incomplete', label: t('filters.incomplete') },
          ]}
        />
      </TableFilters>

      <div className="flex justify-end">
        <ExportButtons
          filename="fingerprint"
          title={getExportTranslation()('nav.fingerprint')}
          data={filteredAttendance}
          columns={exportColumns}
        />
      </div>

      {isMobile ? (
        <div className="space-y-3">
          {filteredAttendance.map((record) => (
            <MobileRecordCard
              key={record.id}
              title={isArabic ? record.employeeNameAr : record.employeeName}
              subtitle={formatDate(record.date, i18n.language)}
              fields={[
                { label: t('fingerprint.table.checkIn'), value: record.checkIn ? formatTime(record.checkIn, i18n.language) : t('fingerprint.notRecorded') },
                { label: t('fingerprint.table.checkOut'), value: record.checkOut ? formatTime(record.checkOut, i18n.language) : t('fingerprint.notRecorded') },
                { label: t('fingerprint.table.location'), value: formatCoordinates(record.checkInLocation, isArabic) },
                { label: t('fingerprint.table.workHours'), value: record.workHoursMinutes ? formatWorkHours(record.workHoursMinutes, i18n.language) : '—' },
              ]}
            />
          ))}
        </div>
      ) : (
        <DataTable data={filteredAttendance} columns={columns} pageSize={8} />
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  className,
  isText,
}: {
  label: string
  value: number | string
  icon?: ReactNode
  className?: string
  isText?: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
      <p className={['mt-1 font-bold', isText ? 'text-xl' : 'text-2xl', className].filter(Boolean).join(' ')}>
        {value}
      </p>
    </div>
  )
}
