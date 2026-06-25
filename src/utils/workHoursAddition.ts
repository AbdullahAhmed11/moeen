import type { WorkHoursAdditionInput } from '../types/workHoursAddition'

export const emptyWorkHoursAdditionInput: WorkHoursAdditionInput = {
  employeeId: 0,
  employeeName: '',
  employeeNameAr: '',
  date: '',
  addedMinutes: 0,
  reason: '',
  reasonAr: '',
  amount: 0,
  status: 'pending',
}

export { hoursInputToMinutes, minutesToHoursInput } from './workHoursDeduction'
