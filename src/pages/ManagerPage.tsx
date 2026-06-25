import { Check, Clock, MapPin, Users, X } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MobileRecordCard } from '../components/ui/MobileRecordCard'
import { CURRENT_MANAGER_ID } from '../config/manager'
import { useAttendance } from '../context/AttendanceContext'
import { useEmployees } from '../context/EmployeesContext'
import { useLeaves } from '../context/LeaveContext'
import { initialPenalties } from '../data/penalties'
import { formatDate, formatTime } from '../utils/date'
import { formatWorkHours } from '../utils/workHours'
import { formatCoordinates } from '../utils/attendance'

export function ManagerPage() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { employees } = useEmployees()
  const { records } = useAttendance()
  const { getPendingForManager, approveLeave, rejectLeave } = useLeaves()

  const manager = employees.find((employee) => employee.id === CURRENT_MANAGER_ID)
  const team = useMemo(
    () => employees.filter((employee) => employee.managerId === CURRENT_MANAGER_ID),
    [employees],
  )
  const pendingLeaves = getPendingForManager(CURRENT_MANAGER_ID)
  const today = new Date().toISOString().slice(0, 10)

  const teamAttendance = useMemo(() => {
    return team.map((member) => {
      const record = records.find(
        (item) =>
          !item.isDeleted && item.employeeId === member.id && item.date === today,
      )
      return { member, record }
    })
  }, [team, records, today])

  const pendingPenalties = initialPenalties.filter(
    (penalty) =>
      !penalty.isDeleted &&
      penalty.status === 'pending' &&
      team.some((member) => member.id === penalty.employeeId),
  )

  const checkedInCount = teamAttendance.filter((item) => item.record?.checkIn).length
  const onLeaveCount = team.filter((member) => member.status === 'on_leave').length

  if (!manager) return null

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <section className="rounded-2xl border border-indigo-200/80 bg-linear-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-100">
          {t('manager.greeting')}
        </p>
        <h2 className="mt-1 text-xl font-bold">
          {isArabic ? manager.nameAr : manager.name}
        </h2>
        <p className="mt-1 text-sm text-indigo-100">{t('manager.subtitle')}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <QuickStat icon={<Users className="size-4" />} label={t('manager.stats.team')} value={team.length} />
          <QuickStat icon={<Clock className="size-4" />} label={t('manager.stats.present')} value={checkedInCount} />
          <QuickStat icon={<MapPin className="size-4" />} label={t('manager.stats.onLeave')} value={onLeaveCount} />
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader title={t('manager.pendingLeaves')} count={pendingLeaves.length} href="/leave" />
        {pendingLeaves.length === 0 ? (
          <EmptyState message={t('manager.noPendingLeaves')} />
        ) : (
          pendingLeaves.map((leave) => (
            <MobileRecordCard
              key={leave.id}
              title={isArabic ? leave.employeeNameAr : leave.employeeName}
              subtitle={t(`leave.type.${leave.leaveType}`)}
              fields={[
                { label: t('leave.table.startDate'), value: formatDate(leave.startDate, i18n.language) },
                { label: t('leave.table.endDate'), value: formatDate(leave.endDate, i18n.language) },
                { label: t('leave.table.days'), value: leave.days },
                { label: t('leave.table.reason'), value: isArabic ? leave.reasonAr : leave.reason },
              ]}
              actions={
                <>
                  <button type="button" onClick={() => approveLeave(leave.id)} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white">
                    <Check className="size-4" />
                    {t('leave.actions.approveShort')}
                  </button>
                  <button type="button" onClick={() => rejectLeave(leave.id)} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white">
                    <X className="size-4" />
                    {t('leave.actions.rejectShort')}
                  </button>
                </>
              }
            />
          ))
        )}
      </section>

      <section className="space-y-3">
        <SectionHeader title={t('manager.teamAttendance')} count={team.length} href="/fingerprint" />
        {teamAttendance.map(({ member, record }) => (
          <MobileRecordCard
            key={member.id}
            title={isArabic ? member.nameAr : member.name}
            subtitle={isArabic ? member.jobTitleAr : member.jobTitle}
            badge={
              <span
                className={[
                  'rounded-full px-2 py-0.5 text-[11px] font-medium',
                  record?.checkIn
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                ].join(' ')}
              >
                {record?.checkIn ? t('manager.present') : t('manager.absent')}
              </span>
            }
            fields={[
              {
                label: t('fingerprint.table.checkIn'),
                value: record?.checkIn
                  ? formatTime(record.checkIn, i18n.language)
                  : t('fingerprint.notRecorded'),
              },
              {
                label: t('fingerprint.table.checkOut'),
                value: record?.checkOut
                  ? formatTime(record.checkOut, i18n.language)
                  : t('fingerprint.notRecorded'),
              },
              {
                label: t('fingerprint.table.workHours'),
                value: record?.workHoursMinutes
                  ? formatWorkHours(record.workHoursMinutes, i18n.language)
                  : '—',
              },
              {
                label: t('fingerprint.table.location'),
                value: formatCoordinates(record?.checkInLocation ?? null, isArabic),
              },
            ]}
          />
        ))}
      </section>

      {pendingPenalties.length > 0 && (
        <section className="space-y-3">
          <SectionHeader title={t('manager.pendingPenalties')} count={pendingPenalties.length} href="/penalties" />
          {pendingPenalties.map((penalty) => (
            <MobileRecordCard
              key={penalty.id}
              title={isArabic ? penalty.employeeNameAr : penalty.employeeName}
              subtitle={t(`penalties.type.${penalty.penaltyType}`)}
              fields={[
                { label: t('penalties.table.date'), value: formatDate(penalty.date, i18n.language) },
                { label: t('penalties.table.reason'), value: isArabic ? penalty.reasonAr : penalty.reason },
              ]}
            />
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-3 pb-4">
        <QuickLink to="/leave" label={t('nav.leave')} />
        <QuickLink to="/fingerprint" label={t('nav.fingerprint')} />
        <QuickLink to="/salaries" label={t('nav.salaries')} />
        <QuickLink to="/employees" label={t('nav.employees')} />
      </div>
    </div>
  )
}

function SectionHeader({ title, count, href }: { title: string; count: number; href: string }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {title} <span className="text-slate-400">({count})</span>
      </h3>
      <Link to={href} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
        {t('manager.viewAll')}
      </Link>
    </div>
  )
}

function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/15 px-3 py-2">
      <div className="flex items-center gap-1 text-indigo-100">{icon}<span className="text-[11px]">{label}</span></div>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      {message}
    </p>
  )
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      {label}
    </Link>
  )
}
