export interface Entry {
  id: string
  journal_entry_id: string
  account_id: string
  account_name?: string
  amount: number
  currency: string
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  description: string
  date: string
  category_id: string | null
  category_name?: string
  is_reversal: boolean
  reversed_entry_id: string | null
  entries: Entry[]
  created_at: string
}

export interface EntryInput {
  account_id: string
  amount: number
  currency: string
}

export interface CreateTransactionInput {
  date: string
  description: string
  category_id?: string
  entries: EntryInput[]
}

export interface TransactionFilters {
  date_from?: string
  date_to?: string
  account_id?: string
  category_id?: string
  page?: number
  per_page?: number
}

// Form types (amounts as strings to avoid float issues)
export interface EntryFormData {
  account_id: string
  amount: string
  type: 'debit' | 'credit'
}

export interface TransactionFormData {
  date: string
  description: string
  category_id: string
  entries: EntryFormData[]
}
