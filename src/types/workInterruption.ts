export type InterruptionType = 'absence' | 'leave' | 'sick' | 'unauthorized' | 'other'

export type InterruptionStatus = 'pending' | 'approved' | 'rejected'

export type WorkInterruption = {
  id: number
  employeeId: number
  employeeName: string
  employeeNameAr: string
  startDate: string
  endDate: string
  interruptedDays: number
  interruptionType: InterruptionType
  reason: string
  reasonAr: string
  status: InterruptionStatus
  isDeleted: boolean
}

export type WorkInterruptionInput = Omit<WorkInterruption, 'id' | 'isDeleted'>
