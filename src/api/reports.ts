import { api } from './client'
import type { ProfitAndLoss, BalanceSheet, CashFlow, CategoryReport } from '@/types/report'
import type { DateRange } from '@/types/common'

export const reportsApi = {
  pnl: async (range: DateRange, currency?: string): Promise<ProfitAndLoss> => {
    const { data } = await api.get<ProfitAndLoss>('/reports/pnl', {
      params: { from: range.from, to: range.to, currency },
    })
    return data
  },

  balanceSheet: async (range: DateRange, currency?: string): Promise<BalanceSheet> => {
    const { data } = await api.get<BalanceSheet>('/reports/balance-sheet', {
      params: { from: range.from, to: range.to, currency },
    })
    return data
  },

  cashFlow: async (range: DateRange, currency?: string): Promise<CashFlow> => {
    const { data } = await api.get<CashFlow>('/reports/cash-flow', {
      params: { from: range.from, to: range.to, currency },
    })
    return data
  },

  categories: async (range: DateRange, currency?: string): Promise<CategoryReport> => {
    const { data } = await api.get<CategoryReport>('/reports/categories', {
      params: { from: range.from, to: range.to, currency },
    })
    return data
  },
}
