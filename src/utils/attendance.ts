import type { AttendanceInput, AttendanceLocation } from '../types/fingerprint'
import { calcWorkHoursMinutes } from './workHours'

export const OFFICE_LOCATIONS: AttendanceLocation[] = [
  { name: 'Main Office', nameAr: 'المكتب الرئيسي', latitude: 24.7136, longitude: 46.6753 },
  { name: 'North Branch', nameAr: 'فرع الشمال', latitude: 24.7743, longitude: 46.7386 },
  { name: 'Field Site', nameAr: 'موقع ميداني', latitude: 24.6877, longitude: 46.7219 },
]

export function buildAttendanceRecord(id: number, input: AttendanceInput, isDeleted = false) {
  return {
    id,
    ...input,
    workHoursMinutes: calcWorkHoursMinutes(input.checkIn, input.checkOut),
    isDeleted,
  }
}

export function findNearestLocation(latitude: number, longitude: number): AttendanceLocation {
  let nearest = OFFICE_LOCATIONS[0]
  let minDistance = Number.POSITIVE_INFINITY

  for (const location of OFFICE_LOCATIONS) {
    const distance =
      (location.latitude - latitude) ** 2 + (location.longitude - longitude) ** 2
    if (distance < minDistance) {
      minDistance = distance
      nearest = location
    }
  }

  return {
    ...nearest,
    latitude,
    longitude,
  }
}

export function formatCoordinates(location: AttendanceLocation | null, isArabic: boolean) {
  if (!location) return '—'
  const label = isArabic ? location.nameAr : location.name
  return `${label} (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`
}
