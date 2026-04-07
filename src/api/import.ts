import { api } from './client'
import { useAuthStore } from '@/store/authStore'
import type { ImportPreview, ImportResult, ConfirmImportInput } from '@/types/import'

const apiBase = () => import.meta.env.VITE_API_URL ?? '/api/v1'

export const importApi = {
  // Use native fetch for multipart upload — Axios instance has a default
  // Content-Type: application/json that overrides the multipart boundary,
  // breaking file uploads on all devices.
  preview: async (file: File): Promise<ImportPreview> => {
    const form = new FormData()
    form.append('file', file)
    const token = useAuthStore.getState().accessToken
    const res = await fetch(`${apiBase()}/import/preview`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
    }
    return res.json()
  },

  confirm: async (input: ConfirmImportInput): Promise<ImportResult> => {
    const { data } = await api.post<ImportResult>('/import/confirm', input)
    return data
  },
}
