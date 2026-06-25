import type { EmployeePayrollRow } from './employeePayroll'
import type { Salary } from './salary'

export type SalaryPayrollTableRow = EmployeePayrollRow & {
  salary: Salary
}
