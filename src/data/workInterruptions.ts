import type { WorkInterruption } from '../types/workInterruption'
import { withSoftDeleteDefaults } from '../utils/softDelete'
import { calcInterruptedDays } from '../utils/workInterruption'

function record(
  id: number,
  employeeId: number,
  employeeName: string,
  employeeNameAr: string,
  startDate: string,
  endDate: string,
  interruptionType: WorkInterruption['interruptionType'],
  reason: string,
  reasonAr: string,
  status: WorkInterruption['status'],
): Omit<WorkInterruption, 'isDeleted'> {
  return {
    id,
    employeeId,
    employeeName,
    employeeNameAr,
    startDate,
    endDate,
    interruptedDays: calcInterruptedDays(startDate, endDate),
    interruptionType,
    reason,
    reasonAr,
    status,
  }
}

export const initialWorkInterruptions = withSoftDeleteDefaults<WorkInterruption>([
  record(1, 5, 'Khalid Mostafa', 'خالد مصطفى', '2026-06-05', '2026-06-05', 'absence', 'No show without notice', 'غياب بدون إشعار', 'approved'),
  record(2, 2, 'Fatima Mahmoud', 'فاطمة محمود', '2026-06-03', '2026-06-04', 'leave', 'Personal leave', 'إجازة شخصية', 'approved'),
  record(3, 7, 'Omar Farouk', 'عمر فاروق', '2026-06-01', '2026-06-07', 'sick', 'Medical sick leave', 'إجازة مرضية', 'pending'),
  record(4, 3, 'Mohammed Ali', 'محمد علي', '2026-05-28', '2026-05-28', 'unauthorized', 'Left work early', 'مغادرة العمل مبكراً', 'rejected'),
  record(5, 11, 'Tarek Nabil', 'طارق نبيل', '2026-05-25', '2026-05-26', 'absence', 'Unexcused absence', 'غياب بدون عذر', 'approved'),
  record(6, 6, 'Sara Youssef', 'سارة يوسف', '2026-05-20', '2026-05-22', 'leave', 'Family emergency', 'ظرف عائلي', 'approved'),
  record(7, 9, 'Youssef Kamal', 'يوسف كمال', '2026-05-15', '2026-05-15', 'other', 'Training outside office', 'تدريب خارج المكتب', 'pending'),
  record(8, 1, 'Ahmed Hassan', 'أحمد حسن', '2026-05-10', '2026-05-11', 'sick', 'Flu', 'إصابة بالرشح', 'approved'),
  record(9, 12, 'Mariam Adel', 'مaryam عادل', '2026-05-05', '2026-05-05', 'absence', 'Late and left early', 'تأخر ومغادرة مبكرة', 'pending'),
  record(10, 4, 'Noura Ibrahim', 'نورة إبراهيم', '2026-05-01', '2026-05-03', 'leave', 'Annual leave', 'إجازة سنوية', 'approved'),
])