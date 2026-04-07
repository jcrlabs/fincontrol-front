export interface Budget {
  id: string
  user_id: string
  category_id: string
  category_name?: string
  month: string // ISO date (first day of month)
  amount: number
  alert_threshold_pct: number
  spent?: number
  percentage?: number
}

export interface CreateBudgetInput {
  category_id: string
  month: string
  amount: number
  alert_threshold_pct?: number
}

export interface UpdateBudgetInput {
  amount: number
}
