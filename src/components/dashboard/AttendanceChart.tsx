import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../ThemeProvider'
import { weeklyAttendance } from '../../data/dashboard'
import { getChartTheme } from '../../utils/chartTheme'
import { isWithinDateRange } from '../../utils/dateRange'
import { ChartCard } from './ChartCard'

export function AttendanceChart({
  fromDate = '',
  toDate = '',
}: {
  fromDate?: string
  toDate?: string
}) {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const theme = getChartTheme(isDark)

  const data = useMemo(
    () =>
      weeklyAttendance
        .filter((item) => isWithinDateRange(item.date, fromDate, toDate))
        .map((item) => ({
          day: t(`dashboard.charts.days.${item.dayKey}`),
          present: item.present,
          absent: item.absent,
        })),
    [t, fromDate, toDate],
  )

  return (
    <ChartCard title={t('dashboard.charts.attendance')}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={4} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
          <XAxis dataKey="day" tick={{ fill: theme.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: theme.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.tooltipBorder}`,
              borderRadius: '12px',
              color: theme.tooltipText,
              fontSize: '13px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: theme.axis }}
            formatter={(value) =>
              value === 'present' ? t('dashboard.charts.attendancePresent') : t('dashboard.charts.attendanceAbsent')
            }
          />
          <Bar
            dataKey="present"
            name="present"
            fill="#6366f1"
            radius={[6, 6, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="absent"
            name="absent"
            fill="#f43f5e"
            radius={[6, 6, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
