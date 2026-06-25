import type { InsuranceInput } from '../types/insurance'

export const emptyInsuranceInput: InsuranceInput = {
  employeeId: 0,
  employeeName: '',
  employeeNameAr: '',
  insuranceType: 'social',
  provider: '',
  providerAr: '',
  policyNumber: '',
  startDate: '',
  endDate: '',
  monthlyPremium: 0,
  coverageAmount: 0,
  status: 'pending',
}
