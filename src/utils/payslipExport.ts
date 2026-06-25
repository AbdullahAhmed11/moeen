import type { TFunction } from 'i18next'
import type { EmployeePayrollRow } from '../types/employeePayroll'
import { formatMonthLabel } from './exportHelpers'

export type PayslipExportRow = {
  month: string
  jobCode: string
  name: string
  jobTitle: string
  dailySalary: string
  workDays: string
  daysValue: string
  overtimeHours: string
  overtimeValue: string
  totalEarnings: string
  penaltiesCount: string
  penaltiesValue: string
  fingerprintCount: string
  fingerprintDeduction: string
  cashDeduction: string
  cashierShortage: string
  temporaryAdvance: string
  permanentAdvance: string
  socialInsurance: string
  totalDeductions: string
  netSalary: string
}

function formatAmount(value: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function buildPayslipExportRow(
  row: EmployeePayrollRow,
  month: string,
  isArabic: boolean,
): PayslipExportRow {
  const { employee, payroll } = row
  const daysValue = payroll.dailySalary * payroll.workDays

  return {
    month: formatMonthLabel(month, isArabic ? 'ar' : 'en'),
    jobCode: payroll.jobNumber.replace(/^EMP-/i, ''),
    name: isArabic ? employee.nameAr : employee.name,
    jobTitle: isArabic ? employee.jobTitleAr : employee.jobTitle,
    dailySalary: formatAmount(payroll.dailySalary),
    workDays: formatAmount(payroll.workDays),
    daysValue: formatAmount(daysValue),
    overtimeHours: formatAmount(payroll.overtimeHours),
    overtimeValue: formatAmount(row.overtimeValue),
    totalEarnings: formatAmount(row.compensationTotal),
    penaltiesCount: String(employee.penalties > 0 ? 1 : 0),
    penaltiesValue: formatAmount(employee.penalties),
    fingerprintCount: String(payroll.fingerprintDeduction > 0 ? 1 : 0),
    fingerprintDeduction: formatAmount(payroll.fingerprintDeduction),
    cashDeduction: formatAmount(payroll.cashDeduction),
    cashierShortage: formatAmount(payroll.cashierShortage),
    temporaryAdvance: formatAmount(payroll.temporaryAdvance),
    permanentAdvance: formatAmount(payroll.permanentAdvance),
    socialInsurance: formatAmount(payroll.socialInsurance),
    totalDeductions: formatAmount(row.deductionsTotal),
    netSalary: Math.round(row.netSalary).toLocaleString('en-US'),
  }
}

export function getPayslipExportColumns(t: TFunction) {
  return [
    { header: t('employees.payslip.selectMonth'), getValue: (r: PayslipExportRow) => r.month },
    { header: t('employees.payslip.jobCode'), getValue: (r: PayslipExportRow) => r.jobCode },
    { header: t('employees.payslip.name'), getValue: (r: PayslipExportRow) => r.name },
    { header: t('employees.payroll.cols.jobTitle'), getValue: (r: PayslipExportRow) => r.jobTitle },
    { header: t('employees.payroll.cols.dailySalary'), getValue: (r: PayslipExportRow) => r.dailySalary },
    { header: t('employees.payroll.cols.workDays'), getValue: (r: PayslipExportRow) => r.workDays },
    { header: t('employees.payslip.daysValue'), getValue: (r: PayslipExportRow) => r.daysValue },
    { header: t('employees.payslip.overtimeHoursShort'), getValue: (r: PayslipExportRow) => r.overtimeHours },
    { header: t('employees.payslip.overtimeValueShort'), getValue: (r: PayslipExportRow) => r.overtimeValue },
    { header: t('employees.payslip.totalEarnings'), getValue: (r: PayslipExportRow) => r.totalEarnings },
    { header: t('employees.payroll.cols.penalties'), getValue: (r: PayslipExportRow) => r.penaltiesCount },
    { header: t('employees.payslip.penaltiesValue'), getValue: (r: PayslipExportRow) => r.penaltiesValue },
    { header: t('employees.payroll.cols.fingerprintDeduction'), getValue: (r: PayslipExportRow) => r.fingerprintCount },
    {
      header: t('employees.payslip.fingerprintDeductionValue'),
      getValue: (r: PayslipExportRow) => r.fingerprintDeduction,
    },
    { header: t('employees.payslip.cashDeductionShort'), getValue: (r: PayslipExportRow) => r.cashDeduction },
    { header: t('employees.payroll.cols.cashierShortage'), getValue: (r: PayslipExportRow) => r.cashierShortage },
    { header: t('employees.payroll.cols.temporaryAdvance'), getValue: (r: PayslipExportRow) => r.temporaryAdvance },
    { header: t('employees.payroll.cols.permanentAdvance'), getValue: (r: PayslipExportRow) => r.permanentAdvance },
    { header: t('employees.payroll.cols.socialInsurance'), getValue: (r: PayslipExportRow) => r.socialInsurance },
    { header: t('employees.payslip.totalDeductions'), getValue: (r: PayslipExportRow) => r.totalDeductions },
    { header: t('employees.payslip.netSalary'), getValue: (r: PayslipExportRow) => r.netSalary },
  ]
}

export const PAYSLIP_EXPORT_ELEMENT_ID = 'employee-payslip-export'
