export type SalaryStatus = 'pending' | 'approved' | 'paid' | 'cancelled'

export type Salary = {
  id: number
  employeeId: number
  employeeName: string
  employeeNameAr: string
  month: string
  basicSalary: number
  allowances: number
  overtime: number
  deductions: number
  netSalary: number
  paymentDate: string
  status: SalaryStatus
  isDeleted: boolean
}

export type SalaryInput = Omit<Salary, 'id' | 'isDeleted'>
