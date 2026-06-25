export function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function getNetSalary(employee: { salary: number; deductions: number; penalties: number }) {
  return employee.salary - employee.deductions - employee.penalties
}
