import { ArrowLeft, Ban, Pencil, Trash2, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { BlockEmployeeModal } from '../components/employees/BlockEmployeeModal'
import { RestoreEmployeeModal } from '../components/employees/RestoreEmployeeModal'
import { DeleteEmployeeModal } from '../components/employees/DeleteEmployeeModal'
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal'
import { EmployeeProfileTabs } from '../components/employees/EmployeeProfileTabs'
import { EmployeeStatusBadges } from '../components/employees/EmployeeStatusBadges'
import { useEmployees } from '../context/EmployeesContext'
import type { EmployeeInput } from '../types/employee'

export function EmployeeDetailsPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEmployee, updateEmployee, deleteEmployee, restoreEmployee, blockEmployee, unblockEmployee } =
    useEmployees()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [blockOpen, setBlockOpen] = useState(false)
  const [restoreOpen, setRestoreOpen] = useState(false)

  const employeeId = Number(id)
  const employee = getEmployee(employeeId)
  const isArabic = i18n.language === 'ar'

  if (!employee) {
    return <Navigate to="/employees" replace />
  }

  const displayName = isArabic ? employee.nameAr : employee.name

  const handleEdit = (input: EmployeeInput) => {
    updateEmployee(employee.id, input)
  }

  const handleDelete = () => {
    deleteEmployee(employee.id)
    navigate('/employees')
  }

  const handleBlock = () => {
    if (employee.isBlocked) {
      unblockEmployee(employee.id)
    } else {
      blockEmployee(employee.id)
    }
  }

  const handleRestore = () => {
    restoreEmployee(employee.id)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/employees"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t('employees.details.back')}
          </Link>

          <div className="flex flex-wrap gap-2">
            {!employee.isDeleted ? (
              <>
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-amber-500/50 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                >
                  <Pencil className="size-4" />
                  {t('employees.details.edit')}
                </button>
                <button
                  type="button"
                  onClick={() => setBlockOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                >
                  <Ban className="size-4" />
                  {t(employee.isBlocked ? 'employees.details.unblock' : 'employees.details.block')}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                >
                  <Trash2 className="size-4" />
                  {t('employees.details.delete')}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setRestoreOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                >
                  <Undo2 className="size-4" />
                  {t('employees.details.restore')}
                </button>
                {employee.isBlocked ? (
                  <button
                    type="button"
                    onClick={() => setBlockOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                  >
                    <Ban className="size-4" />
                    {t('employees.details.unblock')}
                  </button>
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
          <div className="border-b border-slate-200/80 bg-slate-50/80 px-6 py-5 dark:border-slate-700/80 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-400 to-violet-500 text-lg font-bold text-white">
                {displayName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {displayName}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isArabic ? employee.jobTitleAr : employee.jobTitle}
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {employee.email} · {employee.phone}
                </p>
                <EmployeeStatusBadges employee={employee} />
              </div>
            </div>
          </div>
        </div>

        <EmployeeProfileTabs employee={employee} />
      </div>

      <EmployeeFormModal
        open={editOpen}
        mode="edit"
        employee={employee}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
      />

      <DeleteEmployeeModal
        open={deleteOpen}
        employee={employee}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <BlockEmployeeModal
        open={blockOpen}
        employee={employee}
        onClose={() => setBlockOpen(false)}
        onConfirm={handleBlock}
      />

      <RestoreEmployeeModal
        open={restoreOpen}
        employee={employee}
        onClose={() => setRestoreOpen(false)}
        onConfirm={handleRestore}
      />
    </>
  )
}
