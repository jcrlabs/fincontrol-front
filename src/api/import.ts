import { api } from './client'
import type { ImportPreview, ImportResult, ConfirmImportInput } from '@/types/import'

export const importApi = {
  preview: async (file: File): Promise<ImportPreview> => {
    const form = new FormData()
    form.append('file', file)
    // Do NOT set Content-Type manually — browser must set it with the correct boundary.
    const { data } = await api.post<ImportPreview>('/import/preview', form)
    return data
  },

  confirm: async (input: ConfirmImportInput): Promise<ImportResult> => {
    const { data } = await api.post<ImportResult>('/import/confirm', input)
    return data
  },
}
