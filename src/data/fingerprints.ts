import type { AttendanceLocation, AttendanceRecord } from '../types/fingerprint'
import { withSoftDeleteDefaults } from '../utils/softDelete'
import { OFFICE_LOCATIONS } from '../utils/attendance'
import { calcWorkHoursMinutes } from '../utils/workHours'

const mainOffice = OFFICE_LOCATIONS[0]
const northBranch = OFFICE_LOCATIONS[1]
const fieldSite = OFFICE_LOCATIONS[2]

function record(
  id: number,
  employeeId: number,
  employeeName: string,
  employeeNameAr: string,
  date: string,
  checkIn: string,
  checkInMethod: AttendanceRecord['checkInMethod'],
  checkInLocation: AttendanceLocation | null,
  checkOut: string | null,
  checkOutMethod: AttendanceRecord['checkOutMethod'],
  checkOutLocation: AttendanceLocation | null,
): Omit<AttendanceRecord, 'isDeleted'> {
  return {
    id,
    employeeId,
    employeeName,
    employeeNameAr,
    date,
    checkIn,
    checkInMethod,
    checkInLocation,
    checkOut,
    checkOutMethod,
    checkOutLocation,
    workHoursMinutes: calcWorkHoursMinutes(checkIn, checkOut),
  }
}

export const initialAttendance = withSoftDeleteDefaults<AttendanceRecord>([
  record(1, 1, 'Ahmed Hassan', 'أحمد حسن', '2026-06-07', '2026-06-07T08:02:00', 'finger', mainOffice, '2026-06-07T17:01:00', 'face', mainOffice),
  record(2, 2, 'Fatima Mahmoud', 'فاطمة محمود', '2026-06-07', '2026-06-07T08:05:00', 'face', mainOffice, '2026-06-07T17:05:00', 'finger', mainOffice),
  record(3, 3, 'Mohammed Ali', 'محمد علي', '2026-06-07', '2026-06-07T08:11:00', 'finger', northBranch, '2026-06-07T16:58:00', 'finger', northBranch),
  record(4, 4, 'Noura Ibrahim', 'نورة إبراهيم', '2026-06-07', '2026-06-07T08:15:00', 'face', mainOffice, '2026-06-07T17:30:00', 'face', mainOffice),
  record(5, 5, 'Khalid Mostafa', 'خالد مصطفى', '2026-06-07', '2026-06-07T08:22:00', 'mobile', fieldSite, '2026-06-07T16:45:00', 'mobile', fieldSite),
  record(6, 6, 'Sara Youssef', 'سارة يوسف', '2026-06-07', '2026-06-07T08:30:00', 'face', mainOffice, '2026-06-07T17:10:00', 'face', mainOffice),
  record(7, 7, 'Omar Farouk', 'عمر فاروق', '2026-06-07', '2026-06-07T08:35:00', 'finger', mainOffice, null, null, null),
  record(8, 8, 'Layla Abdelrahman', 'ليلى عبدالرحمن', '2026-06-07', '2026-06-07T08:40:00', 'mobile', northBranch, '2026-06-07T17:20:00', 'finger', northBranch),
  record(9, 9, 'Youssef Kamal', 'يوسف كمال', '2026-06-06', '2026-06-06T08:10:00', 'finger', fieldSite, '2026-06-06T16:50:00', 'face', fieldSite),
  record(10, 10, 'Hana Sherif', 'هناء شريف', '2026-06-06', '2026-06-06T08:18:00', 'face', mainOffice, '2026-06-06T17:05:00', 'face', mainOffice),
  record(11, 11, 'Tarek Nabil', 'طارق نبيل', '2026-06-06', '2026-06-06T08:25:00', 'finger', northBranch, '2026-06-06T16:40:00', 'finger', northBranch),
  record(12, 12, 'Mariam Adel', 'مريم عادل', '2026-06-06', '2026-06-06T08:32:00', 'mobile', mainOffice, '2026-06-06T17:15:00', 'mobile', mainOffice),
])