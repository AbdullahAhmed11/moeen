import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEmployees } from '../../context/EmployeesContext'
import type { WorkInterruption, WorkInterruptionInput } from '../../types/workInterruption'
import { calcInterruptedDays, emptyWorkInterruptionInput } from '../../utils/workInterruption'
import { Modal } from '../ui/Modal'

type WorkInterruptionFormModalProps = {
  open: boolean
  mode: 'add' | 'edit'
  record?: WorkInterruption
  onClose: () => void
  onSubmit: (input: WorkInterruptionInput) => void
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500'

export function WorkInterruptionFormModal({
  open,
  mode,
  record,
  onClose,
  onSubmit,
}: WorkInterruptionFormModalProps) {
  const { t, i18n } = useTranslation()
  const { employees } = useEmployees()
  const isArabic = i18n.language === 'ar'
  const [form, setForm] = useState<WorkInterruptionInput>(emptyWorkInterruptionInput)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && record) {
      const { id: _, ...rest } = record
      setForm(rest)
    } else {
      setForm(emptyWorkInterruptionInput)
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
      next.interruptedDays = calcInterruptedDays(next.startDate, next.endDate)
      return next
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({
      ...form,
      interruptedDays: calcInterruptedDays(form.startDate, form.endDate),
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        mode === 'add'
          ? t('workInterruption.form.addTitle')
          : t('workInterruption.form.editTitle')
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('workInterruption.form.employee')}>
            <select
              required
              value={form.employeeId || ''}
              onChange={(e) => handleEmployeeChange(Number(e.target.value))}
              className={inputClassName}
            >
              <option value="">{t('workInterruption.form.selectEmployee')}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {isArabic ? emp.nameAr : emp.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('workInterruption.table.type')}>
            <select
              required
              value={form.interruptionType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  interruptionType: e.target.value as WorkInterruptionInput['interruptionType'],
                }))
              }
              className={inputClassName}
            >
              <option value="absence">{t('workInterruption.type.absence')}</option>
              <option value="leave">{t('workInterruption.type.leave')}</option>
              <option value="sick">{t('workInterruption.type.sick')}</option>
              <option value="unauthorized">{t('workInterruption.type.unauthorized')}</option>
              <option value="other">{t('workInterruption.type.other')}</option>
            </select>
          </Field>

          <Field label={t('workInterruption.table.startDate')}>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => updateDates('startDate', e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label={t('workInterruption.table.endDate')}>
            <input
              required
              type="date"
              value={form.endDate}
              onChange={(e) => updateDates('endDate', e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label={t('workInterruption.table.days')}>
            <input
              readOnly
              value={form.interruptedDays}
              className={`${inputClassName} bg-slate-50 dark:bg-slate-800/80`}
            />
          </Field>

          <Field label={t('workInterruption.table.status')}>
            <select
              required
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as WorkInterruptionInput['status'],
                }))
              }
              className={inputClassName}
            >
              <option value="pending">{t('workInterruption.status.pending')}</option>
              <option value="approved">{t('workInterruption.status.approved')}</option>
              <option value="rejected">{t('workInterruption.status.rejected')}</option>
            </select>
          </Field>

          <Field label={t('workInterruption.form.reasonEn')}>
            <input
              required
              value={form.reason}
              onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('workInterruption.form.reasonAr')}>
            <input
              required
              value={form.reasonAr}
              onChange={(e) => setForm((prev) => ({ ...prev, reasonAr: e.target.value }))}
              className={inputClassName}
              dir="rtl"
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
            {mode === 'add'
              ? t('workInterruption.form.addSubmit')
              : t('workInterruption.form.editSubmit')}
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
