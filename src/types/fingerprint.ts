export type FingerprintMethod = 'finger' | 'face' | 'mobile'

export type AttendanceLocation = {
  name: string
  nameAr: string
  latitude: number
  longitude: number
}

export type AttendanceRecord = {
  id: number
  employeeId: number
  employeeName: string
  employeeNameAr: string
  date: string
  checkIn: string
  checkInMethod: FingerprintMethod
  checkInLocation: AttendanceLocation | null
  checkOut: string | null
  checkOutMethod: FingerprintMethod | null
  checkOutLocation: AttendanceLocation | null
  workHoursMinutes: number
  isDeleted: boolean
}

export type AttendanceInput = Omit<AttendanceRecord, 'id' | 'workHoursMinutes' | 'isDeleted'>
