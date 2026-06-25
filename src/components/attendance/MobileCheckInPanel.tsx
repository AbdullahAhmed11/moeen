import { Loader2, LogIn, LogOut, MapPin, Smartphone } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAttendance } from '../../context/AttendanceContext'
import { useEmployees } from '../../context/EmployeesContext'
import { formatTime } from '../../utils/date'
import { formatCoordinates } from '../../utils/attendance'

export function MobileCheckInPanel() {
  const { t, i18n } = useTranslation()
  const { employees } = useEmployees()
  const { records, mobileCheckIn, mobileCheckOut } = useAttendance()
  const isArabic = i18n.language === 'ar'
  const [employeeId, setEmployeeId] = useState<number>(employees[0]?.id ?? 0)
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().slice(0, 10)
  const todayRecord = useMemo(
    () => records.find((record) => record.employeeId === employeeId && record.date === today),
    [records, employeeId, today],
  )

  const selectedEmployee = employees.find((employee) => employee.id === employeeId)

  const handleCheckIn = async () => {
    if (!selectedEmployee) return
    setLoading(true)
    try {
      await mobileCheckIn(
        selectedEmployee.id,
        selectedEmployee.name,
        selectedEmployee.nameAr,
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!todayRecord) return
    setLoading(true)
    try {
      await mobileCheckOut(todayRecord.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-indigo-200/80 bg-linear-to-br from-indigo-50 to-violet-50 p-4 shadow-sm dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-violet-500/10">
      <div className="flex items-center gap-2">
        <Smartphone className="size-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {t('fingerprint.mobile.title')}
        </h3>
      </div>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
        {t('fingerprint.mobile.description')}
      </p>

      <div className="mt-4 space-y-3">
        <select
          value={employeeId || ''}
          onChange={(e) => setEmployeeId(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {isArabic ? employee.nameAr : employee.name}
            </option>
          ))}
        </select>

        {todayRecord && (
          <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3 text-xs dark:border-slate-700/80 dark:bg-slate-900/60">
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {t('fingerprint.mobile.todayStatus')}
            </p>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {t('fingerprint.table.checkIn')}: {formatTime(todayRecord.checkIn, i18n.language)}
            </p>
            {todayRecord.checkInLocation && (
              <p className="mt-1 flex items-start gap-1 text-slate-600 dark:text-slate-400">
                <MapPin className="mt-0.5 size-3 shrink-0" />
                {formatCoordinates(todayRecord.checkInLocation, isArabic)}
              </p>
            )}
            {todayRecord.checkOut && (
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {t('fingerprint.table.checkOut')}: {formatTime(todayRecord.checkOut, i18n.language)}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={loading || !!todayRecord?.checkIn}
            onClick={handleCheckIn}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
            {t('fingerprint.mobile.checkIn')}
          </button>
          <button
            type="button"
            disabled={loading || !todayRecord?.checkIn || !!todayRecord?.checkOut}
            onClick={handleCheckOut}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
            {t('fingerprint.mobile.checkOut')}
          </button>
        </div>
      </div>
    </div>
  )
}
