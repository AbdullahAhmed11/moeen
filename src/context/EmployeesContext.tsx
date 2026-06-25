import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { initialEmployees } from '../data/employees'
import type { Employee, EmployeeInput } from '../types/employee'

type EmployeesContextValue = {
  employees: Employee[]
  addEmployee: (input: EmployeeInput) => Employee
  updateEmployee: (id: number, input: EmployeeInput) => void
  deleteEmployee: (id: number) => void
  restoreEmployee: (id: number) => void
  blockEmployee: (id: number) => void
  unblockEmployee: (id: number) => void
  getEmployee: (id: number) => Employee | undefined
}

const EmployeesContext = createContext<EmployeesContextValue | null>(null)

export function EmployeesProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)

  const addEmployee = useCallback((input: EmployeeInput) => {
    const newEmployee: Employee = {
      id: Date.now(),
      ...input,
      isDeleted: false,
      isBlocked: false,
    }
    setEmployees((prev) => [...prev, newEmployee])
    return newEmployee
  }, [])

  const updateEmployee = useCallback((id: number, input: EmployeeInput) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { id, ...input, isDeleted: emp.isDeleted, isBlocked: emp.isBlocked } : emp,
      ),
    )
  }, [])

  const deleteEmployee = useCallback((id: number) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, isDeleted: true, status: 'terminated' as const } : emp,
      ),
    )
  }, [])

  const restoreEmployee = useCallback((id: number) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, isDeleted: false, status: 'active' as const } : emp,
      ),
    )
  }, [])

  const blockEmployee = useCallback((id: number) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, isBlocked: true } : emp)),
    )
  }, [])

  const unblockEmployee = useCallback((id: number) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, isBlocked: false } : emp)),
    )
  }, [])

  const getEmployee = useCallback(
    (id: number) => employees.find((emp) => emp.id === id),
    [employees],
  )

  const value = useMemo(
    () => ({
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      restoreEmployee,
      blockEmployee,
      unblockEmployee,
      getEmployee,
    }),
    [employees, addEmployee, updateEmployee, deleteEmployee, restoreEmployee, blockEmployee, unblockEmployee, getEmployee],
  )

  return <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>
}

export function useEmployees() {
  const context = useContext(EmployeesContext)
  if (!context) {
    throw new Error('useEmployees must be used within EmployeesProvider')
  }
  return context
}
