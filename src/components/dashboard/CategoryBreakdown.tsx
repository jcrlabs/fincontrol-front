import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useCategoryReport } from '@/hooks/useReports'
import { formatMoney } from '@/utils/money'
import { Skeleton } from '@/components/common/Skeleton'
import { useUIStore } from '@/store/uiStore'

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#0891b2', '#be185d', '#65a30d']

export function CategoryBreakdown() {
  const { data, isLoading } = useCategoryReport()
  const currency = useUIStore((s) => s.currency)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (isLoading) return <Skeleton className="h-64 w-full" />

  const chartData = data?.categories?.map((c) => ({
    name: c.name,
    value: c.total,
    percentage: c.percentage,
  })) ?? []

  if (!chartData.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">Sin datos de categorías</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Gasto por categoría
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number) => formatMoney(v, currency)}
          />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-gray-700 dark:text-gray-300">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
