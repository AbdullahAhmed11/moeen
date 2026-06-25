import type { AttendanceRecord } from '../types/fingerprint'
import type { Employee } from '../types/employee'
import type { EmployeeRegistration } from '../types/employeeRegistration'
import type { Insurance } from '../types/insurance'
import type { LeaveRequest } from '../types/leave'
import type { Mission } from '../types/mission'
import type { Penalty } from '../types/penalty'
import type { Salary } from '../types/salary'
import type { Shift } from '../types/shift'
import type { WorkHoursAddition } from '../types/workHoursAddition'
import type { WorkHoursDeduction } from '../types/workHoursDeduction'
import type { WorkInterruption } from '../types/workInterruption'

export function normalizeSearch(query: string) {
  return query.trim().toLowerCase()
}

export function filterBySearch<T>(
  items: T[],
  query: string,
  getSearchText: (item: T) => string,
): T[] {
  const normalized = normalizeSearch(query)
  if (!normalized) return items
  return items.filter((item) => getSearchText(item).toLowerCase().includes(normalized))
}

export function hasSearchQuery(query: string) {
  return normalizeSearch(query).length > 0
}

function join(...parts: (string | number | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

export const tableSearchText = {
  employee: (employee: Employee) =>
    join(
      employee.id,
      employee.name,
      employee.nameAr,
      employee.email,
      employee.phone,
      employee.jobTitle,
      employee.jobTitleAr,
      employee.subDepartment,
      employee.subDepartmentAr,
      employee.managerName,
      employee.managerNameAr,
    ),
  attendance: (record: AttendanceRecord) =>
    join(
      record.id,
      record.employeeName,
      record.employeeNameAr,
      record.date,
      record.checkInMethod,
      record.checkOutMethod,
      record.checkInLocation?.name,
      record.checkInLocation?.nameAr,
    ),
  leave: (leave: LeaveRequest) =>
    join(
      leave.id,
      leave.employeeName,
      leave.employeeNameAr,
      leave.leaveType,
      leave.startDate,
      leave.endDate,
      leave.reason,
      leave.reasonAr,
      leave.status,
    ),
  penalty: (record: Penalty) =>
    join(
      record.id,
      record.employeeName,
      record.employeeNameAr,
      record.penaltyType,
      record.reason,
      record.reasonAr,
      record.date,
      record.status,
    ),
  salary: (record: Salary) =>
    join(record.id, record.employeeName, record.employeeNameAr, record.month, record.status),
  mission: (record: Mission) =>
    join(
      record.id,
      record.employeeName,
      record.employeeNameAr,
      record.destination,
      record.destinationAr,
      record.purpose,
      record.purposeAr,
    ),
  insurance: (record: Insurance) =>
    join(
      record.id,
      record.employeeName,
      record.employeeNameAr,
      record.policyNumber,
      record.provider,
      record.providerAr,
      record.insuranceType,
    ),
  shift: (record: Shift) =>
    join(
      record.id,
      record.name,
      record.nameAr,
      record.startTime,
      record.endTime,
      record.workingDays,
      record.workingDaysAr,
      record.status,
    ),
  workHoursDeduction: (record: WorkHoursDeduction) =>
    join(
      record.id,
      record.employeeName,
      record.employeeNameAr,
      record.reason,
      record.reasonAr,
      record.date,
      record.status,
    ),
  workHoursAddition: (record: WorkHoursAddition) =>
    join(
      record.id,
      record.employeeName,
      record.employeeNameAr,
      record.reason,
      record.reasonAr,
      record.date,
      record.status,
    ),
  workInterruption: (record: WorkInterruption) =>
    join(
      record.id,
      record.employeeName,
      record.employeeNameAr,
      record.interruptionType,
      record.reason,
      record.reasonAr,
      record.startDate,
      record.endDate,
      record.status,
    ),
  employeeRegistration: (record: EmployeeRegistration) =>
    join(
      record.id,
      record.employeeName,
      record.employeeNameAr,
      record.nationalId,
      record.jobTitle,
      record.jobTitleAr,
      record.department,
      record.departmentAr,
      record.contractType,
      record.status,
    ),
}
