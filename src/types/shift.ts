export type ShiftStatus = 'active' | 'inactive'

export type Shift = {
  id: number
  name: string
  nameAr: string
  startTime: string
  endTime: string
  shiftHours: number
  workingDays: string
  workingDaysAr: string
  status: ShiftStatus
  isDeleted: boolean
}

export type ShiftInput = Omit<Shift, 'id' | 'isDeleted'>
