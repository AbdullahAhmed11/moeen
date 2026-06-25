import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { initialLeaves } from '../data/leaves'
import { softDeleteById } from '../utils/softDelete'
import type { LeaveInput, LeaveRequest } from '../types/leave'
import { useEmployees } from './EmployeesContext'

type LeaveContextValue = {
  leaves: LeaveRequest[]
  addLeave: (input: LeaveInput) => LeaveRequest
  updateLeave: (id: number, input: LeaveInput) => void
  deleteLeave: (id: number) => void
  approveLeave: (id: number) => void
  rejectLeave: (id: number) => void
  getEmployeeLeaves: (employeeId: number) => LeaveRequest[]
  getPendingForManager: (managerId: number) => LeaveRequest[]
}

const LeaveContext = createContext<LeaveContextValue | null>(null)

export function LeaveProvider({ children }: { children: ReactNode }) {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves)
  const { employees, updateEmployee } = useEmployees()

  const addLeave = useCallback((input: LeaveInput) => {
    const newLeave: LeaveRequest = { id: Date.now(), ...input, isDeleted: false }
    setLeaves((prev) => [newLeave, ...prev])
    return newLeave
  }, [])

  const updateLeave = useCallback((id: number, input: LeaveInput) => {
    setLeaves((prev) =>
      prev.map((leave) =>
        leave.id === id ? { id, ...input, isDeleted: leave.isDeleted } : leave,
      ),
    )
  }, [])

  const deleteLeave = useCallback((id: number) => {
    setLeaves((prev) => softDeleteById(prev, id))
  }, [])

  const applyBalanceChange = useCallback(
    (leave: LeaveRequest, direction: 'approve' | 'reject') => {
      const employee = employees.find((item) => item.id === leave.employeeId)
      if (!employee) return

      if (direction === 'approve' && leave.leaveType === 'annual') {
        updateEmployee(employee.id, {
          ...employee,
          annualLeaveBalance: Math.max(0, employee.annualLeaveBalance - leave.days),
          status: leave.startDate <= new Date().toISOString().slice(0, 10) ? 'on_leave' : employee.status,
        })
      }

      if (direction === 'approve' && leave.leaveType === 'sick') {
        updateEmployee(employee.id, {
          ...employee,
          sickLeaveBalance: Math.max(0, employee.sickLeaveBalance - leave.days),
        })
      }

      if (direction === 'reject' && employee.status === 'on_leave') {
        updateEmployee(employee.id, { ...employee, status: 'active' })
      }
    },
    [employees, updateEmployee],
  )

  const approveLeave = useCallback(
    (id: number) => {
      setLeaves((prev) =>
        prev.map((leave) => {
          if (leave.id !== id) return leave
          applyBalanceChange(leave, 'approve')
          return { ...leave, status: 'approved' }
        }),
      )
    },
    [applyBalanceChange],
  )

  const rejectLeave = useCallback(
    (id: number) => {
      setLeaves((prev) =>
        prev.map((leave) => {
          if (leave.id !== id) return leave
          applyBalanceChange(leave, 'reject')
          return { ...leave, status: 'rejected' }
        }),
      )
    },
    [applyBalanceChange],
  )

  const getEmployeeLeaves = useCallback(
    (employeeId: number) =>
      leaves.filter((leave) => leave.employeeId === employeeId && !leave.isDeleted),
    [leaves],
  )

  const getPendingForManager = useCallback(
    (managerId: number) => {
      const teamIds = new Set(
        employees.filter((employee) => employee.managerId === managerId).map((e) => e.id),
      )
      return leaves.filter(
        (leave) =>
          !leave.isDeleted && leave.status === 'pending' && teamIds.has(leave.employeeId),
      )
    },
    [employees, leaves],
  )

  const value = useMemo(
    () => ({
      leaves,
      addLeave,
      updateLeave,
      deleteLeave,
      approveLeave,
      rejectLeave,
      getEmployeeLeaves,
      getPendingForManager,
    }),
    [
      leaves,
      addLeave,
      updateLeave,
      deleteLeave,
      approveLeave,
      rejectLeave,
      getEmployeeLeaves,
      getPendingForManager,
    ],
  )

  return <LeaveContext.Provider value={value}>{children}</LeaveContext.Provider>
}

export function useLeaves() {
  const context = useContext(LeaveContext)
  if (!context) {
    throw new Error('useLeaves must be used within LeaveProvider')
  }
  return context
}
