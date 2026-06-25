import type { WorkInterruptionInput } from '../types/workInterruption'

export const emptyWorkInterruptionInput: WorkInterruptionInput = {
  employeeId: 0,
  employeeName: '',
  employeeNameAr: '',
  startDate: '',
  endDate: '',
  interruptedDays: 0,
  interruptionType: 'absence',
  reason: '',
  reasonAr: '',
  status: 'pending',
}

export function calcInterruptedDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = end.getTime() - start.getTime()
  if (diff < 0) return 0
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}
