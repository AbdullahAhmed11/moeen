import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AttendanceChart } from '../components/dashboard/AttendanceChart'
import { DepartmentChart } from '../components/dashboard/DepartmentChart'
import { LeaveChart } from '../components/dashboard/LeaveChart'
import { PayrollChart } from '../components/dashboard/PayrollChart'
import { ExportButtons } from '../components/ui/ExportButtons'
import { FilterDateInput } from '../components/ui/FilterDateInput'
import { FilterSelect } from '../components/ui/FilterSelect'
import { TableFilters } from '../components/ui/TableFilters'
import { weeklyAttendance } from '../data/dashboard'
import { ALL_FILTER, hasActiveFilters } from '../utils/filters'
import type { ExportColumn } from '../types/export'
import { hasDateRangeFilter, isWithinDateRange } from '../utils/dateRange'
import { getExportTranslation } from '../utils/exportLocale'

export function DashboardPage() {
  const { t } = useTranslation()
  const [periodFilter, setPeriodFilter] = useState(ALL_FILTER)
  const [departmentFilter, setDepartmentFilter] = useState(ALL_FILTER)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const stats = [
    { labelKey: 'stats.totalEmployees', value: '248', changeKey: 'stats.employeesChange' },
    { labelKey: 'stats.presentToday', value: '231', changeKey: 'stats.attendanceRate' },
    { labelKey: 'stats.onLeave', value: '17', changeKey: 'stats.leavePending' },
    { labelKey: 'stats.openPositions', value: '8', changeKey: 'stats.interviewsToday' },
  ] as const

  type AttendanceExportRow = { day: string; present: number; absent: number }

  const attendanceExportData = useMemo<AttendanceExportRow[]>(
    () =>
      weeklyAttendance
        .filter((item) => isWithinDateRange(item.date, fromDate, toDate))
        .map((item) => ({
          day: getExportTranslation()(`dashboard.charts.days.${item.dayKey}`),
          present: item.present,
          absent: item.absent,
        })),
    [fromDate, toDate],
  )

  const attendanceExportColumns = useMemo<ExportColumn<AttendanceExportRow>[]>(
    () => [
      { header: getExportTranslation()('dashboard.charts.attendance'), getValue: (r) => r.day },
      { header: getExportTranslation()('dashboard.charts.attendancePresent'), getValue: (r) => r.present },
      { header: getExportTranslation()('dashboard.charts.attendanceAbsent'), getValue: (r) => r.absent },
    ],
    [],
  )

  const showClear =
    hasActiveFilters([periodFilter, departmentFilter]) || hasDateRangeFilter(fromDate, toDate)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.labelKey}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-slate-950/50 dark:hover:shadow-slate-950/80"
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {t(stat.labelKey)}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
              {t(stat.changeKey)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <ExportButtons
          filename="dashboard-attendance"
          title={getExportTranslation()('dashboard.charts.attendance')}
          data={attendanceExportData}
          columns={attendanceExportColumns}
        />
      </div>

      <TableFilters
        showClear={showClear}
        onClear={() => {
          setPeriodFilter(ALL_FILTER)
          setDepartmentFilter(ALL_FILTER)
          setFromDate('')
          setToDate('')
        }}
      >
        <FilterDateInput
          label={t('filters.fromDate')}
          value={fromDate}
          onChange={setFromDate}
          max={toDate || undefined}
        />
        <FilterDateInput
          label={t('filters.toDate')}
          value={toDate}
          onChange={setToDate}
          min={fromDate || undefined}
        />
        <FilterSelect
          label={t('filters.period')}
          value={periodFilter}
          onChange={setPeriodFilter}
          options={[
            { value: ALL_FILTER, label: t('filters.periodAll') },
            { value: '3m', label: t('filters.period3m') },
            { value: '6m', label: t('filters.period6m') },
          ]}
        />
        <FilterSelect
          label={t('filters.department')}
          value={departmentFilter}
          onChange={setDepartmentFilter}
          options={[
            { value: ALL_FILTER, label: t('filters.all') },
            { value: 'hr', label: t('dashboard.charts.departments.hr') },
            { value: 'it', label: t('dashboard.charts.departments.it') },
            { value: 'finance', label: t('dashboard.charts.departments.finance') },
            { value: 'operations', label: t('dashboard.charts.departments.operations') },
            { value: 'sales', label: t('dashboard.charts.departments.sales') },
            { value: 'other', label: t('dashboard.charts.departments.other') },
          ]}
        />
      </TableFilters>

      <div className="grid gap-4 lg:grid-cols-2">
        <AttendanceChart fromDate={fromDate} toDate={toDate} />
        <DepartmentChart departmentFilter={departmentFilter} />
        <PayrollChart periodFilter={periodFilter} fromDate={fromDate} toDate={toDate} />
        <LeaveChart periodFilter={periodFilter} fromDate={fromDate} toDate={toDate} />
      </div>
    </div>
  )
}
