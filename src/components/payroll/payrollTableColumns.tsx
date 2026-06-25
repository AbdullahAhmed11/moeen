import { type ColumnHelper } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import type { TFunction } from 'i18next'
import type { EmployeePayrollRow } from '../../types/employeePayroll'
import { formatCurrency } from '../../utils/currency'

export function HeaderLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <ChevronDown className="size-3 opacity-60" />
    </span>
  )
}

export function money(value: number, locale: string) {
  return formatCurrency(value, locale)
}

export function createCompensationColumns<T extends EmployeePayrollRow>(
  columnHelper: ColumnHelper<T>,
  t: TFunction,
  locale: string,
) {
  return [
    columnHelper.accessor((row) => row.payroll.dailySalary, {
      id: 'dailySalary',
      header: () => <HeaderLabel label={t('employees.payroll.cols.dailySalary')} />,
      meta: { headerClassName: 'bg-[#e3f2fd] dark:bg-sky-950/30' },
      cell: (info) => money(info.getValue(), locale),
    }),
    columnHelper.accessor((row) => row.payroll.workDays, {
      id: 'workDays',
      header: () => <HeaderLabel label={t('employees.payroll.cols.workDays')} />,
      meta: { headerClassName: 'bg-[#e3f2fd] dark:bg-sky-950/30' },
    }),
    columnHelper.accessor((row) => row.payroll.overtimeHours, {
      id: 'overtimeHours',
      header: () => <HeaderLabel label={t('employees.payroll.cols.overtimeHours')} />,
      meta: { headerClassName: 'bg-[#e3f2fd] dark:bg-sky-950/30' },
    }),
    columnHelper.accessor((row) => row.payroll.representationAllowance, {
      id: 'representationAllowance',
      header: () => <HeaderLabel label={t('employees.payroll.cols.representationAllowance')} />,
      meta: { headerClassName: 'bg-[#e3f2fd] dark:bg-sky-950/30' },
      cell: (info) => money(info.getValue(), locale),
    }),
    columnHelper.accessor((row) => row.compensationTotal, {
      id: 'compensationTotal',
      header: () => <HeaderLabel label={t('employees.payroll.cols.total')} />,
      meta: { headerClassName: 'bg-[#e3f2fd] dark:bg-sky-950/30' },
      cell: (info) => (
        <span className="font-semibold text-sky-700 dark:text-sky-300">
          {money(info.getValue(), locale)}
        </span>
      ),
    }),
  ]
}

