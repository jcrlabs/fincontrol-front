import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { usePnL } from '@/hooks/useReports'
import { TableSkeleton } from '@/components/common/Skeleton'
import { formatMoney } from '@/utils/money'
import { formatMonth } from '@/utils/dates'
import { useUIStore } from '@/store/uiStore'

export function ProfitAndLoss() {
  const { data, isLoading } = usePnL()
  const currency = useUIStore((s) => s.currency)

  if (isLoading) return <TableSkeleton rows={6} cols={4} />

  const chartData = data?.periods.map((p) => ({
    month: formatMonth(p.month),
    Ingresos: p.income,
    Gastos: p.expenses,
    Resultado: p.net,
  })) ?? []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Ingresos totales', value: data?.total_income ?? 0, color: 'text-green-600 dark:text-green-400' },
          { label: 'Gastos totales', value: -(data?.total_expenses ?? 0), color: 'text-red-600 dark:text-red-400' },
          { label: 'Resultado neto', value: data?.total_net ?? 0, color: (data?.total_net ?? 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{kpi.label}</p>
            <span className={`text-xl font-bold ${kpi.color}`}>
              {formatMoney(kpi.value, currency)}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false}
              tickFormatter={(v: number) => formatMoney(v, currency)} width={80} />
            <Tooltip formatter={(v: number) => formatMoney(v, currency)} />
            <Legend />
            <Bar dataKey="Ingresos" fill="#16a34a" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Gastos" fill="#dc2626" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['Mes', 'Ingresos', 'Gastos', 'Resultado'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data?.periods.map((p) => (
              <tr key={p.month} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{formatMonth(p.month)}</td>
                <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 tabular-nums">{formatMoney(p.income, currency)}</td>
                <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400 tabular-nums">{formatMoney(p.expenses, currency)}</td>
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
