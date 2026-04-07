export type AccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense'

export interface Account {
  id: string
  user_id: string
  name: string
  type: AccountType
  currency: string
  is_active: boolean
  balance: number
  created_at: string
}

export interface CreateAccountInput {
  name: string
  type: AccountType
  currency: string
  initial_balance?: number
}

export interface UpdateAccountInput {
  name: string
}
