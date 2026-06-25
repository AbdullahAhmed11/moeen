import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useTheme } from '../ThemeProvider'
import { departmentDistribution } from '../../data/dashboard'
import { CHART_COLORS, getChartTheme } from '../../utils/chartTheme'
import { ALL_FILTER } from '../../utils/filters'
import { ChartCard } from './ChartCard'

export function DepartmentChart({ departmentFilter = ALL_FILTER }: { departmentFilter?: string }) {
  const { t, i18n } = useTranslation()
  const { isDark } = useTheme()
  const theme = getChartTheme(isDark)
  const isArabic = i18n.language === 'ar'

  const source = useMemo(() => {
    if (departmentFilter === ALL_FILTER) return departmentDistribution
    return departmentDistribution.filter((item) => item.nameKey === departmentFilter)
  }, [departmentFilter])

  const data = source.map((item) => ({
    name: isArabic ? item.nameAr : item.name,
    value: item.value,
  }))

  return (
    <ChartCard title={t('dashboard.charts.departmentsTitle')}>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
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
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: '11px', color: theme.axis, paddingLeft: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
