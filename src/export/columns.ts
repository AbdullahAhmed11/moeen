import type { TFunction } from 'i18next'
import type { Employee } from '../types/employee'
import type { EmployeePayrollRow } from '../types/employeePayroll'
import type { EmployeeRegistration } from '../types/employeeRegistration'
import type { ExportColumn } from '../types/export'
import type { Insurance } from '../types/insurance'
import type { Mission } from '../types/mission'
import type { Penalty } from '../types/penalty'
import type { Salary } from '../types/salary'
import type { SalaryPayrollTableRow } from '../types/salaryPayroll'
import type { Shift } from '../types/shift'
import type { WorkHoursAddition } from '../types/workHoursAddition'
import type { WorkHoursDeduction } from '../types/workHoursDeduction'
import type { WorkInterruption } from '../types/workInterruption'
import {
  exportCurrency,
  exportDate,
  exportTime,
  exportWorkHours,
  formatMonthLabel,
  pickBilingual,
  pickName,
} from '../utils/exportHelpers'
import { formatTime as formatShiftTime } from '../utils/shift'
import type { AttendanceRecord as FingerprintRecord } from '../types/fingerprint'
import type { LeaveRequest } from '../types/leave'
import { formatCoordinates } from '../utils/attendance'

export function getEmployeesExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<Employee>[] {
  return [
    { header: t('employees.table.id'), getValue: (r) => r.id },
    { header: t('employees.table.name'), getValue: (r) => pickName(r, isArabic) },
    {
      header: t('employees.table.jobTitle'),
      getValue: (r) => pickBilingual(r.jobTitle, r.jobTitleAr, isArabic),
    },
    {
      header: t('employees.table.subDepartment'),
      getValue: (r) => pickBilingual(r.subDepartment, r.subDepartmentAr, isArabic),
    },
    {
      header: t('employees.table.directManager'),
      getValue: (r) =>
        r.managerId ? pickBilingual(r.managerName, r.managerNameAr, isArabic) : t('employees.noManager'),
    },
    { header: t('employees.table.salary'), getValue: (r) => exportCurrency(r.salary, locale) },
    { header: t('employees.table.deductions'), getValue: (r) => exportCurrency(r.deductions, locale) },
    { header: t('employees.table.penalties'), getValue: (r) => exportCurrency(r.penalties, locale) },
  ]
}

export function getEmployeesPayrollExportColumns(
  t: TFunction,
  isArabic: boolean,
  _locale: string,
): ExportColumn<EmployeePayrollRow>[] {
  return [
    { header: t('employees.payroll.cols.serial'), getValue: (r) => r.serial },
    { header: t('employees.payroll.cols.jobNumber'), getValue: (r) => r.payroll.jobNumber },
    {
      header: t('employees.payroll.cols.name'),
      getValue: (r) => pickName(r.employee, isArabic),
    },
    {
      header: t('employees.payroll.cols.department'),
      getValue: (r) => pickBilingual(r.payroll.department, r.payroll.departmentAr, isArabic),
    },
    {
      header: t('employees.payroll.cols.branch'),
      getValue: (r) => pickBilingual(r.payroll.branch, r.payroll.branchAr, isArabic),
    },
    {
      header: t('employees.payroll.cols.jobTitle'),
      getValue: (r) => pickBilingual(r.employee.jobTitle, r.employee.jobTitleAr, isArabic),
    },
    {
      header: t('employees.badges.deleted'),
      getValue: (r) => (r.employee.isDeleted ? t('employees.badges.deleted') : '—'),
    },
    {
      header: t('employees.badges.blocked'),
      getValue: (r) => (r.employee.isBlocked ? t('employees.badges.blocked') : '—'),
    },
  ]
}

