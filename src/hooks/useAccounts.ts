import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { keepPreviousData } from '@tanstack/react-query'
import { accountsApi } from '@/api/accounts'
import type { CreateAccountInput, UpdateAccountInput } from '@/types/account'

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.list,
    placeholderData: keepPreviousData,
  })
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountsApi.get(id),
    enabled: !!id,
  })
}

export function useAccountEntries(id: string, page = 1, perPage = 20) {
  return useQuery({
    queryKey: ['accounts', id, 'entries', page],
    queryFn: () => accountsApi.listEntries(id, page, perPage),
    enabled: !!id,
    placeholderData: keepPreviousData,
  })
}

export function useCreateAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAccountInput) => accountsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  })
}

export function useUpdateAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAccountInput }) =>
      accountsApi.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  })
}
