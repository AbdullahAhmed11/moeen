export type PenaltyType = 'warning' | 'deduction' | 'suspension' | 'termination' | 'other'

export type PenaltyStatus = 'pending' | 'approved' | 'rejected' | 'applied'

export type Penalty = {
  id: number
  employeeId: number
  employeeName: string
  employeeNameAr: string
  date: string
  penaltyType: PenaltyType
  amount: number
  reason: string
  reasonAr: string
  status: PenaltyStatus
  isDeleted: boolean
}

export type PenaltyInput = Omit<Penalty, 'id' | 'isDeleted'>
