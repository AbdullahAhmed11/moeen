import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Shift, ShiftInput } from '../../types/shift'
import { SHIFT_HOURS, calcEndTime, emptyShiftInput, formatTime } from '../../utils/shift'
import { Modal } from '../ui/Modal'

type ShiftFormModalProps = {
  open: boolean
  mode: 'add' | 'edit'
  record?: Shift
  onClose: () => void
  onSubmit: (input: ShiftInput) => void
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500'

export function ShiftFormModal({ open, mode, record, onClose, onSubmit }: ShiftFormModalProps) {
  const { t, i18n } = useTranslation()
  const [form, setForm] = useState<ShiftInput>(emptyShiftInput)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && record) {
      const { id: _, ...rest } = record
      setForm(rest)
    } else {
      setForm(emptyShiftInput)
    }
  }, [open, mode, record])

  const handleStartTimeChange = (startTime: string) => {
    setForm((prev) => ({
      ...prev,
      startTime,
      endTime: calcEndTime(startTime),
      shiftHours: SHIFT_HOURS,
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({
      ...form,
      endTime: calcEndTime(form.startTime),
      shiftHours: SHIFT_HOURS,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? t('shifts.form.addTitle') : t('shifts.form.editTitle')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('shifts.form.nameEn')}>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('shifts.form.nameAr')}>
            <input
              required
              value={form.nameAr}
              onChange={(e) => setForm((prev) => ({ ...prev, nameAr: e.target.value }))}
              className={inputClassName}
              dir="rtl"
            />
          </Field>

          <Field label={t('shifts.table.startTime')}>
            <input
              required
              type="time"
              value={form.startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label={t('shifts.table.endTime')}>
            <input
              readOnly
              type="time"
              value={form.endTime}
              className={[inputClassName, 'bg-slate-50 dark:bg-slate-800/80'].join(' ')}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('shifts.form.endTimeHint', {
                hours: SHIFT_HOURS,
                time: formatTime(form.endTime, i18n.language),
              })}
            </p>
          </Field>

          <Field label={t('shifts.table.shiftHours')}>
            <input
              readOnly
              type="number"
              value={SHIFT_HOURS}
              className={[inputClassName, 'bg-slate-50 dark:bg-slate-800/80'].join(' ')}
            />
          </Field>

          <Field label={t('shifts.table.status')}>
            <select
              required
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as ShiftInput['status'],
                }))
              }
              className={inputClassName}
            >
              <option value="active">{t('shifts.status.active')}</option>
              <option value="inactive">{t('shifts.status.inactive')}</option>
            </select>
          </Field>

          <Field label={t('shifts.form.workingDaysEn')}>
            <input
              required
              value={form.workingDays}
              onChange={(e) => setForm((prev) => ({ ...prev, workingDays: e.target.value }))}
              className={inputClassName}
            />
          </Field>

          <Field label={t('shifts.form.workingDaysAr')}>
            <input
              required
              value={form.workingDaysAr}
              onChange={(e) => setForm((prev) => ({ ...prev, workingDaysAr: e.target.value }))}
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
            {mode === 'add' ? t('shifts.form.addSubmit') : t('shifts.form.editSubmit')}
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
