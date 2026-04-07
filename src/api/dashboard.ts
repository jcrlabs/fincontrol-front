import { api } from './client'
import type { DateRange } from '@/types/common'
import type { Budget } from '@/types/budget'
import type { JournalEntry } from '@/types/transaction'
import type { Account } from '@/types/account'
import type { PnLPeriod } from '@/types/report'

export interface DashboardData {
  pnl: PnLPeriod
  accounts: Account[]
  recent_transactions: JournalEntry[]
  budget_alerts: Budget[]
}

export const dashboardApi = {
  get: async (range: DateRange): Promise<DashboardData> => {
    const { data } = await api.get<DashboardData>('/dashboard', {
      params: { from: range.from, to: range.to },
    })
    return data
  },
}