export function getSalariesPayrollExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<SalaryPayrollTableRow>[] {
  return [
    { header: t('employees.payroll.cols.serial'), getValue: (r) => r.serial },
    { header: t('salaries.table.employee'), getValue: (r) => pickName(r.employee, isArabic) },
    { header: t('salaries.table.month'), getValue: (r) => formatMonthLabel(r.salary.month, locale) },
    { header: t('salaries.table.status'), getValue: (r) => t(`salaries.status.${r.salary.status}`) },
    {
      header: t('employees.payroll.cols.dailySalary'),
      getValue: (r) => exportCurrency(r.payroll.dailySalary, locale),
    },
    { header: t('employees.payroll.cols.workDays'), getValue: (r) => r.payroll.workDays },
    { header: t('employees.payroll.cols.overtimeHours'), getValue: (r) => r.payroll.overtimeHours },
    {
      header: t('employees.payroll.cols.representationAllowance'),
      getValue: (r) => exportCurrency(r.payroll.representationAllowance, locale),
    },
    {
      header: t('employees.payroll.cols.total'),
      getValue: (r) => exportCurrency(r.compensationTotal, locale),
    },
    {
      header: t('employees.payroll.cols.penalties'),
      getValue: (r) => exportCurrency(r.employee.penalties, locale),
    },
    {
      header: t('employees.payroll.cols.fingerprintDeduction'),
      getValue: (r) => exportCurrency(r.payroll.fingerprintDeduction, locale),
    },
    {
      header: t('employees.payroll.cols.cashDeduction'),
      getValue: (r) => exportCurrency(r.payroll.cashDeduction, locale),
    },
    {
      header: t('employees.payroll.cols.cashierShortage'),
      getValue: (r) => exportCurrency(r.payroll.cashierShortage, locale),
    },
    {
      header: t('employees.payroll.cols.costDeduction'),
      getValue: (r) => exportCurrency(r.payroll.costDeduction, locale),
    },
    {
      header: t('employees.payroll.cols.temporaryAdvance'),
      getValue: (r) => exportCurrency(r.payroll.temporaryAdvance, locale),
    },
    {
      header: t('employees.payroll.cols.permanentAdvance'),
      getValue: (r) => exportCurrency(r.payroll.permanentAdvance, locale),
    },
    {
      header: t('employees.payroll.cols.socialInsurance'),
      getValue: (r) => exportCurrency(r.payroll.socialInsurance, locale),
    },
    {
      header: t('employees.payroll.cols.total'),
      getValue: (r) => exportCurrency(r.deductionsTotal, locale),
    },
    {
      header: t('employees.payroll.cols.netSalary'),
      getValue: (r) => exportCurrency(r.netSalary, locale),
    },
    {
      header: t('employees.payroll.cols.overtimeValue'),
      getValue: (r) => exportCurrency(r.overtimeValue, locale),
    },
  ]
}

export function getFingerprintExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<FingerprintRecord>[] {
  return [
    { header: t('fingerprint.table.id'), getValue: (r) => r.id },
    { header: t('fingerprint.table.employee'), getValue: (r) => pickName(r, isArabic) },
    { header: t('fingerprint.table.date'), getValue: (r) => exportDate(r.date, locale) },
    {
      header: t('fingerprint.table.checkIn'),
      getValue: (r) => (r.checkIn ? exportTime(r.checkIn, locale) : t('fingerprint.notRecorded')),
    },
    {
      header: t('fingerprint.table.checkOut'),
      getValue: (r) => (r.checkOut ? exportTime(r.checkOut, locale) : t('fingerprint.notRecorded')),
    },
    {
      header: t('fingerprint.table.location'),
      getValue: (r) => formatCoordinates(r.checkInLocation, isArabic),
    },
    {
      header: t('fingerprint.table.workHours'),
      getValue: (r) => exportWorkHours(r.workHoursMinutes, locale),
    },
  ]
}

export function getLeaveExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<LeaveRequest>[] {
  return [
    { header: t('leave.table.id'), getValue: (r) => r.id },
    { header: t('leave.table.employee'), getValue: (r) => pickName(r, isArabic) },
    { header: t('leave.table.type'), getValue: (r) => t(`leave.type.${r.leaveType}`) },
    { header: t('leave.table.startDate'), getValue: (r) => exportDate(r.startDate, locale) },
    { header: t('leave.table.endDate'), getValue: (r) => exportDate(r.endDate, locale) },
    { header: t('leave.table.days'), getValue: (r) => r.days },
    { header: t('leave.table.status'), getValue: (r) => t(`leave.status.${r.status}`) },
    {
      header: t('leave.table.reason'),
      getValue: (r) => pickBilingual(r.reason, r.reasonAr, isArabic),
    },
  ]
}

