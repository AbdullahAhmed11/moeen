import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { initialAttendance } from '../data/fingerprints'
import { softDeleteById } from '../utils/softDelete'
import type { AttendanceInput, AttendanceRecord } from '../types/fingerprint'
import { buildAttendanceRecord, findNearestLocation } from '../utils/attendance'

type AttendanceContextValue = {
  records: AttendanceRecord[]
  addRecord: (input: AttendanceInput) => AttendanceRecord
  updateRecord: (id: number, input: AttendanceInput) => void
  deleteRecord: (id: number) => void
  mobileCheckIn: (
    employeeId: number,
    employeeName: string,
    employeeNameAr: string,
  ) => Promise<AttendanceRecord>
  mobileCheckOut: (recordId: number) => Promise<AttendanceRecord | null>
  getEmployeeRecords: (employeeId: number) => AttendanceRecord[]
}

const AttendanceContext = createContext<AttendanceContextValue | null>(null)

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

function getCurrentTimestamp() {
  return new Date().toISOString()
}

async function resolveLocation() {
  if (!navigator.geolocation) {
    return findNearestLocation(24.7136, 46.6753)
  }

  return new Promise<ReturnType<typeof findNearestLocation>>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(
          findNearestLocation(position.coords.latitude, position.coords.longitude),
        )
      },
      () => resolve(findNearestLocation(24.7136, 46.6753)),
      { timeout: 5000 },
    )
  })
}

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialAttendance)

  const addRecord = useCallback((input: AttendanceInput) => {
    const newRecord = buildAttendanceRecord(Date.now(), input)
    setRecords((prev) => [newRecord, ...prev])
    return newRecord
  }, [])

  const updateRecord = useCallback((id: number, input: AttendanceInput) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? buildAttendanceRecord(id, input, record.isDeleted)
          : record,
      ),
    )
  }, [])

  const deleteRecord = useCallback((id: number) => {
    setRecords((prev) => softDeleteById(prev, id))
  }, [])

  const mobileCheckIn = useCallback(
    async (employeeId: number, employeeName: string, employeeNameAr: string) => {
      const location = await resolveLocation()
      const today = getTodayDate()
      const existing = records.find(
        (record) =>
          !record.isDeleted &&
          record.employeeId === employeeId &&
          record.date === today,
      )

      if (existing) {
        return existing
      }

      const input: AttendanceInput = {
        employeeId,
        employeeName,
        employeeNameAr,
        date: today,
        checkIn: getCurrentTimestamp(),
        checkInMethod: 'mobile',
        checkInLocation: location,
        checkOut: null,
        checkOutMethod: null,
        checkOutLocation: null,
      }

      const newRecord = buildAttendanceRecord(Date.now(), input)
      setRecords((prev) => [newRecord, ...prev])
      return newRecord
    },
    [records],
  )

  const mobileCheckOut = useCallback(async (recordId: number) => {
    const location = await resolveLocation()
    let updated: AttendanceRecord | null = null

    setRecords((prev) =>
      prev.map((record) => {
        if (record.id !== recordId || record.checkOut) return record
        updated = buildAttendanceRecord(record.id, {
          ...record,
          checkOut: getCurrentTimestamp(),
          checkOutMethod: 'mobile',
          checkOutLocation: location,
        }, record.isDeleted)
        return updated
      }),
    )

    return updated
  }, [])

  const getEmployeeRecords = useCallback(
    (employeeId: number) =>
      records.filter((record) => record.employeeId === employeeId && !record.isDeleted),
    [records],
  )

  const value = useMemo(
    () => ({
      records,
      addRecord,
      updateRecord,
      deleteRecord,
      mobileCheckIn,
      mobileCheckOut,
      getEmployeeRecords,
    }),
    [
      records,
      addRecord,
      updateRecord,
      deleteRecord,
      mobileCheckIn,
      mobileCheckOut,
      getEmployeeRecords,
    ],
  )

  return (
    <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>
  )
}

export function useAttendance() {
  const context = useContext(AttendanceContext)
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider')
  }
  return context
}
