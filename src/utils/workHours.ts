export function formatWorkHours(minutes: number, locale: string) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (locale === 'ar') {
    return mins > 0 ? `${hours} س ${mins} د` : `${hours} س`
  }

  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function calcWorkHoursMinutes(checkIn: string, checkOut: string | null) {
  if (!checkOut) return 0
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(0, Math.round(diff / 60000))
}