export function getWorkHoursDeductionExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<WorkHoursDeduction>[] {
  return [
    { header: t('workHoursDeduction.table.id'), getValue: (r) => r.id },
    { header: t('workHoursDeduction.table.employee'), getValue: (r) => pickName(r, isArabic) },
    { header: t('workHoursDeduction.table.date'), getValue: (r) => exportDate(r.date, locale) },
    {
      header: t('workHoursDeduction.table.deductedHours'),
      getValue: (r) => exportWorkHours(r.deductedMinutes, locale),
    },
    { header: t('workHoursDeduction.table.amount'), getValue: (r) => exportCurrency(r.amount, locale) },
    {
      header: t('workHoursDeduction.table.reason'),
      getValue: (r) => pickBilingual(r.reason, r.reasonAr, isArabic),
    },
    { header: t('workHoursDeduction.table.status'), getValue: (r) => t(`workHoursDeduction.status.${r.status}`) },
  ]
}

export function getWorkHoursAdditionExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<WorkHoursAddition>[] {
  return [
    { header: t('workHoursAddition.table.id'), getValue: (r) => r.id },
    { header: t('workHoursAddition.table.employee'), getValue: (r) => pickName(r, isArabic) },
    { header: t('workHoursAddition.table.date'), getValue: (r) => exportDate(r.date, locale) },
    {
      header: t('workHoursAddition.table.addedHours'),
      getValue: (r) => exportWorkHours(r.addedMinutes, locale),
    },
    { header: t('workHoursAddition.table.amount'), getValue: (r) => exportCurrency(r.amount, locale) },
    {
      header: t('workHoursAddition.table.reason'),
      getValue: (r) => pickBilingual(r.reason, r.reasonAr, isArabic),
    },
    { header: t('workHoursAddition.table.status'), getValue: (r) => t(`workHoursAddition.status.${r.status}`) },
  ]
}

export function getEmployeeRegistrationExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<EmployeeRegistration>[] {
  return [
    { header: t('employeeRegistration.table.id'), getValue: (r) => r.id },
    { header: t('employeeRegistration.table.employee'), getValue: (r) => pickName(r, isArabic) },
    { header: t('employeeRegistration.table.nationalId'), getValue: (r) => r.nationalId },
    {
      header: t('employeeRegistration.table.registrationDate'),
      getValue: (r) => exportDate(r.registrationDate, locale),
    },
    {
      header: t('employeeRegistration.table.jobTitle'),
      getValue: (r) => pickBilingual(r.jobTitle, r.jobTitleAr, isArabic),
    },
    {
      header: t('employeeRegistration.table.department'),
      getValue: (r) => pickBilingual(r.department, r.departmentAr, isArabic),
    },
    {
      header: t('employeeRegistration.table.contractType'),
      getValue: (r) => t(`employeeRegistration.contractType.${r.contractType}`),
    },
    {
      header: t('employeeRegistration.table.status'),
      getValue: (r) => t(`employeeRegistration.status.${r.status}`),
    },
  ]
}

export function getWorkInterruptionExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<WorkInterruption>[] {
  return [
    { header: t('workInterruption.table.id'), getValue: (r) => r.id },
    { header: t('workInterruption.table.employee'), getValue: (r) => pickName(r, isArabic) },
    { header: t('workInterruption.table.startDate'), getValue: (r) => exportDate(r.startDate, locale) },
    { header: t('workInterruption.table.endDate'), getValue: (r) => exportDate(r.endDate, locale) },
    {
      header: t('workInterruption.table.days'),
      getValue: (r) => t('workInterruption.daysCount', { count: r.interruptedDays }),
    },
    {
      header: t('workInterruption.table.type'),
      getValue: (r) => t(`workInterruption.type.${r.interruptionType}`),
    },
    {
      header: t('workInterruption.table.reason'),
      getValue: (r) => pickBilingual(r.reason, r.reasonAr, isArabic),
    },
    { header: t('workInterruption.table.status'), getValue: (r) => t(`workInterruption.status.${r.status}`) },
  ]
}

