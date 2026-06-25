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
import { leaveRequests } from '../../data/dashboard'
import { getChartTheme } from '../../utils/chartTheme'
import { isMonthInRange } from '../../utils/dateRange'
import { ALL_FILTER } from '../../utils/filters'
import { ChartCard } from './ChartCard'

export function LeaveChart({
  periodFilter = ALL_FILTER,
  fromDate = '',
  toDate = '',
}: {
  periodFilter?: string
  fromDate?: string
  toDate?: string
}) {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const theme = getChartTheme(isDark)

  const source = useMemo(() => {
    let items = leaveRequests.filter((item) => isMonthInRange(item.month, fromDate, toDate))
    if (periodFilter === '3m') items = items.slice(-3)
    return items
  }, [periodFilter, fromDate, toDate])

  const data = source.map((item) => ({
    month: t(`dashboard.charts.months.${item.monthKey}`),
    approved: item.approved,
    pending: item.pending,
    rejected: item.rejected,
  }))

  return (
    <ChartCard title={t('dashboard.charts.leave')}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={2} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: theme.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
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
            formatter={(value) => {
              if (value === 'approved') return t('dashboard.charts.leaveApproved')
              if (value === 'pending') return t('dashboard.charts.leavePending')
              return t('dashboard.charts.leaveRejected')
            }}
          />
          <Bar dataKey="approved" name="approved" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={18} />
          <Bar dataKey="pending" name="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={18} />
          <Bar dataKey="rejected" name="rejected" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
