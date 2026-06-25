export function isWithinDateRange(date: string, fromDate?: string, toDate?: string) {
  if (!fromDate && !toDate) return true
  if (fromDate && date < fromDate) return false
  if (toDate && date > toDate) return false
  return true
}

export function isMonthInRange(month: string, fromDate?: string, toDate?: string) {
  if (!fromDate && !toDate) return true
  const fromMonth = fromDate ? fromDate.slice(0, 7) : '0000-00'
  const toMonth = toDate ? toDate.slice(0, 7) : '9999-99'
  return month >= fromMonth && month <= toMonth
}

export function hasDateRangeFilter(fromDate?: string, toDate?: string) {
  return Boolean(fromDate || toDate)
}
