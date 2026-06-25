import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEmployees } from '../../context/EmployeesContext'
import type { EmployeeRegistration, EmployeeRegistrationInput } from '../../types/employeeRegistration'
import { emptyEmployeeRegistrationInput } from '../../utils/employeeRegistration'
import { Modal } from '../ui/Modal'

type EmployeeRegistrationFormModalProps = {
  open: boolean
  mode: 'add' | 'edit'
  record?: EmployeeRegistration
  onClose: () => void
  onSubmit: (input: EmployeeRegistrationInput) => void
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500'

export function EmployeeRegistrationFormModal({
  open,
  mode,
  record,
  onClose,
  onSubmit,
}: EmployeeRegistrationFormModalProps) {
  const { t, i18n } = useTranslation()
  const { employees } = useEmployees()
  const isArabic = i18n.language === 'ar'
  const [form, setForm] = useState<EmployeeRegistrationInput>(emptyEmployeeRegistrationInput)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && record) {
      const { id: _, ...rest } = record
      setForm(rest)
    } else {
      setForm(emptyEmployeeRegistrationInput)
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
      jobTitle: employee.jobTitle,
      jobTitleAr: employee.jobTitleAr,
      department: employee.subDepartment,
      departmentAr: employee.subDepartmentAr,
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
      title={
        mode === 'add'
          ? t('employeeRegistration.form.addTitle')
          : t('employeeRegistration.form.editTitle')
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('employeeRegistration.form.employee')}>
            <select
              required
              value={form.employeeId || ''}
              onChange={(e) => handleEmployeeChange(Number(e.target.value))}
              className={inputClassName}
            >
              <option value="">{t('employeeRegistration.form.selectEmployee')}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {isArabic ? emp.nameAr : emp.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('employeeRegistration.table.nationalId')}>
            <input
              required
              value={form.nationalId}
              onChange={(e) => setForm((prev) => ({ ...prev, nationalId: e.target.value }))}
              className={inputClassName}
              dir="ltr"
            />
          </Field>

          <Field label={t('employeeRegistration.table.registrationDate')}>
            <input
              required
              type="date"
              value={form.registrationDate}
              onChange={(e) => setForm((prev) => ({ ...prev, registrationDate: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('employeeRegistration.table.contractType')}>
            <select
              required
              value={form.contractType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  contractType: e.target.value as EmployeeRegistrationInput['contractType'],
                }))
              }
              className={inputClassName}
            >
              <option value="permanent">{t('employeeRegistration.contractType.permanent')}</option>
              <option value="temporary">{t('employeeRegistration.contractType.temporary')}</option>
              <option value="contract">{t('employeeRegistration.contractType.contract')}</option>
            </select>
          </Field>

          <Field label={t('employeeRegistration.form.jobTitleEn')}>
            <input
              required
              value={form.jobTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, jobTitle: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('employeeRegistration.form.jobTitleAr')}>
            <input
              required
              value={form.jobTitleAr}
              onChange={(e) => setForm((prev) => ({ ...prev, jobTitleAr: e.target.value }))}
              className={inputClassName}
              dir="rtl"
            />
          </Field>

          <Field label={t('employeeRegistration.form.departmentEn')}>
            <input
              required
              value={form.department}
              onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('employeeRegistration.form.departmentAr')}>
            <input
              required
              value={form.departmentAr}
              onChange={(e) => setForm((prev) => ({ ...prev, departmentAr: e.target.value }))}
              className={inputClassName}
              dir="rtl"
            />
          </Field>

          <Field label={t('employeeRegistration.table.status')}>
            <select
              required
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as EmployeeRegistrationInput['status'],
                }))
              }
              className={inputClassName}
            >
              <option value="pending">{t('employeeRegistration.status.pending')}</option>
              <option value="active">{t('employeeRegistration.status.active')}</option>
              <option value="suspended">{t('employeeRegistration.status.suspended')}</option>
              <option value="terminated">{t('employeeRegistration.status.terminated')}</option>
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
              ? t('employeeRegistration.form.addSubmit')
              : t('employeeRegistration.form.editSubmit')}
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
