export type MissionStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'

export type Mission = {
  id: number
  employeeId: number
  employeeName: string
  employeeNameAr: string
  destination: string
  destinationAr: string
  purpose: string
  purposeAr: string
  startDate: string
  endDate: string
  missionDays: number
  allowance: number
  status: MissionStatus
  isDeleted: boolean
}

export type MissionInput = Omit<Mission, 'id' | 'isDeleted'>
