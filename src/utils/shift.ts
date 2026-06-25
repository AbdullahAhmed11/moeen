import type { ShiftInput } from '../types/shift'

export const SHIFT_HOURS = 9

export function calcEndTime(startTime: string): string {
  if (!startTime) return ''
  const [hours, minutes] = startTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + SHIFT_HOURS * 60
  const endHours = Math.floor(totalMinutes / 60) % 24
  const endMinutes = totalMinutes % 60
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
}

export function formatTime(time: string, locale: string) {
  if (!time) return ''
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export const emptyShiftInput: ShiftInput = {
  name: '',
  nameAr: '',
  startTime: '08:00',
  endTime: calcEndTime('08:00'),
  shiftHours: SHIFT_HOURS,
  workingDays: 'Sunday - Thursday',
  workingDaysAr: 'الأحد - الخميس',
  status: 'active',
}
