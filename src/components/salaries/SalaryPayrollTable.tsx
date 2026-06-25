import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Salary } from '../../types/salary'
import type { SalaryPayrollTableRow } from '../../types/salaryPayroll'
import { GroupedPayrollTable } from '../payroll/GroupedPayrollTable'
import {
  createCompensationColumns,
  createDeductionsColumns,
  createPayrollSummaryColumns,
  HeaderLabel,
} from '../payroll/payrollTableColumns'

type SalaryPayrollTableProps = {
  rows: SalaryPayrollTableRow[]
  onView: (record: Salary) => void
  onEdit: (record: Salary) => void
  onDelete: (record: Salary) => void
}

const columnHelper = createColumnHelper<SalaryPayrollTableRow>()

function formatMonth(month: string, locale: string) {
  const [year, monthNum] = month.split('-')
  const date = new Date(Number(year), Number(monthNum) - 1)
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function SalaryPayrollTable({
  rows,
  onView,
  onEdit,
  onDelete,
}: SalaryPayrollTableProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const locale = i18n.language

  const columns = useMemo(
    () => [
      columnHelper.group({
        id: 'employeeInfo',
        header: () => t('salaries.payroll.groups.employeeInfo'),
        meta: { headerClassName: 'bg-[#c8e6c9] text-slate-800 dark:bg-emerald-900/40 dark:text-emerald-100' },
        columns: [
          columnHelper.accessor('serial', {
            header: () => <HeaderLabel label={t('employees.payroll.cols.serial')} />,
            meta: { headerClassName: 'bg-[#e8f5e9] dark:bg-emerald-950/30' },
            cell: (info) => info.getValue(),
          }),
          columnHelper.display({
            id: 'employee',
            header: () => <HeaderLabel label={t('salaries.table.employee')} />,
            meta: { headerClassName: 'bg-[#e8f5e9] dark:bg-emerald-950/30' },
            cell: ({ row }) =>
              isArabic ? row.original.employee.nameAr : row.original.employee.name,
          }),
          columnHelper.accessor((row: SalaryPayrollTableRow) => row.salary.month, {
            id: 'month',
            header: () => <HeaderLabel label={t('salaries.table.month')} />,
            meta: { headerClassName: 'bg-[#e8f5e9] dark:bg-emerald-950/30' },
            cell: (info) => formatMonth(info.getValue(), locale),
          }),
          columnHelper.accessor((row: SalaryPayrollTableRow) => row.salary.status, {
            id: 'status',
            header: () => <HeaderLabel label={t('salaries.table.status')} />,
            meta: { headerClassName: 'bg-[#e8f5e9] dark:bg-emerald-950/30' },
            cell: (info) => t(`salaries.status.${info.getValue()}`),
          }),
        ],
      }),
      columnHelper.group({
        id: 'compensation',
        header: () => t('employees.payroll.groups.compensation'),
        meta: { headerClassName: 'bg-[#bbdefb] text-slate-800 dark:bg-sky-900/40 dark:text-sky-100' },
        columns: createCompensationColumns(columnHelper, t, locale),
      }),
      columnHelper.group({
        id: 'deductions',
        header: () => t('employees.payroll.groups.deductions'),
        meta: { headerClassName: 'bg-[#ffccbc] text-slate-800 dark:bg-orange-900/40 dark:text-orange-100' },
        columns: createDeductionsColumns(columnHelper, t, locale, isArabic),
      }),
      ...createPayrollSummaryColumns(columnHelper, t, locale),
      columnHelper.display({
        id: 'actions',
        header: () => t('salaries.table.actions'),
        meta: {
          headerClassName: 'bg-slate-100 dark:bg-slate-800',
          groupHeaderClassName: 'bg-slate-100 dark:bg-slate-800',
        },
        cell: ({ row }) => {
          const record = row.original.salary
          const name = isArabic ? record.employeeNameAr : record.employeeName
          return (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onView(record)}
                aria-label={t('salaries.actions.view', { name })}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Eye className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onEdit(record)}
                aria-label={t('salaries.actions.edit', { name })}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
              >
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(record)}
                aria-label={t('salaries.actions.delete', { name })}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          )
        },
      }),
    ],
    [t, isArabic, locale, onView, onEdit, onDelete],
  )

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <GroupedPayrollTable table={table} minWidth="2200px" />
}
