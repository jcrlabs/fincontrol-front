import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'
import { useCashFlow } from '@/hooks/useReports'
import { TableSkeleton } from '@/components/common/Skeleton'
import { formatMoney } from '@/utils/money'
import { formatMonth } from '@/utils/dates'
import { useUIStore } from '@/store/uiStore'

export function CashFlow() {
  const { data, isLoading } = useCashFlow()
  const currency = useUIStore((s) => s.currency)

  if (isLoading) return <TableSkeleton rows={5} cols={4} />

  const chartData = data?.periods?.map((p) => ({
    month: formatMonth(p.month),
    net: p.net,
    inflow: p.inflow,
    outflow: -p.outflow,
  })) ?? []

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Flujo de caja neto por mes
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false}
              tickFormatter={(v: number) => formatMoney(v, currency)} width={80} />
            <Tooltip formatter={(v: number) => formatMoney(v, currency)} />
            <Bar dataKey="net" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.net >= 0 ? '#16a34a' : '#dc2626'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['Mes', 'Entradas', 'Salidas', 'Neto'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data?.periods?.map((p) => (
              <tr key={p.month} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{formatMonth(p.month)}</td>
                <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 tabular-nums">{formatMoney(p.inflow, currency)}</td>
                <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400 tabular-nums">{formatMoney(p.outflow, currency)}</td>
                <td className={`px-4 py-3 text-sm font-medium tabular-nums ${p.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatMoney(p.net, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
