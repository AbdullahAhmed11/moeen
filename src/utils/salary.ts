import type { SalaryInput } from '../types/salary'

export function calculateNetSalary(input: Pick<SalaryInput, 'basicSalary' | 'allowances' | 'overtime' | 'deductions'>) {
  return input.basicSalary + input.allowances + input.overtime - input.deductions
}

export const emptySalaryInput: SalaryInput = {
  employeeId: 0,
  employeeName: '',
  employeeNameAr: '',
  month: '',
  basicSalary: 0,
  allowances: 0,
  overtime: 0,
  deductions: 0,
  netSalary: 0,
  paymentDate: '',
  status: 'pending',
}
