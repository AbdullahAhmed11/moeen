import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { ThemeProvider } from './components/ThemeProvider'
import { AttendanceProvider } from './context/AttendanceContext'
import { AuthProvider } from './context/AuthContext'
import { EmployeesProvider } from './context/EmployeesContext'
import { LeaveProvider } from './context/LeaveContext'
import { DashboardPage } from './pages/DashboardPage'
import { EmployeeDetailsPage } from './pages/EmployeeDetailsPage'
import { EmployeesPage } from './pages/EmployeesPage'
import { FingerprintPage } from './pages/FingerprintPage'
import { WorkHoursDeductionPage } from './pages/WorkHoursDeductionPage'
import { WorkHoursAdditionPage } from './pages/WorkHoursAdditionPage'
import { EmployeeRegistrationPage } from './pages/EmployeeRegistrationPage'
import { WorkInterruptionPage } from './pages/WorkInterruptionPage'
import { PenaltiesPage } from './pages/PenaltiesPage'
import { SalariesPage } from './pages/SalariesPage'
import { MissionsPage } from './pages/MissionsPage'
import { InsurancePage } from './pages/InsurancePage'
import { ShiftsPage } from './pages/ShiftsPage'
import { LeavePage } from './pages/LeavePage'
import { ManagerPage } from './pages/ManagerPage'
import { EmptyPage } from './pages/EmptyPage'
import { LoginPage } from './pages/LoginPage'
import { navItems } from './routes/nav'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <EmployeesProvider>
            <AttendanceProvider>
              <LeaveProvider>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/employees" element={<EmployeesPage />} />
                      <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
                      <Route path="/fingerprint" element={<FingerprintPage />} />
                      <Route path="/leave" element={<LeavePage />} />
                      <Route path="/manager" element={<ManagerPage />} />
                      <Route path="/work-hours-deduction" element={<WorkHoursDeductionPage />} />
                      <Route path="/work-hours-addition" element={<WorkHoursAdditionPage />} />
                      <Route path="/employee-registration" element={<EmployeeRegistrationPage />} />
                      <Route path="/work-interruption" element={<WorkInterruptionPage />} />
                      <Route path="/penalties" element={<PenaltiesPage />} />
                      <Route path="/salaries" element={<SalariesPage />} />
                      <Route path="/missions" element={<MissionsPage />} />
                      <Route path="/insurance" element={<InsurancePage />} />
                      <Route path="/shifts" element={<ShiftsPage />} />
                      {navItems
                        .filter(
                          (item) =>
                            item.key !== 'dashboard' &&
                            item.key !== 'employees' &&
                            item.key !== 'fingerprint' &&
                            item.key !== 'leave' &&
                            item.key !== 'manager' &&
                            item.key !== 'workHoursDeduction' &&
                            item.key !== 'workHoursAddition' &&
                            item.key !== 'employeeRegistration' &&
                            item.key !== 'workInterruption' &&
                            item.key !== 'penalties' &&
                            item.key !== 'salaries' &&
                            item.key !== 'missions' &&
                            item.key !== 'insurance' &&
                            item.key !== 'shifts',
                        )
                        .map((item) => (
                          <Route
                            key={item.key}
                            path={item.path}
                            element={<EmptyPage pageKey={item.key} />}
                          />
                        ))}
                    </Route>
                  </Route>
                </Routes>
              </LeaveProvider>
            </AttendanceProvider>
          </EmployeesProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
