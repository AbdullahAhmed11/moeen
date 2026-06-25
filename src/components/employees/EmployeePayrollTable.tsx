import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Ban, Eye, Pencil, Trash2, Undo2 } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Employee } from '../../types/employee'
import type { EmployeePayrollRow } from '../../types/employeePayroll'
import { buildPayrollRow } from '../../utils/employeePayroll'
import { GroupedPayrollTable } from '../payroll/GroupedPayrollTable'
import { HeaderLabel } from '../payroll/payrollTableColumns'
import { EmployeeStatusBadges } from './EmployeeStatusBadges'

type EmployeePayrollTableProps = {
  employees: Employee[]
  onView: (employee: Employee) => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
  onBlock: (employee: Employee) => void
  onRestore: (employee: Employee) => void
}

const columnHelper = createColumnHelper<EmployeePayrollRow>()

export function EmployeePayrollTable({
  employees,
  onView,
  onEdit,
  onDelete,
  onBlock,
  onRestore,
}: EmployeePayrollTableProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const data = useMemo(
    () => employees.map((employee, index) => buildPayrollRow(employee, index)),
    [employees],
  )

  const columns = useMemo(
    () => [
      columnHelper.group({
        id: 'jobData',
        header: () => t('employees.payroll.groups.jobData'),
        meta: { headerClassName: 'bg-[#c8e6c9] text-slate-800 dark:bg-emerald-900/40 dark:text-emerald-100' },
        columns: [
          columnHelper.accessor('serial', {
            header: () => <HeaderLabel label={t('employees.payroll.cols.serial')} />,
            meta: { headerClassName: 'bg-[#e8f5e9] dark:bg-emerald-950/30' },
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor((row) => row.payroll.jobNumber, {
            id: 'jobNumber',
            header: () => <HeaderLabel label={t('employees.payroll.cols.jobNumber')} />,
            meta: { headerClassName: 'bg-[#e8f5e9] dark:bg-emerald-950/30' },
          }),
          columnHelper.display({
            id: 'name',
            header: () => <HeaderLabel label={t('employees.payroll.cols.name')} />,
            meta: { headerClassName: 'bg-[#e8f5e9] dark:bg-emerald-950/30' },
            cell: ({ row }) => {
              const employee = row.original.employee
              return (
                <div>
                  <span className={employee.isDeleted ? 'text-slate-400 line-through' : ''}>
                    {isArabic ? employee.nameAr : employee.name}
                  </span>
                  <EmployeeStatusBadges employee={employee} />
                </div>
              )
            },
          }),
          columnHelper.display({
            id: 'department',
            header: () => <HeaderLabel label={t('employees.payroll.cols.department')} />,
            meta: { headerClassName: 'bg-[#e8f5e9] dark:bg-emerald-950/30' },
            cell: ({ row }) =>
              isArabic ? row.original.payroll.departmentAr : row.original.payroll.department,
          }),
          columnHelper.display({
            id: 'branch',
            header: () => <HeaderLabel label={t('employees.payroll.cols.branch')} />,
            meta: { headerClassName: 'bg-[#e8f5e9] dark:bg-emerald-950/30' },
            cell: ({ row }) =>
              isArabic ? row.original.payroll.branchAr : row.original.payroll.branch,
          }),
          columnHelper.display({
            id: 'jobTitle',
            header: () => <HeaderLabel label={t('employees.payroll.cols.jobTitle')} />,
            meta: { headerClassName: 'bg-[#e8f5e9] dark:bg-emerald-950/30' },
            cell: ({ row }) =>
              isArabic ? row.original.employee.jobTitleAr : row.original.employee.jobTitle,
          }),
        ],
      }),
      columnHelper.display({
        id: 'actions',
        header: () => t('employees.table.actions'),
        meta: {
          headerClassName: 'bg-slate-100 dark:bg-slate-800',
          groupHeaderClassName: 'bg-slate-100 dark:bg-slate-800',
        },
        cell: ({ row }) => {
          const employee = row.original.employee
          const name = isArabic ? employee.nameAr : employee.name
          return (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onView(employee)}
                aria-label={t('employees.actions.view', { name })}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Eye className="size-4" />
              </button>
              {!employee.isDeleted ? (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit(employee)}
                    aria-label={t('employees.actions.edit', { name })}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onBlock(employee)}
                    aria-label={t(
                      employee.isBlocked ? 'employees.actions.unblock' : 'employees.actions.block',
                      { name },
                    )}
                    className={[
                      'rounded-lg p-1.5',
                      employee.isBlocked
                        ? 'text-amber-600 hover:bg-amber-50'
                        : 'text-slate-500 hover:bg-amber-50 hover:text-amber-600',
                    ].join(' ')}
                  >
                    <Ban className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(employee)}
                    aria-label={t('employees.actions.delete', { name })}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onRestore(employee)}
                    aria-label={t('employees.actions.restore', { name })}
                    className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Undo2 className="size-4" />
                  </button>
                  {employee.isBlocked ? (
                    <button
                      type="button"
                      onClick={() => onBlock(employee)}
                      aria-label={t('employees.actions.unblock', { name })}
                      className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50"
                    >
                      <Ban className="size-4" />
                    </button>
                  ) : null}
                </>
              )}
            </div>
          )
        },
      }),
    ],
    [t, isArabic, onView, onEdit, onDelete, onBlock, onRestore],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <GroupedPayrollTable
      table={table}
      minWidth="960px"
      getRowClassName={(row) =>
        row.employee.isDeleted ? 'bg-red-50/50 opacity-75 dark:bg-red-950/20' : ''
      }
    />
  )
}
