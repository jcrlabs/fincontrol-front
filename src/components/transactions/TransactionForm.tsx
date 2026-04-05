import { useState } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useCreateTransaction } from '@/hooks/useTransactions'
import { useBalanceCheck } from '@/hooks/useBalanceCheck'
import { useAccounts } from '@/hooks/useAccounts'
import { BalanceIndicator } from './BalanceIndicator'
import { EntryRow } from './EntryRow'
import { CategorySelect } from '@/components/categories/CategorySelect'
import { toISODate } from '@/utils/dates'
import type { TransactionFormData } from '@/types/transaction'

const entrySchema = z.object({
  account_id: z.string().min(1, 'Requerido'),
  amount: z.string().min(1, 'Requerido'),
  type: z.enum(['debit', 'credit']),
})

const schema = z.object({
  date: z.string().min(1, 'Requerido'),
  description: z.string().min(1, 'Requerido').max(500),
  category_id: z.string(),
  entries: z.array(entrySchema).min(2, 'Mínimo 2 líneas'),
})

// ── Quick mode ──────────────────────────────────────────────────────────────

type QuickType = 'expense' | 'income' | 'transfer'

interface QuickFormProps {
  onAdvanced: () => void
  onSuccess: () => void
}

function QuickTransactionForm({ onAdvanced, onSuccess }: QuickFormProps) {
  const { data: accounts = [] } = useAccounts()
  const createTx = useCreateTransaction()

  const [quickType, setQuickType] = useState<QuickType>('expense')
  const [date, setDate] = useState(toISODate(new Date()))
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [payAccountId, setPayAccountId] = useState('')
  const [targetAccountId, setTargetAccountId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!amt || !payAccountId || !description) {
      toast.error('Completa todos los campos requeridos')
      return
    }
    if (quickType === 'transfer' && !targetAccountId) {
      toast.error('Selecciona la cuenta destino')
      return
    }

    let entries
    if (quickType === 'expense') {
      // expense account (debit) + payment account (credit)
      if (!targetAccountId) { toast.error('Selecciona la cuenta de gasto'); return }
      entries = [
        { account_id: targetAccountId, amount: amt, currency: 'EUR' },
        { account_id: payAccountId, amount: -amt, currency: 'EUR' },
      ]
    } else if (quickType === 'income') {
      // payment account (debit) + income account (credit)
      if (!targetAccountId) { toast.error('Selecciona la cuenta de ingreso'); return }
      entries = [
        { account_id: payAccountId, amount: amt, currency: 'EUR' },
        { account_id: targetAccountId, amount: -amt, currency: 'EUR' },
      ]
    } else {
      // transfer: source (credit) → destination (debit)
      entries = [
        { account_id: targetAccountId, amount: amt, currency: 'EUR' },
        { account_id: payAccountId, amount: -amt, currency: 'EUR' },
      ]
    }

    try {
      await createTx.mutateAsync({
        date,
        description,
        category_id: categoryId || undefined,
        entries,
      })
      toast.success('Transacción creada')
      onSuccess()
    } catch {
      toast.error('Error al crear la transacción')
    }
  }

  const labelPay = quickType === 'expense' ? 'Cuenta pago' : quickType === 'income' ? 'Cuenta cobro' : 'Cuenta origen'
  const labelTarget = quickType === 'expense' ? 'Cuenta de gasto' : quickType === 'income' ? 'Cuenta de ingreso' : 'Cuenta destino'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        {(['expense', 'income', 'transfer'] as QuickType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setQuickType(t)}
            className={`flex-1 py-1.5 text-sm rounded-md border transition-colors ${
              quickType === t
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {t === 'expense' ? 'Gasto' : t === 'income' ? 'Ingreso' : 'Transferencia'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{labelPay}</label>
          <select
            value={payAccountId}
            onChange={(e) => setPayAccountId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Selecciona —</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{labelTarget}</label>
          <select
            value={targetAccountId}
            onChange={(e) => setTargetAccountId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Selecciona —</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Monto</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Descripción</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Categoría (opcional)</label>
        <CategorySelect value={categoryId} onChange={setCategoryId} className="w-full" />
      </div>

      <div className="flex justify-between items-center pt-2">
        <button type="button" onClick={onAdvanced} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Modo avanzado ↗
        </button>
        <button
          type="submit"
          disabled={createTx.isPending}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md"
        >
          {createTx.isPending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

// ── Advanced mode ────────────────────────────────────────────────────────────

interface AdvancedFormProps {
  onSimple: () => void
  onSuccess: () => void
}

function AdvancedTransactionForm({ onSimple, onSuccess }: AdvancedFormProps) {
  const createTx = useCreateTransaction()

  const { register, control, handleSubmit, setValue, formState: { errors } } =
    useForm<TransactionFormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        date: toISODate(new Date()),
        description: '',
        category_id: '',
        entries: [
          { account_id: '', amount: '', type: 'debit' },
          { account_id: '', amount: '', type: 'credit' },
        ],
      },
    })

  const { fields, append, remove } = useFieldArray({ control, name: 'entries' })
  const entries = useWatch({ control, name: 'entries' })
  const balance = useBalanceCheck(entries)

  const onSubmit = async (data: TransactionFormData) => {
    if (!balance.isBalanced) {
      toast.error('El asiento debe cuadrar antes de guardar')
      return
    }
    try {
      await createTx.mutateAsync({
        date: data.date,
        description: data.description,
        category_id: data.category_id || undefined,
        entries: data.entries.map((e) => ({
          account_id: e.account_id,
          amount: e.type === 'debit' ? parseFloat(e.amount) : -parseFloat(e.amount),
          currency: 'EUR',
        })),
      })
      toast.success('Transacción creada')
      onSuccess()
    } catch {
      toast.error('Error al crear la transacción')
    }
  }

  const categoryId = useWatch({ control, name: 'category_id' })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha</label>
          <input
            type="date"
            {...register('date')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Categoría</label>
          <CategorySelect
            value={categoryId}
            onChange={(v) => setValue('category_id', v)}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Descripción</label>
        <input
          {...register('description')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Líneas
          </label>
          <button
            type="button"
            onClick={() => append({ account_id: '', amount: '', type: 'debit' })}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Añadir línea
          </button>
        </div>

        {fields.map((field, index) => (
          <EntryRow
            key={field.id}
            index={index}
            register={register}
            setValue={setValue}
            typeValue={entries[index]?.type ?? 'debit'}
            canRemove={fields.length > 2}
            onRemove={() => remove(index)}
          />
        ))}
      </div>

      <BalanceIndicator {...balance} />

      <div className="flex justify-between items-center pt-2">
        <button type="button" onClick={onSimple} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Modo simple
        </button>
        <button
          type="submit"
          disabled={createTx.isPending || !balance.isBalanced}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
          title={!balance.isBalanced ? 'El asiento debe cuadrar' : undefined}
        >
          {createTx.isPending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

// ── Public component ─────────────────────────────────────────────────────────

interface TransactionFormProps {
  onSuccess: () => void
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [advanced, setAdvanced] = useState(false)

  if (advanced) {
    return <AdvancedTransactionForm onSimple={() => setAdvanced(false)} onSuccess={onSuccess} />
  }
  return <QuickTransactionForm onAdvanced={() => setAdvanced(true)} onSuccess={onSuccess} />
}
