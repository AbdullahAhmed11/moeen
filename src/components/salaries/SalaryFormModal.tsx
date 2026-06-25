import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEmployees } from '../../context/EmployeesContext'
import type { Salary, SalaryInput } from '../../types/salary'
import { calculateNetSalary, emptySalaryInput } from '../../utils/salary'
import { Modal } from '../ui/Modal'

type SalaryFormModalProps = {
  open: boolean
  mode: 'add' | 'edit'
  record?: Salary
  onClose: () => void
  onSubmit: (input: SalaryInput) => void
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500'

export function SalaryFormModal({ open, mode, record, onClose, onSubmit }: SalaryFormModalProps) {
  const { t, i18n } = useTranslation()
  const { employees } = useEmployees()
  const isArabic = i18n.language === 'ar'
  const [form, setForm] = useState<SalaryInput>(emptySalaryInput)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && record) {
      const { id: _, ...rest } = record
      setForm(rest)
    } else {
      setForm(emptySalaryInput)
    }
  }, [open, mode, record])

  const handleEmployeeChange = (employeeId: number) => {
    const employee = employees.find((e) => e.id === employeeId)
    if (!employee) return
    setForm((prev) => {
      const next = {
        ...prev,
        employeeId,
        employeeName: employee.name,
        employeeNameAr: employee.nameAr,
        basicSalary: employee.salary,
        deductions: employee.deductions + employee.penalties,
      }
      return { ...next, netSalary: calculateNetSalary(next) }
    })
  }

  const updateAmount = (field: keyof Pick<SalaryInput, 'basicSalary' | 'allowances' | 'overtime' | 'deductions'>, value: number) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      return { ...next, netSalary: calculateNetSalary(next) }
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({ ...form, netSalary: calculateNetSalary(form) })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? t('salaries.form.addTitle') : t('salaries.form.editTitle')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('salaries.form.employee')}>
            <select
              required
              value={form.employeeId || ''}
              onChange={(e) => handleEmployeeChange(Number(e.target.value))}
              className={inputClassName}
            >
              <option value="">{t('salaries.form.selectEmployee')}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {isArabic ? emp.nameAr : emp.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('salaries.table.month')}>
            <input
              required
              type="month"
              value={form.month}
              onChange={(e) => setForm((prev) => ({ ...prev, month: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('salaries.table.basicSalary')}>
            <input
              required
              type="number"
              min={0}
              value={form.basicSalary || ''}
              onChange={(e) => updateAmount('basicSalary', Number(e.target.value))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('salaries.table.allowances')}>
            <input
              required
              type="number"
              min={0}
              value={form.allowances || ''}
              onChange={(e) => updateAmount('allowances', Number(e.target.value))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('salaries.table.overtime')}>
            <input
              required
              type="number"
              min={0}
              value={form.overtime || ''}
              onChange={(e) => updateAmount('overtime', Number(e.target.value))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('salaries.table.deductions')}>
            <input
              required
              type="number"
              min={0}
              value={form.deductions || ''}
              onChange={(e) => updateAmount('deductions', Number(e.target.value))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('salaries.table.netSalary')}>
            <input
              readOnly
              type="number"
              value={form.netSalary}
              className={[inputClassName, 'bg-slate-50 dark:bg-slate-800/80'].join(' ')}
            />
          </Field>

          <Field label={t('salaries.table.paymentDate')}>
            <input
              required
              type="date"
              value={form.paymentDate}
              onChange={(e) => setForm((prev) => ({ ...prev, paymentDate: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('salaries.table.status')}>
            <select
              required
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as SalaryInput['status'],
                }))
              }
              className={inputClassName}
            >
              <option value="pending">{t('salaries.status.pending')}</option>
              <option value="approved">{t('salaries.status.approved')}</option>
              <option value="paid">{t('salaries.status.paid')}</option>
              <option value="cancelled">{t('salaries.status.cancelled')}</option>
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
            {mode === 'add' ? t('salaries.form.addSubmit') : t('salaries.form.editSubmit')}
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
