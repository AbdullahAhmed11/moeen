import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAttendance } from '../../context/AttendanceContext'
import { useLeaves } from '../../context/LeaveContext'
import { initialPenalties } from '../../data/penalties'
import { initialSalaries } from '../../data/salaries'
import type { Employee } from '../../types/employee'
import { formatCoordinates } from '../../utils/attendance'
import { formatCurrency, getNetSalary } from '../../utils/currency'
import { formatDate, formatTime } from '../../utils/date'
import { formatMonthLabel } from '../../utils/exportHelpers'
import { buildPayrollRow } from '../../utils/employeePayroll'
import { formatWorkHours } from '../../utils/workHours'
import { FilterSelect } from '../ui/FilterSelect'
import { MobileRecordCard } from '../ui/MobileRecordCard'
import { EmployeePayslipSlip } from './EmployeePayslipSlip'
import { PayslipExportButtons } from './PayslipExportButtons'

type TabKey = 'overview' | 'attendance' | 'leave' | 'payroll' | 'penalties'

type EmployeeProfileTabsProps = {
  employee: Employee
}

export function EmployeeProfileTabs({ employee }: EmployeeProfileTabsProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const { getEmployeeRecords } = useAttendance()
  const { getEmployeeLeaves } = useLeaves()

  const attendance = getEmployeeRecords(employee.id)
  const leaves = getEmployeeLeaves(employee.id)
  const salaries = useMemo(
    () => initialSalaries.filter((salary) => salary.employeeId === employee.id && !salary.isDeleted),
    [employee.id],
  )
  const payrollRow = useMemo(() => buildPayrollRow(employee, 0), [employee])

  const monthOptions = useMemo(() => {
    const months =
      salaries.length > 0
        ? [...new Set(salaries.map((salary) => salary.month))].sort().reverse()
        : [new Date().toISOString().slice(0, 7)]
    return months.map((month) => ({
      value: month,
      label: formatMonthLabel(month, i18n.language),
    }))
  }, [salaries, i18n.language])

  const [selectedMonth, setSelectedMonth] = useState('')

  useEffect(() => {
    setSelectedMonth(monthOptions[0]?.value ?? new Date().toISOString().slice(0, 7))
  }, [employee.id, monthOptions])
  const penalties = useMemo(
    () => initialPenalties.filter((penalty) => penalty.employeeId === employee.id && !penalty.isDeleted),
    [employee.id],
  )

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: t('employees.profile.tabs.overview') },
    { key: 'attendance', label: t('employees.profile.tabs.attendance') },
    { key: 'leave', label: t('employees.profile.tabs.leave') },
    { key: 'payroll', label: t('employees.profile.tabs.payroll') },
    { key: 'penalties', label: t('employees.profile.tabs.penalties') },
  ]

  const overviewFields = [
    { label: t('employees.profile.email'), value: employee.email },
    { label: t('employees.profile.phone'), value: employee.phone },
    { label: t('employees.form.dateOfBirth'), value: formatDate(employee.dateOfBirth, i18n.language) },
    { label: t('employees.profile.hireDate'), value: formatDate(employee.hireDate, i18n.language) },
    { label: t('employees.form.militaryStatus'), value: t(`employees.militaryStatus.${employee.militaryStatus}`) },
    { label: t('employees.form.maritalStatus'), value: t(`employees.maritalStatus.${employee.maritalStatus}`) },
    { label: t('employees.profile.status'), value: t(`employees.status.${employee.status}`) },
    { label: t('employees.profile.annualBalance'), value: `${employee.annualLeaveBalance} ${t('leave.table.days')}` },
    { label: t('employees.profile.sickBalance'), value: `${employee.sickLeaveBalance} ${t('leave.table.days')}` },
    { label: t('employees.table.directManager'), value: employee.managerId ? (isArabic ? employee.managerNameAr : employee.managerName) : t('employees.noManager') },
    { label: t('employees.details.netSalary'), value: formatCurrency(getNetSalary(employee), i18n.language), className: 'text-indigo-600 dark:text-indigo-400 font-semibold' },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200/80 bg-slate-50/80 p-2 dark:border-slate-700/80 dark:bg-slate-800/50">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={[
              'shrink-0 rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:text-sm',
              activeTab === tab.key
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid gap-px bg-slate-200/80 dark:bg-slate-700/80 sm:grid-cols-2">
              {overviewFields.map((field) => (
                <div key={field.label} className="bg-white px-4 py-3 dark:bg-slate-900">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{field.label}</p>
                  <p className={['mt-1 text-sm font-medium text-slate-900 dark:text-slate-100', field.className].filter(Boolean).join(' ')}>{field.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('employees.documents.title')}
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <DocumentPreview
                  label={t('employees.form.healthCertificate')}
                  src={employee.healthCertificateImage}
                  emptyLabel={t('employees.documents.notUploaded')}
                />
                <DocumentPreview
                  label={t('employees.form.idCardImage')}
                  src={employee.idCardImage}
                  emptyLabel={t('employees.documents.notUploaded')}
                />
                <DocumentPreview
                  label={t('employees.form.licenseImage')}
                  src={employee.licenseImage}
                  emptyLabel={t('employees.documents.notUploaded')}
                />
                <DocumentPreview
                  label={t('employees.form.birthCertificateImage')}
                  src={employee.birthCertificateImage}
                  emptyLabel={t('employees.documents.notUploaded')}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-3">
            {attendance.length === 0 ? (
              <EmptyTab message={t('employees.profile.noAttendance')} />
            ) : (
              attendance.map((record) => (
                <MobileRecordCard
                  key={record.id}
                  title={formatDate(record.date, i18n.language)}
                  subtitle={t(`fingerprint.method.${record.checkInMethod}`)}
                  fields={[
                    { label: t('fingerprint.table.checkIn'), value: formatTime(record.checkIn, i18n.language) },
                    { label: t('fingerprint.table.checkOut'), value: record.checkOut ? formatTime(record.checkOut, i18n.language) : t('fingerprint.notRecorded') },
                    { label: t('fingerprint.table.workHours'), value: record.workHoursMinutes ? formatWorkHours(record.workHoursMinutes, i18n.language) : '—' },
                    { label: t('fingerprint.table.location'), value: formatCoordinates(record.checkInLocation, isArabic) },
                  ]}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="space-y-3">
            {leaves.length === 0 ? (
              <EmptyTab message={t('employees.profile.noLeave')} />
            ) : (
              leaves.map((leave) => (
                <MobileRecordCard
                  key={leave.id}
                  title={t(`leave.type.${leave.leaveType}`)}
                  subtitle={`${formatDate(leave.startDate, i18n.language)} – ${formatDate(leave.endDate, i18n.language)}`}
                  badge={
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                      {t(`leave.status.${leave.status}`)}
                    </span>
                  }
                  fields={[
                    { label: t('leave.table.days'), value: leave.days },
                    { label: t('leave.table.reason'), value: isArabic ? leave.reasonAr : leave.reason },
                  ]}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <FilterSelect
                label={t('employees.payslip.selectMonth')}
                value={selectedMonth}
                onChange={setSelectedMonth}
                options={monthOptions}
                className="sm:max-w-[220px]"
              />
              {selectedMonth ? <PayslipExportButtons row={payrollRow} month={selectedMonth} /> : null}
            </div>
            {selectedMonth ? (
              <EmployeePayslipSlip row={payrollRow} month={selectedMonth} />
            ) : null}
          </div>
        )}

        {activeTab === 'penalties' && (
          <div className="space-y-3">
            {penalties.length === 0 ? (
              <EmptyTab message={t('employees.profile.noPenalties')} />
            ) : (
              penalties.map((penalty) => (
                <MobileRecordCard
                  key={penalty.id}
                  title={t(`penalties.type.${penalty.penaltyType}`)}
                  subtitle={formatDate(penalty.date, i18n.language)}
                  badge={
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                      {t(`penalties.status.${penalty.status}`)}
                    </span>
                  }
                  fields={[
                    { label: t('penalties.table.amount'), value: penalty.amount > 0 ? formatCurrency(penalty.amount, i18n.language) : t('penalties.noAmount') },
                    { label: t('penalties.table.reason'), value: isArabic ? penalty.reasonAr : penalty.reason },
                  ]}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function DocumentPreview({
  label,
  src,
  emptyLabel,
}: {
  label: string
  src: string
  emptyLabel: string
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 p-3 dark:border-slate-700/80">
      <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      {src ? (
        <img src={src} alt={label} className="h-32 w-full rounded-lg object-contain bg-slate-50 dark:bg-slate-800" />
      ) : (
        <p className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400 dark:border-slate-700">
          {emptyLabel}
        </p>
      )}
    </div>
  )
}

function EmptyTab({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      {message}
    </p>
  )
}
