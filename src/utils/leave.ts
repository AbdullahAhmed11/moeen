import type { LeaveInput } from '../types/leave'

export const emptyLeaveInput: LeaveInput = {
  employeeId: 0,
  employeeName: '',
  employeeNameAr: '',
  leaveType: 'annual',
  startDate: '',
  endDate: '',
  days: 1,
  reason: '',
  reasonAr: '',
  status: 'pending',
}

export function calcLeaveDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 1
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = end.getTime() - start.getTime()
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1)
}
