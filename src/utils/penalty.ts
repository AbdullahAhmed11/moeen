import type { PenaltyInput } from '../types/penalty'

export const emptyPenaltyInput: PenaltyInput = {
  employeeId: 0,
  employeeName: '',
  employeeNameAr: '',
  date: '',
  penaltyType: 'warning',
  amount: 0,
  reason: '',
  reasonAr: '',
  status: 'pending',
}
