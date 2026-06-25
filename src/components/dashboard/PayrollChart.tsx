import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../ThemeProvider'
import { monthlyPayroll } from '../../data/dashboard'
import { getChartTheme } from '../../utils/chartTheme'
import { isMonthInRange } from '../../utils/dateRange'
import { ALL_FILTER } from '../../utils/filters'
import { ChartCard } from './ChartCard'

function formatPayroll(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function PayrollChart({
  periodFilter = ALL_FILTER,
  fromDate = '',
  toDate = '',
}: {
  periodFilter?: string
  fromDate?: string
  toDate?: string
}) {
  const { t, i18n } = useTranslation()
  const { isDark } = useTheme()
  const theme = getChartTheme(isDark)

  const source = useMemo(() => {
    let items = monthlyPayroll.filter((item) => isMonthInRange(item.month, fromDate, toDate))
    if (periodFilter === '3m') items = items.slice(-3)
    else if (periodFilter === '6m') items = items.slice(-6)
    return items
  }, [periodFilter, fromDate, toDate])

  const data = source.map((item) => ({
    month: t(`dashboard.charts.months.${item.monthKey}`),
    amount: item.amount,
  }))

  return (
    <ChartCard title={t('dashboard.charts.payroll')}>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="payrollGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: theme.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: theme.axis, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatPayroll(value, i18n.language)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.tooltipBorder}`,
              borderRadius: '12px',
              color: theme.tooltipText,
              fontSize: '13px',
            }}
            formatter={(value) => [
              new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-EG' : 'en-EG', {
                style: 'currency',
                currency: 'EGP',
                maximumFractionDigits: 0,
              }).format(Number(value)),
              t('dashboard.charts.payroll'),
            ]}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#payrollGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
