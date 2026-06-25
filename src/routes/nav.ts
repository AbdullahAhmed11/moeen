import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  Banknote,
  BookUser,
  CalendarClock,
  CalendarDays,
  ClockArrowDown,
  ClockArrowUp,
  Fingerprint,
  LayoutDashboard,
  MapPin,
  PauseCircle,
  Shield,
  Smartphone,
  Users,
} from 'lucide-react'

export type NavKey =
  | 'dashboard'
  | 'employees'
  | 'fingerprint'
  | 'leave'
  | 'manager'
  | 'workHoursDeduction'
  | 'workHoursAddition'
  | 'employeeRegistration'
  | 'workInterruption'
  | 'penalties'
  | 'salaries'
  | 'missions'
  | 'insurance'
  | 'shifts'

export type NavItem = {
  key: NavKey
  path: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { key: 'dashboard', path: '/', icon: LayoutDashboard },
  { key: 'employees', path: '/employees', icon: Users },
  { key: 'fingerprint', path: '/fingerprint', icon: Fingerprint },
  { key: 'leave', path: '/leave', icon: CalendarDays },
  { key: 'manager', path: '/manager', icon: Smartphone },
  { key: 'workHoursDeduction', path: '/work-hours-deduction', icon: ClockArrowDown },
  { key: 'workHoursAddition', path: '/work-hours-addition', icon: ClockArrowUp },
  { key: 'employeeRegistration', path: '/employee-registration', icon: BookUser },
  { key: 'workInterruption', path: '/work-interruption', icon: PauseCircle },
  { key: 'penalties', path: '/penalties', icon: AlertTriangle },
  { key: 'salaries', path: '/salaries', icon: Banknote },
  { key: 'missions', path: '/missions', icon: MapPin },
  { key: 'insurance', path: '/insurance', icon: Shield },
  { key: 'shifts', path: '/shifts', icon: CalendarClock },
]

export function getNavItemByPath(pathname: string): NavItem {
  if (pathname === '/') return navItems[0]
  return navItems.find((item) => item.path !== '/' && pathname.startsWith(item.path)) ?? navItems[0]
}
