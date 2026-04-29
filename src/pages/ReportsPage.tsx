import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReportDateSelector } from '@/components/reports/ReportDateSelector'
import { ProfitAndLoss } from '@/components/reports/ProfitAndLoss'
import { BalanceSheet } from '@/components/reports/BalanceSheet'
import { CashFlow } from '@/components/reports/CashFlow'
import { CategoryReport } from '@/components/reports/CategoryReport'

type TabId = 'pnl' | 'balance' | 'cashflow' | 'categories'

export function ReportsPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<TabId>('pnl')

  const TABS = [
    { id: 'pnl' as TabId, label: t('reports.tabPnl') },
    { id: 'balance' as TabId, label: t('reports.tabBalance') },
    { id: 'cashflow' as TabId, label: t('reports.tabCashflow') },
    { id: 'categories' as TabId, label: t('reports.tabCategories') },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('reports.title')}</h1>
        <ReportDateSelector />
      </div>

      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === tb.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tb.label}
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
