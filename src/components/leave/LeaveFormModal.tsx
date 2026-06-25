import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEmployees } from '../../context/EmployeesContext'
import type { LeaveInput, LeaveRequest } from '../../types/leave'
import { calcLeaveDays, emptyLeaveInput } from '../../utils/leave'
import { Modal } from '../ui/Modal'

type LeaveFormModalProps = {
  open: boolean
  mode: 'add' | 'edit'
  record?: LeaveRequest
  onClose: () => void
  onSubmit: (input: LeaveInput) => void
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500'

export function LeaveFormModal({ open, mode, record, onClose, onSubmit }: LeaveFormModalProps) {
  const { t, i18n } = useTranslation()
  const { employees } = useEmployees()
  const isArabic = i18n.language === 'ar'
  const [form, setForm] = useState<LeaveInput>(emptyLeaveInput)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && record) {
      const { id: _, ...rest } = record
      setForm(rest)
    } else {
      setForm(emptyLeaveInput)
    }
  }, [open, mode, record])

  const handleEmployeeChange = (employeeId: number) => {
    const employee = employees.find((item) => item.id === employeeId)
    if (!employee) return
    setForm((prev) => ({
      ...prev,
      employeeId,
      employeeName: employee.name,
      employeeNameAr: employee.nameAr,
    }))
  }

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (next.startDate && next.endDate) {
        next.days = calcLeaveDays(next.startDate, next.endDate)
      }
      return next
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit(form)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? t('leave.form.addTitle') : t('leave.form.editTitle')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('leave.form.employee')}>
            <select
              required
              value={form.employeeId || ''}
              onChange={(e) => handleEmployeeChange(Number(e.target.value))}
              className={inputClassName}
            >
              <option value="">{t('leave.form.selectEmployee')}</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {isArabic ? employee.nameAr : employee.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('leave.table.type')}>
            <select
              required
              value={form.leaveType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  leaveType: e.target.value as LeaveInput['leaveType'],
                }))
              }
              className={inputClassName}
            >
              <option value="annual">{t('leave.type.annual')}</option>
              <option value="sick">{t('leave.type.sick')}</option>
              <option value="unpaid">{t('leave.type.unpaid')}</option>
              <option value="emergency">{t('leave.type.emergency')}</option>
              <option value="other">{t('leave.type.other')}</option>
            </select>
          </Field>

          <Field label={t('leave.table.startDate')}>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label={t('leave.table.endDate')}>
            <input
              required
              type="date"
              value={form.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label={t('leave.table.days')}>
            <input
              readOnly
              type="number"
              value={form.days}
              className={inputClassName}
            />
          </Field>

          <Field label={t('leave.table.status')}>
            <select
              required
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as LeaveInput['status'],
                }))
              }
              className={inputClassName}
            >
              <option value="pending">{t('leave.status.pending')}</option>
              <option value="approved">{t('leave.status.approved')}</option>
              <option value="rejected">{t('leave.status.rejected')}</option>
              <option value="cancelled">{t('leave.status.cancelled')}</option>
            </select>
          </Field>

          <Field label={t('leave.form.reasonEn')}>
            <textarea
              required
              rows={3}
              value={form.reason}
              onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('leave.form.reasonAr')}>
            <textarea
              required
              rows={3}
              value={form.reasonAr}
              onChange={(e) => setForm((prev) => ({ ...prev, reasonAr: e.target.value }))}
              className={inputClassName}
              dir="rtl"
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200/80 pt-4 dark:border-slate-700/80">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            {t('common.cancel')}
          </button>
          <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
            {mode === 'add' ? t('leave.form.addSubmit') : t('leave.form.editSubmit')}
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
