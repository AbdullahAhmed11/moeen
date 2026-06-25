import type { Employee } from './employee'

export type EmployeePayrollData = {
  jobNumber: string
  department: string
  departmentAr: string
  branch: string
  branchAr: string
  dailySalary: number
  workDays: number
  overtimeHours: number
  overtimeHourRate: number
  representationAllowance: number
  penaltyFormula: string
  penaltyFormulaAr: string
  fingerprintDeduction: number
  fingerprintFormula: string
  fingerprintFormulaAr: string
  cashDeduction: number
  cashierShortage: number
  costDeduction: number
  temporaryAdvance: number
  permanentAdvance: number
  socialInsurance: number
}

export type EmployeePayrollRow = {
  employee: Employee
  payroll: EmployeePayrollData
  serial: number
  overtimeValue: number
  compensationTotal: number
  deductionsTotal: number
  netSalary: number
}
