export type RegistrationStatus = 'active' | 'pending' | 'suspended' | 'terminated'

export type ContractType = 'permanent' | 'temporary' | 'contract'

export type EmployeeRegistration = {
  id: number
  employeeId: number
  employeeName: string
  employeeNameAr: string
  nationalId: string
  registrationDate: string
  jobTitle: string
  jobTitleAr: string
  department: string
  departmentAr: string
  contractType: ContractType
  status: RegistrationStatus
  isDeleted: boolean
}

export type EmployeeRegistrationInput = Omit<EmployeeRegistration, 'id' | 'isDeleted'>
