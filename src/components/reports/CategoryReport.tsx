import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useCategoryReport } from '@/hooks/useReports'
import { TableSkeleton } from '@/components/common/Skeleton'
import { formatMoney } from '@/utils/money'
import { useUIStore } from '@/store/uiStore'

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#0891b2', '#be185d', '#65a30d']

export function CategoryReport() {
  const { data, isLoading } = useCategoryReport()
  const currency = useUIStore((s) => s.currency)

  if (isLoading) return <TableSkeleton rows={5} cols={3} />

  const chartData = data?.categories.map((c) => ({ name: c.name, value: c.total })) ?? []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" paddingAngle={2}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatMoney(v, currency)} />
              <Legend formatter={(v) => <span className="text-xs text-gray-700 dark:text-gray-300">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {['Categoría', 'Total', '%'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data?.categories.map((c, i) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-900 dark:text-white">{c.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm tabular-nums text-gray-700 dark:text-gray-300">
                    {formatMoney(c.total, currency)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {c.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
