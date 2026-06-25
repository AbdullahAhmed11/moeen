import type { MissionInput } from '../types/mission'

export function calcMissionDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (end < start) return 0
  const diff = end.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}

export const emptyMissionInput: MissionInput = {
  employeeId: 0,
  employeeName: '',
  employeeNameAr: '',
  destination: '',
  destinationAr: '',
  purpose: '',
  purposeAr: '',
  startDate: '',
  endDate: '',
  missionDays: 0,
  allowance: 0,
  status: 'pending',
}
