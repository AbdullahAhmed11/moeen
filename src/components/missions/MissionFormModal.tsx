import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEmployees } from '../../context/EmployeesContext'
import type { Mission, MissionInput } from '../../types/mission'
import { calcMissionDays, emptyMissionInput } from '../../utils/mission'
import { Modal } from '../ui/Modal'

type MissionFormModalProps = {
  open: boolean
  mode: 'add' | 'edit'
  record?: Mission
  onClose: () => void
  onSubmit: (input: MissionInput) => void
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500'

export function MissionFormModal({ open, mode, record, onClose, onSubmit }: MissionFormModalProps) {
  const { t, i18n } = useTranslation()
  const { employees } = useEmployees()
  const isArabic = i18n.language === 'ar'
  const [form, setForm] = useState<MissionInput>(emptyMissionInput)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && record) {
      const { id: _, ...rest } = record
      setForm(rest)
    } else {
      setForm(emptyMissionInput)
    }
  }, [open, mode, record])

  const handleEmployeeChange = (employeeId: number) => {
    const employee = employees.find((e) => e.id === employeeId)
    if (!employee) return
    setForm((prev) => ({
      ...prev,
      employeeId,
      employeeName: employee.name,
      employeeNameAr: employee.nameAr,
    }))
  }

  const updateDates = (field: 'startDate' | 'endDate', value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      next.missionDays = calcMissionDays(next.startDate, next.endDate)
      return next
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({
      ...form,
      missionDays: calcMissionDays(form.startDate, form.endDate),
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? t('missions.form.addTitle') : t('missions.form.editTitle')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('missions.form.employee')}>
            <select
              required
              value={form.employeeId || ''}
              onChange={(e) => handleEmployeeChange(Number(e.target.value))}
              className={inputClassName}
            >
              <option value="">{t('missions.form.selectEmployee')}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {isArabic ? emp.nameAr : emp.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('missions.table.status')}>
            <select
              required
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as MissionInput['status'],
                }))
              }
              className={inputClassName}
            >
              <option value="pending">{t('missions.status.pending')}</option>
              <option value="approved">{t('missions.status.approved')}</option>
              <option value="in_progress">{t('missions.status.in_progress')}</option>
              <option value="completed">{t('missions.status.completed')}</option>
              <option value="cancelled">{t('missions.status.cancelled')}</option>
            </select>
          </Field>

          <Field label={t('missions.form.destinationEn')}>
            <input
              required
              value={form.destination}
              onChange={(e) => setForm((prev) => ({ ...prev, destination: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('missions.form.destinationAr')}>
            <input
              required
              value={form.destinationAr}
              onChange={(e) => setForm((prev) => ({ ...prev, destinationAr: e.target.value }))}
              className={inputClassName}
              dir="rtl"
            />
          </Field>

          <Field label={t('missions.form.purposeEn')}>
            <input
              required
              value={form.purpose}
              onChange={(e) => setForm((prev) => ({ ...prev, purpose: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('missions.form.purposeAr')}>
            <input
              required
              value={form.purposeAr}
              onChange={(e) => setForm((prev) => ({ ...prev, purposeAr: e.target.value }))}
              className={inputClassName}
              dir="rtl"
            />
          </Field>

          <Field label={t('missions.table.startDate')}>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => updateDates('startDate', e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label={t('missions.table.endDate')}>
            <input
              required
              type="date"
              value={form.endDate}
              onChange={(e) => updateDates('endDate', e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label={t('missions.table.missionDays')}>
            <input
              readOnly
              type="number"
              value={form.missionDays}
              className={[inputClassName, 'bg-slate-50 dark:bg-slate-800/80'].join(' ')}
            />
          </Field>

          <Field label={t('missions.table.allowance')}>
            <input
              required
              type="number"
              min={0}
              value={form.allowance || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, allowance: Number(e.target.value) }))}
              className={inputClassName}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200/80 pt-4 dark:border-slate-700/80">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {mode === 'add' ? t('missions.form.addSubmit') : t('missions.form.editSubmit')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
    </label>
  )
}