export function createDeductionsColumns<T extends EmployeePayrollRow>(
  columnHelper: ColumnHelper<T>,
  t: TFunction,
  locale: string,
  isArabic: boolean,
) {
  return [
    columnHelper.accessor((row) => row.employee.penalties, {
      id: 'penalties',
      header: () => <HeaderLabel label={t('employees.payroll.cols.penalties')} />,
      meta: { headerClassName: 'bg-[#ffe0b2] dark:bg-orange-950/30' },
      cell: (info) => money(info.getValue(), locale),
    }),
    columnHelper.accessor((row) => (isArabic ? row.payroll.penaltyFormulaAr : row.payroll.penaltyFormula), {
      id: 'penaltyFormula',
      header: () => <HeaderLabel label={t('employees.payroll.cols.formula')} />,
      meta: { headerClassName: 'bg-[#ffe0b2] dark:bg-orange-950/30' },
    }),
    columnHelper.accessor((row) => row.payroll.fingerprintDeduction, {
      id: 'fingerprintDeduction',
      header: () => <HeaderLabel label={t('employees.payroll.cols.fingerprintDeduction')} />,
      meta: { headerClassName: 'bg-[#ffe0b2] dark:bg-orange-950/30' },
      cell: (info) => money(info.getValue(), locale),
    }),
    columnHelper.accessor(
      (row) => (isArabic ? row.payroll.fingerprintFormulaAr : row.payroll.fingerprintFormula),
      {
        id: 'fingerprintFormula',
        header: () => <HeaderLabel label={t('employees.payroll.cols.formula')} />,
        meta: { headerClassName: 'bg-[#ffe0b2] dark:bg-orange-950/30' },
      },
    ),
    columnHelper.accessor((row) => row.payroll.cashDeduction, {
      id: 'cashDeduction',
      header: () => <HeaderLabel label={t('employees.payroll.cols.cashDeduction')} />,
      meta: { headerClassName: 'bg-[#ffe0b2] dark:bg-orange-950/30' },
      cell: (info) => money(info.getValue(), locale),
    }),
    columnHelper.accessor((row) => row.payroll.cashierShortage, {
      id: 'cashierShortage',
      header: () => <HeaderLabel label={t('employees.payroll.cols.cashierShortage')} />,
      meta: { headerClassName: 'bg-[#ffe0b2] dark:bg-orange-950/30' },
      cell: (info) => money(info.getValue(), locale),
    }),
    columnHelper.accessor((row) => row.payroll.costDeduction, {
      id: 'costDeduction',
      header: () => <HeaderLabel label={t('employees.payroll.cols.costDeduction')} />,
      meta: { headerClassName: 'bg-[#ffe0b2] dark:bg-orange-950/30' },
      cell: (info) => money(info.getValue(), locale),
    }),
    columnHelper.accessor((row) => row.payroll.temporaryAdvance, {
      id: 'temporaryAdvance',
      header: () => <HeaderLabel label={t('employees.payroll.cols.temporaryAdvance')} />,
      meta: { headerClassName: 'bg-[#ffe0b2] dark:bg-orange-950/30' },
      cell: (info) => money(info.getValue(), locale),
    }),
    columnHelper.accessor((row) => row.payroll.permanentAdvance, {
      id: 'permanentAdvance',
      header: () => <HeaderLabel label={t('employees.payroll.cols.permanentAdvance')} />,
      meta: { headerClassName: 'bg-[#ffe0b2] dark:bg-orange-950/30' },
      cell: (info) => money(info.getValue(), locale),
    }),
    columnHelper.accessor((row) => row.payroll.socialInsurance, {
      id: 'socialInsurance',
      header: () => <HeaderLabel label={t('employees.payroll.cols.socialInsurance')} />,
      meta: { headerClassName: 'bg-[#ffe0b2] dark:bg-orange-950/30' },
      cell: (info) => money(info.getValue(), locale),
    }),
    columnHelper.accessor((row) => row.deductionsTotal, {
      id: 'deductionsTotal',
      header: () => <HeaderLabel label={t('employees.payroll.cols.total')} />,
      meta: { headerClassName: 'bg-[#ffe0b2] dark:bg-orange-950/30' },
      cell: (info) => (
        <span className="font-semibold text-orange-700 dark:text-orange-300">
          {money(info.getValue(), locale)}
        </span>
      ),
    }),
  ]
}

export function createPayrollSummaryColumns<T extends EmployeePayrollRow>(
  columnHelper: ColumnHelper<T>,
  t: TFunction,
  locale: string,
) {
  return [
    columnHelper.accessor((row) => row.netSalary, {
      id: 'netSalary',
      header: () => <HeaderLabel label={t('employees.payroll.cols.netSalary')} />,
      meta: {
        headerClassName: 'bg-[#1565c0] text-white dark:bg-blue-800',
        groupHeaderClassName: 'bg-[#1565c0] text-white dark:bg-blue-800',
      },
      cell: (info) => (
        <span className="font-bold text-blue-700 dark:text-blue-300">
          {money(info.getValue(), locale)}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'signature',
      header: () => <HeaderLabel label={t('employees.payroll.cols.signature')} />,
      meta: {
        headerClassName: 'bg-[#e0e0e0] dark:bg-slate-700',
        groupHeaderClassName: 'bg-[#e0e0e0] dark:bg-slate-700',
      },
      cell: () => <span className="inline-block min-w-16 border-b border-slate-400" />,
    }),
    columnHelper.accessor((row) => row.overtimeValue, {
      id: 'overtimeValue',
      header: () => <HeaderLabel label={t('employees.payroll.cols.overtimeValue')} />,
      meta: {
        headerClassName: 'bg-[#bdbdbd] dark:bg-slate-600',
        groupHeaderClassName: 'bg-[#bdbdbd] dark:bg-slate-600',
      },
      cell: (info) => money(info.getValue(), locale),
    }),
    columnHelper.display({
      id: 'serialLeft',
      header: () => <HeaderLabel label={t('employees.payroll.cols.serial')} />,
      meta: {
        headerClassName: 'bg-[#bdbdbd] dark:bg-slate-600',
        groupHeaderClassName: 'bg-[#bdbdbd] dark:bg-slate-600',
      },
      cell: ({ row }) => row.original.serial,
    }),
  ]
}
