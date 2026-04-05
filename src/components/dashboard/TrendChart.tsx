import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { usePnL } from '@/hooks/useReports'
import { formatMoney } from '@/utils/money'
import { formatMonth } from '@/utils/dates'
import { Skeleton } from '@/components/common/Skeleton'
import { useUIStore } from '@/store/uiStore'

export function TrendChart() {
  const { data, isLoading } = usePnL()
  const currency = useUIStore((s) => s.currency)

  if (isLoading) return <Skeleton className="h-64 w-full" />

  const chartData = data?.periods.map((p) => ({
    month: formatMonth(p.month),
    income: p.income,
    expenses: p.expenses,
  })) ?? []

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Ingresos vs Gastos
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatMoney(v, currency)}
            width={80}
          />
          <Tooltip
            formatter={(v: number, name: string) => [
              formatMoney(v, currency),
              name === 'income' ? 'Ingresos' : 'Gastos',
            ]}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#16a34a"
            fill="#bbf7d0"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#dc2626"
            fill="#fecaca"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
