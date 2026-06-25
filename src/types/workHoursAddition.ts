export type AdditionStatus = 'pending' | 'approved' | 'rejected'

export type WorkHoursAddition = {
  id: number
  employeeId: number
  employeeName: string
  employeeNameAr: string
  date: string
  addedMinutes: number
  reason: string
  reasonAr: string
  amount: number
  status: AdditionStatus
  isDeleted: boolean
}

export type WorkHoursAdditionInput = Omit<WorkHoursAddition, 'id' | 'isDeleted'>
