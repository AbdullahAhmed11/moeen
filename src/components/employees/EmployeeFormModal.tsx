import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEmployees } from '../../context/EmployeesContext'
import { DocumentUploadField } from '../ui/DocumentUploadField'
import { Modal } from '../ui/Modal'
import type { Employee, EmployeeInput } from '../../types/employee'
import { emptyEmployeeInput } from '../../utils/employee'

type EmployeeFormModalProps = {
  open: boolean
  mode: 'add' | 'edit'
  employee?: Employee
  onClose: () => void
  onSubmit: (input: EmployeeInput) => void
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500'

export function EmployeeFormModal({
  open,
  mode,
  employee,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const { t, i18n } = useTranslation()
  const { employees } = useEmployees()
  const isArabic = i18n.language === 'ar'
  const [form, setForm] = useState<EmployeeInput>(emptyEmployeeInput)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && employee) {
      const { id: _, isDeleted: __, isBlocked: ___, ...rest } = employee
      setForm(rest)
    } else {
      setForm(emptyEmployeeInput)
    }
  }, [open, mode, employee])

  const handleChange = (field: keyof EmployeeInput, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (field: keyof Pick<
    EmployeeInput,
    'healthCertificateImage' | 'idCardImage' | 'licenseImage' | 'birthCertificateImage'
  >, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleManagerChange = (managerId: number) => {
    if (!managerId) {
      setForm((prev) => ({
        ...prev,
        managerId: 0,
        managerName: '',
        managerNameAr: '',
      }))
      return
    }

    const manager = employees.find((item) => item.id === managerId)
    if (!manager) return

    setForm((prev) => ({
      ...prev,
      managerId,
      managerName: manager.name,
      managerNameAr: manager.nameAr,
    }))
  }

  const managerOptions = employees.filter((item) => item.id !== employee?.id)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit(form)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? t('employees.form.addTitle') : t('employees.form.editTitle')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('employees.form.nameEn')}>
            <input
              required
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label={t('employees.form.nameAr')}>
            <input
              required
              value={form.nameAr}
              onChange={(e) => handleChange('nameAr', e.target.value)}
              className={inputClassName}
              dir="rtl"
            />
          </Field>
          <Field label={t('employees.form.jobTitleEn')}>
            <input
              required
              value={form.jobTitle}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label={t('employees.form.jobTitleAr')}>
            <input
              required
              value={form.jobTitleAr}
              onChange={(e) => handleChange('jobTitleAr', e.target.value)}
              className={inputClassName}
              dir="rtl"
            />
          </Field>
          <Field label={t('employees.form.subDepartmentEn')}>
            <input
              required
              value={form.subDepartment}
              onChange={(e) => handleChange('subDepartment', e.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label={t('employees.form.subDepartmentAr')}>
            <input
              required
              value={form.subDepartmentAr}
              onChange={(e) => handleChange('subDepartmentAr', e.target.value)}
              className={inputClassName}
              dir="rtl"
            />
          </Field>
          <Field label={t('employees.form.directManager')}>
            <select
              value={form.managerId || ''}
              onChange={(e) => handleManagerChange(Number(e.target.value))}
              className={inputClassName}
            >
              <option value="">{t('employees.noManager')}</option>
              {managerOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {isArabic ? item.nameAr : item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('employees.profile.email')}>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label={t('employees.profile.phone')}>
            <input
              required
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label={t('employees.form.dateOfBirth')}>
            <input
              required
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label={t('employees.profile.hireDate')}>
            <input
              required
              type="date"
              value={form.hireDate}
              onChange={(e) => handleChange('hireDate', e.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label={t('employees.form.militaryStatus')}>
            <select
              required
              value={form.militaryStatus}
              onChange={(e) => handleChange('militaryStatus', e.target.value)}
              className={inputClassName}
            >
              <option value="completed">{t('employees.militaryStatus.completed')}</option>
              <option value="exempted">{t('employees.militaryStatus.exempted')}</option>
              <option value="postponed">{t('employees.militaryStatus.postponed')}</option>
              <option value="not_applicable">{t('employees.militaryStatus.not_applicable')}</option>
            </select>
          </Field>
          <Field label={t('employees.form.maritalStatus')}>
            <select
              required
              value={form.maritalStatus}
              onChange={(e) => handleChange('maritalStatus', e.target.value)}
              className={inputClassName}
            >
              <option value="single">{t('employees.maritalStatus.single')}</option>
              <option value="married">{t('employees.maritalStatus.married')}</option>
              <option value="divorced">{t('employees.maritalStatus.divorced')}</option>
              <option value="widowed">{t('employees.maritalStatus.widowed')}</option>
            </select>
          </Field>
          <Field label={t('employees.profile.status')}>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={inputClassName}
            >
              <option value="active">{t('employees.status.active')}</option>
              <option value="on_leave">{t('employees.status.on_leave')}</option>
              <option value="terminated">{t('employees.status.terminated')}</option>
            </select>
          </Field>
          <Field label={t('employees.profile.annualBalance')}>
            <input
              required
              type="number"
              min={0}
              value={form.annualLeaveBalance || ''}
              onChange={(e) => handleChange('annualLeaveBalance', Number(e.target.value))}
              className={inputClassName}
            />
          </Field>
          <Field label={t('employees.profile.sickBalance')}>
            <input
              required
              type="number"
              min={0}
              value={form.sickLeaveBalance || ''}
              onChange={(e) => handleChange('sickLeaveBalance', Number(e.target.value))}
              className={inputClassName}
            />
          </Field>
          <Field label={t('employees.table.salary')}>
            <input
              required
              type="number"
              min={0}
              value={form.salary || ''}
              onChange={(e) => handleChange('salary', Number(e.target.value))}
              className={inputClassName}
            />
          </Field>
        </div>

        <div className="space-y-3 border-t border-slate-200/80 pt-4 dark:border-slate-700/80">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t('employees.documents.title')}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <DocumentUploadField
              label={t('employees.form.healthCertificate')}
              value={form.healthCertificateImage}
              onChange={(value) => handleImageChange('healthCertificateImage', value)}
            />
            <DocumentUploadField
              label={t('employees.form.idCardImage')}
              value={form.idCardImage}
              onChange={(value) => handleImageChange('idCardImage', value)}
            />
            <DocumentUploadField
              label={t('employees.form.licenseImage')}
              value={form.licenseImage}
              onChange={(value) => handleImageChange('licenseImage', value)}
            />
            <DocumentUploadField
              label={t('employees.form.birthCertificateImage')}
              value={form.birthCertificateImage}
              onChange={(value) => handleImageChange('birthCertificateImage', value)}
            />
          </div>
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
            {mode === 'add' ? t('employees.form.addSubmit') : t('employees.form.editSubmit')}
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
