import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduledApi } from '@/api/scheduled'
import type { CreateScheduledInput, UpdateScheduledInput } from '@/types/scheduled'

export function useScheduled() {
  return useQuery({
    queryKey: ['scheduled'],
    queryFn: scheduledApi.list,
  })
}

export function useCreateScheduled() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateScheduledInput) => scheduledApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduled'] }),
  })
}

export function useUpdateScheduled() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateScheduledInput }) =>
      scheduledApi.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduled'] }),
  })
}

export function useDeleteScheduled() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => scheduledApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduled'] }),
  })
}
