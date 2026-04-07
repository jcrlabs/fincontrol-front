export interface ColumnMapping {
  skip_rows: number
  date_col: number
  description_col: number
  amount_col: number
  currency_col: number
  date_format: string
  default_currency: string
}

export interface ImportRow {
  date: string
  description: string
  amount: string
  currency: string
  hash: string
}

export interface ImportPreview {
  total_rows: number
  suggested_mapping: ColumnMapping
  rows: ImportRow[]
}

export interface ImportResult {
  imported: number
  duplicates: number
  errors: string[]
}

export interface ConfirmImportInput {
  rows: ImportRow[]
  debit_account_id: string
  credit_account_id: string
  category_id?: string
}
