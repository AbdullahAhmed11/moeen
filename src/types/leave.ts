export type LeaveType = 'annual' | 'sick' | 'unpaid' | 'emergency' | 'other'

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export type LeaveRequest = {
  id: number
  employeeId: number
  employeeName: string
  employeeNameAr: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  reasonAr: string
  status: LeaveStatus
  isDeleted: boolean
}

export type LeaveInput = Omit<LeaveRequest, 'id' | 'isDeleted'>
