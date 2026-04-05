import { DateRangePicker } from '@/components/common/DateRangePicker'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { IncomeExpenseCard } from '@/components/dashboard/IncomeExpenseCard'
import { BurnRateCard } from '@/components/dashboard/BurnRateCard'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown'
import { AccountsList } from '@/components/dashboard/AccountsList'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { BudgetAlerts } from '@/components/dashboard/BudgetAlerts'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <DateRangePicker />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BalanceCard />
        <IncomeExpenseCard />
        <BurnRateCard />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart />
        <CategoryBreakdown />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AccountsList />
        <RecentTransactions />
        <BudgetAlerts />
      </div>
    </div>
  )
}
