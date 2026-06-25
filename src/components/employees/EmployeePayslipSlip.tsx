import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { EmployeePayrollRow } from '../../types/employeePayroll'
import { formatMonthLabel } from '../../utils/exportHelpers'
import { PAYSLIP_EXPORT_ELEMENT_ID } from '../../utils/payslipExport'

type EmployeePayslipSlipProps = {
  row: EmployeePayrollRow
  month: string
}

function formatAmount(value: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function PayslipCell({
  label,
  value,
  headerClassName,
}: {
  label: string
  value: string | number
  headerClassName: string
}) {
  return (
    <td className="border border-black p-0 align-top">
      <div
        className={[
          'border-b border-black px-1 py-1 text-center text-[10px] leading-tight font-bold',
          headerClassName,
        ].join(' ')}
      >
        {label}
      </div>
      <div className="bg-white px-1 py-2 text-center text-xs font-medium text-slate-900 dark:bg-white dark:text-slate-900">
        {value}
      </div>
    </td>
  )
}

export function EmployeePayslipSlip({ row, month }: EmployeePayslipSlipProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { employee, payroll } = row

  const daysValue = payroll.dailySalary * payroll.workDays
  const penaltyCount = employee.penalties > 0 ? 1 : 0
  const fingerprintCount = payroll.fingerprintDeduction > 0 ? 1 : 0
  const jobCode = payroll.jobNumber.replace(/^EMP-/i, '')

  const monthLabel = useMemo(
    () => formatMonthLabel(month, i18n.language),
    [month, i18n.language],
  )

  const earningHeader = 'bg-[#d9ead3] text-slate-900'
  const deductionHeader = 'bg-[#fce4d6] text-slate-900'
  const totalHeader = 'bg-[#ffff00] text-slate-900'

  return (
    <div
      id={PAYSLIP_EXPORT_ELEMENT_ID}
      className="overflow-x-auto rounded-lg border border-black bg-white shadow-sm"
    >
      <table className="w-full min-w-[960px] border-collapse text-xs" dir="rtl">
        <tbody>
          <tr>
            <td
              rowSpan={2}
              className="w-14 border border-black bg-[#ffff00] px-1 py-2 text-center align-middle"
            >
              <span
                className="inline-block text-sm font-bold text-slate-900"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                {monthLabel}
              </span>
            </td>

            <PayslipCell
              label={t('employees.payslip.jobCode')}
              value={jobCode}
              headerClassName={earningHeader}
            />
            <PayslipCell
              label={t('employees.payslip.name')}
              value={isArabic ? employee.nameAr : employee.name}
              headerClassName={earningHeader}
            />
            <PayslipCell
              label={t('employees.payroll.cols.jobTitle')}
              value={isArabic ? employee.jobTitleAr : employee.jobTitle}
              headerClassName={earningHeader}
            />
            <PayslipCell
              label={t('employees.payroll.cols.dailySalary')}
              value={formatAmount(payroll.dailySalary)}
              headerClassName={earningHeader}
            />
            <PayslipCell
              label={t('employees.payroll.cols.workDays')}
              value={formatAmount(payroll.workDays)}
              headerClassName={earningHeader}
            />
            <PayslipCell
              label={t('employees.payslip.daysValue')}
              value={formatAmount(daysValue)}
              headerClassName={earningHeader}
            />
            <PayslipCell
              label={t('employees.payslip.overtimeHoursShort')}
              value={formatAmount(payroll.overtimeHours)}
              headerClassName={earningHeader}
            />
            <PayslipCell
              label={t('employees.payslip.overtimeValueShort')}
              value={formatAmount(row.overtimeValue)}
              headerClassName={earningHeader}
            />
            <PayslipCell
              label={t('employees.payslip.totalEarnings')}
              value={formatAmount(row.compensationTotal)}
              headerClassName={totalHeader}
            />

            <td
              rowSpan={2}
              className="w-24 border border-black bg-[#cfe2f3] px-2 py-3 text-center align-middle"
            >
              <p className="text-[10px] leading-tight font-bold text-slate-900">
                {t('employees.payslip.netSalary')}
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {Math.round(row.netSalary).toLocaleString('en-US')}
              </p>
            </td>
          </tr>

          <tr>
            <PayslipCell
              label={t('employees.payroll.cols.penalties')}
              value={penaltyCount}
              headerClassName={deductionHeader}
            />
            <PayslipCell
              label={t('employees.payslip.penaltiesValue')}
              value={formatAmount(employee.penalties)}
              headerClassName={deductionHeader}
            />
            <PayslipCell
              label={t('employees.payroll.cols.fingerprintDeduction')}
              value={fingerprintCount}
              headerClassName={deductionHeader}
            />
            <PayslipCell
              label={t('employees.payslip.fingerprintDeductionValue')}
              value={formatAmount(payroll.fingerprintDeduction)}
              headerClassName={deductionHeader}
            />
            <PayslipCell
              label={t('employees.payslip.cashDeductionShort')}
              value={formatAmount(payroll.cashDeduction)}
              headerClassName={deductionHeader}
            />
            <PayslipCell
              label={t('employees.payroll.cols.cashierShortage')}
              value={formatAmount(payroll.cashierShortage)}
              headerClassName={deductionHeader}
            />
            <PayslipCell
              label={t('employees.payroll.cols.temporaryAdvance')}
              value={formatAmount(payroll.temporaryAdvance)}
              headerClassName={deductionHeader}
            />
            <PayslipCell
              label={t('employees.payroll.cols.permanentAdvance')}
              value={formatAmount(payroll.permanentAdvance)}
              headerClassName={deductionHeader}
            />
            <PayslipCell
              label={t('employees.payroll.cols.socialInsurance')}
              value={formatAmount(payroll.socialInsurance)}
              headerClassName={deductionHeader}
            />
            <PayslipCell
              label={t('employees.payslip.totalDeductions')}
              value={formatAmount(row.deductionsTotal)}
              headerClassName={totalHeader}
            />
          </tr>
        </tbody>
      </table>
    </div>
  )
}
