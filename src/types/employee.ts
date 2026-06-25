export type EmployeeStatus = 'active' | 'on_leave' | 'terminated'

export type MilitaryStatus = 'completed' | 'exempted' | 'postponed' | 'not_applicable'

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed'

export type Employee = {
  id: number
  name: string
  nameAr: string
  email: string
  phone: string
  dateOfBirth: string
  hireDate: string
  status: EmployeeStatus
  militaryStatus: MilitaryStatus
  maritalStatus: MaritalStatus
  healthCertificateImage: string
  idCardImage: string
  licenseImage: string
  birthCertificateImage: string
  jobTitle: string
  jobTitleAr: string
  subDepartment: string
  subDepartmentAr: string
  managerId: number
  managerName: string
  managerNameAr: string
  annualLeaveBalance: number
  sickLeaveBalance: number
  salary: number
  deductions: number
  penalties: number
  isDeleted: boolean
  isBlocked: boolean
}

export type EmployeeInput = Omit<Employee, 'id' | 'isDeleted' | 'isBlocked'>
