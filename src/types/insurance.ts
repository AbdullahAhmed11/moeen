export type InsuranceType = 'social' | 'health' | 'life' | 'accident' | 'other'

export type InsuranceStatus = 'active' | 'expired' | 'pending' | 'cancelled'

export type Insurance = {
  id: number
  employeeId: number
  employeeName: string
  employeeNameAr: string
  insuranceType: InsuranceType
  provider: string
  providerAr: string
  policyNumber: string
  startDate: string
  endDate: string
  monthlyPremium: number
  coverageAmount: number
  status: InsuranceStatus
  isDeleted: boolean
}

export type InsuranceInput = Omit<Insurance, 'id' | 'isDeleted'>
