export type DeductionStatus = 'pending' | 'approved' | 'rejected'

export type WorkHoursDeduction = {
  id: number
  employeeId: number
  employeeName: string
  employeeNameAr: string
  date: string
  deductedMinutes: number
  reason: string
  reasonAr: string
  amount: number
  status: DeductionStatus
  isDeleted: boolean
}

export type WorkHoursDeductionInput = Omit<WorkHoursDeduction, 'id' | 'isDeleted'>
