import { useState } from 'react'
import { ReportDateSelector } from '@/components/reports/ReportDateSelector'
import { ProfitAndLoss } from '@/components/reports/ProfitAndLoss'
import { BalanceSheet } from '@/components/reports/BalanceSheet'
import { CashFlow } from '@/components/reports/CashFlow'
import { CategoryReport } from '@/components/reports/CategoryReport'

const TABS = [
  { id: 'pnl', label: 'P&L' },
  { id: 'balance', label: 'Balance Sheet' },
  { id: 'cashflow', label: 'Cash Flow' },
  { id: 'categories', label: 'Categorías' },
] as const

type TabId = typeof TABS[number]['id']

export function ReportsPage() {
  const [tab, setTab] = useState<TabId>('pnl')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Informes</h1>
        <ReportDateSelector />
      </div>

      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === 'pnl' && <ProfitAndLoss />}
        {tab === 'balance' && <BalanceSheet />}
        {tab === 'cashflow' && <CashFlow />}
        {tab === 'categories' && <CategoryReport />}
      </div>
    </div>
  )
}
