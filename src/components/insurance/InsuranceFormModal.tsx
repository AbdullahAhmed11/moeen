import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEmployees } from '../../context/EmployeesContext'
import type { Insurance, InsuranceInput } from '../../types/insurance'
import { emptyInsuranceInput } from '../../utils/insurance'
import { Modal } from '../ui/Modal'

type InsuranceFormModalProps = {
  open: boolean
  mode: 'add' | 'edit'
  record?: Insurance
  onClose: () => void
  onSubmit: (input: InsuranceInput) => void
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500'

export function InsuranceFormModal({ open, mode, record, onClose, onSubmit }: InsuranceFormModalProps) {
  const { t, i18n } = useTranslation()
  const { employees } = useEmployees()
  const isArabic = i18n.language === 'ar'
  const [form, setForm] = useState<InsuranceInput>(emptyInsuranceInput)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && record) {
      const { id: _, ...rest } = record
      setForm(rest)
    } else {
      setForm(emptyInsuranceInput)
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
    onSubmit(form)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? t('insurance.form.addTitle') : t('insurance.form.editTitle')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('insurance.form.employee')}>
            <select
              required
              value={form.employeeId || ''}
              onChange={(e) => handleEmployeeChange(Number(e.target.value))}
              className={inputClassName}
            >
              <option value="">{t('insurance.form.selectEmployee')}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {isArabic ? emp.nameAr : emp.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('insurance.table.type')}>
            <select
              required
              value={form.insuranceType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  insuranceType: e.target.value as InsuranceInput['insuranceType'],
                }))
              }
              className={inputClassName}
            >
              <option value="social">{t('insurance.type.social')}</option>
              <option value="health">{t('insurance.type.health')}</option>
              <option value="life">{t('insurance.type.life')}</option>
              <option value="accident">{t('insurance.type.accident')}</option>
              <option value="other">{t('insurance.type.other')}</option>
            </select>
          </Field>

          <Field label={t('insurance.form.providerEn')}>
            <input
              required
              value={form.provider}
              onChange={(e) => setForm((prev) => ({ ...prev, provider: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('insurance.form.providerAr')}>
            <input
              required
              value={form.providerAr}
              onChange={(e) => setForm((prev) => ({ ...prev, providerAr: e.target.value }))}
              className={inputClassName}
              dir="rtl"
            />
          </Field>

          <Field label={t('insurance.table.policyNumber')}>
            <input
              required
              value={form.policyNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, policyNumber: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('insurance.table.status')}>
            <select
              required
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as InsuranceInput['status'],
                }))
              }
              className={inputClassName}
            >
              <option value="pending">{t('insurance.status.pending')}</option>
              <option value="active">{t('insurance.status.active')}</option>
              <option value="expired">{t('insurance.status.expired')}</option>
              <option value="cancelled">{t('insurance.status.cancelled')}</option>
            </select>
          </Field>

          <Field label={t('insurance.table.startDate')}>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('insurance.table.endDate')}>
            <input
              required
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('insurance.table.monthlyPremium')}>
            <input
              required
              type="number"
              min={0}
              value={form.monthlyPremium || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, monthlyPremium: Number(e.target.value) }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('insurance.table.coverageAmount')}>
            <input
              required
              type="number"
              min={0}
              value={form.coverageAmount || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, coverageAmount: Number(e.target.value) }))}
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
            {mode === 'add' ? t('insurance.form.addSubmit') : t('insurance.form.editSubmit')}
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
