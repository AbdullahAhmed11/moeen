import type { WorkHoursDeductionInput } from '../types/workHoursDeduction'

export const emptyWorkHoursDeductionInput: WorkHoursDeductionInput = {
  employeeId: 0,
  employeeName: '',
  employeeNameAr: '',
  date: '',
  deductedMinutes: 0,
  reason: '',
  reasonAr: '',
  amount: 0,
  status: 'pending',
}

export function minutesToHoursInput(minutes: number) {
  return Math.round((minutes / 60) * 100) / 100
}

export function hoursInputToMinutes(hours: number) {
  return Math.round(hours * 60)
}