export function getPenaltiesExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<Penalty>[] {
  return [
    { header: t('penalties.table.id'), getValue: (r) => r.id },
    { header: t('penalties.table.employee'), getValue: (r) => pickName(r, isArabic) },
    { header: t('penalties.table.date'), getValue: (r) => exportDate(r.date, locale) },
    { header: t('penalties.table.type'), getValue: (r) => t(`penalties.type.${r.penaltyType}`) },
    {
      header: t('penalties.table.amount'),
      getValue: (r) => (r.amount > 0 ? exportCurrency(r.amount, locale) : t('penalties.noAmount')),
    },
    {
      header: t('penalties.table.reason'),
      getValue: (r) => pickBilingual(r.reason, r.reasonAr, isArabic),
    },
    { header: t('penalties.table.status'), getValue: (r) => t(`penalties.status.${r.status}`) },
  ]
}

export function getSalariesExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<Salary>[] {
  return [
    { header: t('salaries.table.id'), getValue: (r) => r.id },
    { header: t('salaries.table.employee'), getValue: (r) => pickName(r, isArabic) },
    { header: t('salaries.table.month'), getValue: (r) => formatMonthLabel(r.month, locale) },
    { header: t('salaries.table.basicSalary'), getValue: (r) => exportCurrency(r.basicSalary, locale) },
    { header: t('salaries.table.deductions'), getValue: (r) => exportCurrency(r.deductions, locale) },
    { header: t('salaries.table.netSalary'), getValue: (r) => exportCurrency(r.netSalary, locale) },
    { header: t('salaries.table.paymentDate'), getValue: (r) => exportDate(r.paymentDate, locale) },
    { header: t('salaries.table.status'), getValue: (r) => t(`salaries.status.${r.status}`) },
  ]
}

export function getMissionsExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<Mission>[] {
  return [
    { header: t('missions.table.id'), getValue: (r) => r.id },
    { header: t('missions.table.employee'), getValue: (r) => pickName(r, isArabic) },
    {
      header: t('missions.table.destination'),
      getValue: (r) => pickBilingual(r.destination, r.destinationAr, isArabic),
    },
    {
      header: t('missions.table.purpose'),
      getValue: (r) => pickBilingual(r.purpose, r.purposeAr, isArabic),
    },
    { header: t('missions.table.startDate'), getValue: (r) => exportDate(r.startDate, locale) },
    { header: t('missions.table.missionDays'), getValue: (r) => t('missions.daysCount', { count: r.missionDays }) },
    { header: t('missions.table.allowance'), getValue: (r) => exportCurrency(r.allowance, locale) },
    { header: t('missions.table.status'), getValue: (r) => t(`missions.status.${r.status}`) },
  ]
}

export function getInsuranceExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<Insurance>[] {
  return [
    { header: t('insurance.table.id'), getValue: (r) => r.id },
    { header: t('insurance.table.employee'), getValue: (r) => pickName(r, isArabic) },
    { header: t('insurance.table.type'), getValue: (r) => t(`insurance.type.${r.insuranceType}`) },
    {
      header: t('insurance.table.provider'),
      getValue: (r) => pickBilingual(r.provider, r.providerAr, isArabic),
    },
    { header: t('insurance.table.policyNumber'), getValue: (r) => r.policyNumber },
    { header: t('insurance.table.monthlyPremium'), getValue: (r) => exportCurrency(r.monthlyPremium, locale) },
    { header: t('insurance.table.coverageAmount'), getValue: (r) => exportCurrency(r.coverageAmount, locale) },
    { header: t('insurance.table.status'), getValue: (r) => t(`insurance.status.${r.status}`) },
  ]
}

export function getShiftsExportColumns(
  t: TFunction,
  isArabic: boolean,
  locale: string,
): ExportColumn<Shift>[] {
  return [
    { header: t('shifts.table.id'), getValue: (r) => r.id },
    { header: t('shifts.table.name'), getValue: (r) => pickBilingual(r.name, r.nameAr, isArabic) },
    { header: t('shifts.table.startTime'), getValue: (r) => formatShiftTime(r.startTime, locale) },
    { header: t('shifts.table.endTime'), getValue: (r) => formatShiftTime(r.endTime, locale) },
    { header: t('shifts.table.shiftHours'), getValue: (r) => t('shifts.hoursCount', { count: r.shiftHours }) },
    {
      header: t('shifts.table.workingDays'),
      getValue: (r) => pickBilingual(r.workingDays, r.workingDaysAr, isArabic),
    },
    { header: t('shifts.table.status'), getValue: (r) => t(`shifts.status.${r.status}`) },
  ]
}
