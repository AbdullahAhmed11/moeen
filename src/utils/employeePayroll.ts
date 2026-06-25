import type { Employee } from '../types/employee'
import type { EmployeePayrollData, EmployeePayrollRow } from '../types/employeePayroll'

const departmentMap: Record<string, { en: string; ar: string }> = {
  'IT Development': { en: 'Information Technology', ar: 'تقنية المعلومات' },
  'IT Infrastructure': { en: 'Information Technology', ar: 'تقنية المعلومات' },
  'Human Resources': { en: 'Human Resources', ar: 'الموارد البشرية' },
  Finance: { en: 'Finance', ar: 'المالية' },
  Operations: { en: 'Operations', ar: 'العمليات' },
  Security: { en: 'Operations', ar: 'العمليات' },
  Marketing: { en: 'Marketing', ar: 'التسويق' },
  Logistics: { en: 'Logistics', ar: 'اللوجستيات' },
  Legal: { en: 'Legal', ar: 'الشؤون القانونية' },
  Sales: { en: 'Sales', ar: 'المبيعات' },
}

export function buildDefaultPayrollData(employee: Employee): EmployeePayrollData {
  const dept = departmentMap[employee.subDepartment] ?? {
    en: employee.subDepartment,
    ar: employee.subDepartmentAr,
  }

  const dailySalary = Math.round(employee.salary / 30)
  const workDays = 30
  const overtimeHours = employee.id % 4 === 0 ? 8 : employee.id % 3 === 0 ? 4 : 0
  const overtimeHourRate = Math.round((dailySalary / 8) * 1.5)
  const fingerprintDeduction = Math.round(employee.deductions * 0.45)
  const socialInsurance = Math.round(employee.salary * 0.0975)
  const cashDeduction = Math.max(0, employee.deductions - fingerprintDeduction)

  return {
    jobNumber: `EMP-${String(employee.id).padStart(4, '0')}`,
    department: dept.en,
    departmentAr: dept.ar,
    branch: employee.subDepartment,
    branchAr: employee.subDepartmentAr,
    dailySalary,
    workDays,
    overtimeHours,
    overtimeHourRate,
    representationAllowance: employee.id % 3 === 0 ? 500 : employee.id % 5 === 0 ? 300 : 0,
    penaltyFormula: employee.penalties > 0 ? '1 × جزاء' : '—',
    penaltyFormulaAr: employee.penalties > 0 ? '1 × جزاء' : '—',
    fingerprintDeduction,
    fingerprintFormula: fingerprintDeduction > 0 ? `${fingerprintDeduction} ÷ 30` : '—',
    fingerprintFormulaAr: fingerprintDeduction > 0 ? `${fingerprintDeduction} ÷ 30` : '—',
    cashDeduction,
    cashierShortage: employee.id === 5 ? 150 : 0,
    costDeduction: employee.id % 7 === 0 ? 200 : 0,
    temporaryAdvance: employee.id % 6 === 0 ? 1000 : 0,
    permanentAdvance: employee.id === 3 ? 500 : 0,
    socialInsurance,
  }
}

export function buildPayrollRow(employee: Employee, index: number): EmployeePayrollRow {
  const payroll = buildDefaultPayrollData(employee)
  const overtimeValue = payroll.overtimeHours * payroll.overtimeHourRate
  const compensationTotal =
    payroll.dailySalary * payroll.workDays +
    overtimeValue +
    payroll.representationAllowance
  const deductionsTotal =
    employee.penalties +
    payroll.fingerprintDeduction +
    payroll.cashDeduction +
    payroll.cashierShortage +
    payroll.costDeduction +
    payroll.temporaryAdvance +
    payroll.permanentAdvance +
    payroll.socialInsurance
  const netSalary = compensationTotal - deductionsTotal

  return {
    employee,
    payroll,
    serial: index + 1,
    overtimeValue,
    compensationTotal,
    deductionsTotal,
    netSalary,
  }
}
