import type { EntryInput } from './transaction'

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface ScheduledTransaction {
  id: string
  user_id: string
  description: string
  frequency: Frequency
  next_run: string
  active: boolean
  template_entries: EntryInput[]
  category_id?: string
  created_at: string
}

export interface CreateScheduledInput {
  description: string
  frequency: Frequency
  next_run: string
  template_entries: EntryInput[]
  category_id?: string
}

export interface UpdateScheduledInput {
  frequency?: Frequency
  next_run?: string
  active?: boolean
}
