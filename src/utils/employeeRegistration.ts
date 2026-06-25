import type { EmployeeRegistrationInput } from '../types/employeeRegistration'

export const emptyEmployeeRegistrationInput: EmployeeRegistrationInput = {
  employeeId: 0,
  employeeName: '',
  employeeNameAr: '',
  nationalId: '',
  registrationDate: '',
  jobTitle: '',
  jobTitleAr: '',
  department: '',
  departmentAr: '',
  contractType: 'permanent',
  status: 'pending',
}
