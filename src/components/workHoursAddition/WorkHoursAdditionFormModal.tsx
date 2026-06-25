import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEmployees } from '../../context/EmployeesContext'
import type { WorkHoursAddition, WorkHoursAdditionInput } from '../../types/workHoursAddition'
import {
  emptyWorkHoursAdditionInput,
  hoursInputToMinutes,
  minutesToHoursInput,
} from '../../utils/workHoursAddition'
import { Modal } from '../ui/Modal'

type WorkHoursAdditionFormModalProps = {
  open: boolean
  mode: 'add' | 'edit'
  record?: WorkHoursAddition
  onClose: () => void
  onSubmit: (input: WorkHoursAdditionInput) => void
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500'

export function WorkHoursAdditionFormModal({
  open,
  mode,
  record,
  onClose,
  onSubmit,
}: WorkHoursAdditionFormModalProps) {
  const { t, i18n } = useTranslation()
  const { employees } = useEmployees()
  const isArabic = i18n.language === 'ar'
  const [form, setForm] = useState<WorkHoursAdditionInput>(emptyWorkHoursAdditionInput)
  const [hoursInput, setHoursInput] = useState('0')

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && record) {
      const { id: _, ...rest } = record
      setForm(rest)
      setHoursInput(String(minutesToHoursInput(record.addedMinutes)))
    } else {
      setForm(emptyWorkHoursAdditionInput)
      setHoursInput('0')
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({
      ...form,
      addedMinutes: hoursInputToMinutes(Number(hoursInput)),
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        mode === 'add'
          ? t('workHoursAddition.form.addTitle')
          : t('workHoursAddition.form.editTitle')
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('workHoursAddition.form.employee')}>
            <select
              required
              value={form.employeeId || ''}
              onChange={(e) => handleEmployeeChange(Number(e.target.value))}
              className={inputClassName}
            >
              <option value="">{t('workHoursAddition.form.selectEmployee')}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {isArabic ? emp.nameAr : emp.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('workHoursAddition.table.date')}>
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('workHoursAddition.table.addedHours')}>
            <input
              required
              type="number"
              min={0}
              step={0.25}
              value={hoursInput}
              onChange={(e) => setHoursInput(e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label={t('workHoursAddition.table.amount')}>
            <input
              required
              type="number"
              min={0}
              value={form.amount || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: Number(e.target.value) }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('workHoursAddition.form.reasonEn')}>
            <input
              required
              value={form.reason}
              onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('workHoursAddition.form.reasonAr')}>
            <input
              required
              value={form.reasonAr}
              onChange={(e) => setForm((prev) => ({ ...prev, reasonAr: e.target.value }))}
              className={inputClassName}
              dir="rtl"
            />
          </Field>

          <Field label={t('workHoursAddition.table.status')}>
            <select
              required
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as WorkHoursAdditionInput['status'],
                }))
              }
              className={inputClassName}
            >
              <option value="pending">{t('workHoursAddition.status.pending')}</option>
              <option value="approved">{t('workHoursAddition.status.approved')}</option>
              <option value="rejected">{t('workHoursAddition.status.rejected')}</option>
            </select>
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
            {mode === 'add'
              ? t('workHoursAddition.form.addSubmit')
              : t('workHoursAddition.form.editSubmit')}
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
