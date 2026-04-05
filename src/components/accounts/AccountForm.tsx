import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useCreateAccount, useUpdateAccount } from '@/hooks/useAccounts'
import type { Account } from '@/types/account'

const ACCOUNT_TYPES = ['asset', 'liability', 'equity', 'income', 'expense'] as const
const CURRENCIES = ['EUR', 'USD', 'GBP']

const schema = z.object({
  name: z.string().min(1, 'Requerido').max(100),
  type: z.enum(ACCOUNT_TYPES),
  currency: z.string().min(3).max(3),
  initial_balance: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface AccountFormProps {
  account?: Account
  onSuccess: () => void
}

export function AccountForm({ account, onSuccess }: AccountFormProps) {
  const createAccount = useCreateAccount()
  const updateAccount = useUpdateAccount()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: account
      ? { name: account.name, type: account.type, currency: account.currency }
      : { type: 'asset', currency: 'EUR' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (account) {
        await updateAccount.mutateAsync({ id: account.id, input: { name: data.name } })
        toast.success('Cuenta actualizada')
      } else {
        await createAccount.mutateAsync({
          name: data.name,
          type: data.type,
          currency: data.currency,
          initial_balance: data.initial_balance ? parseFloat(data.initial_balance) : undefined,
        })
        toast.success('Cuenta creada')
      }
      onSuccess()
    } catch {
      toast.error('Error al guardar la cuenta')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre
        </label>
        <input
          {...register('name')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      {!account && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Moneda
            </label>
            <select
              {...register('currency')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Balance inicial (opcional)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('initial_balance')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
        >
          {isSubmitting ? 'Guardando...' : account ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
