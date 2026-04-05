import { api } from './client'
import type { ScheduledTransaction, CreateScheduledInput, UpdateScheduledInput } from '@/types/scheduled'

export const scheduledApi = {
  list: async (): Promise<ScheduledTransaction[]> => {
    const { data } = await api.get<ScheduledTransaction[]>('/scheduled')
    return data
  },

  create: async (input: CreateScheduledInput): Promise<ScheduledTransaction> => {
    const { data } = await api.post<ScheduledTransaction>('/scheduled', input)
    return data
  },

  update: async (id: string, input: UpdateScheduledInput): Promise<ScheduledTransaction> => {
    const { data } = await api.put<ScheduledTransaction>(`/scheduled/${id}`, input)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/scheduled/${id}`)
  },
}
