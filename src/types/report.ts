export interface PnLPeriod {
  month: string
  income: number
  expenses: number
  net: number
}

export interface ProfitAndLoss {
  periods: PnLPeriod[]
  total_income: number
  total_expenses: number
  total_net: number
}

export interface BalanceSheetAccount {
  id: string
  name: string
  type: string
  balance: number
  currency: string
}

export interface BalanceSheet {
  assets: BalanceSheetAccount[]
  liabilities: BalanceSheetAccount[]
  equity: BalanceSheetAccount[]
  total_assets: number
  total_liabilities: number
  net_worth: number
}

export interface CashFlowPeriod {
  month: string
  inflow: number
  outflow: number
  net: number
}

export interface CashFlow {
  periods: CashFlowPeriod[]
}

export interface CategoryReportItem {
  id: string
  name: string
  total: number
  percentage: number
  children?: CategoryReportItem[]
}

export interface CategoryReport {
  categories: CategoryReportItem[]
  total: number
}
