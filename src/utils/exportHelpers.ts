import { formatCurrency } from './currency'
import { formatDate, formatTime } from './date'
import { formatWorkHours } from './workHours'

export function pickName(
  row: { name?: string; nameAr?: string; employeeName?: string; employeeNameAr?: string },
  isArabic: boolean,
) {
  if (row.name !== undefined) return isArabic ? row.nameAr ?? row.name : row.name
  return isArabic ? row.employeeNameAr ?? row.employeeName ?? '' : row.employeeName ?? ''
}

export function pickBilingual(
  en: string,
  ar: string,
  isArabic: boolean,
) {
  return isArabic ? ar : en
}

export function exportCurrency(value: number, locale: string) {
  return formatCurrency(value, locale)
}

export function exportDate(value: string, locale: string) {
  return formatDate(value, locale)
}

export function exportTime(value: string, locale: string) {
  return formatTime(value, locale)
}

export function exportWorkHours(minutes: number, locale: string) {
  return minutes > 0 ? formatWorkHours(minutes, locale) : '—'
}

export function formatMonthLabel(month: string, locale: string) {
  const [year, monthNum] = month.split('-')
  const date = new Date(Number(year), Number(monthNum) - 1)
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}
