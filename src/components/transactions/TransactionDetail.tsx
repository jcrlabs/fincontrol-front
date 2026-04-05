import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTransaction, useVoidTransaction } from '@/hooks/useTransactions'
import { MoneyDisplay } from '@/components/common/MoneyDisplay'
import { Badge } from '@/components/common/Badge'
import { TableSkeleton } from '@/components/common/Skeleton'
import { Modal } from '@/components/common/Modal'
import { formatDate } from '@/utils/dates'

export function TransactionDetail() {
  const { id = '' } = useParams()
  const { data: tx, isLoading } = useTransaction(id)
  const voidTx = useVoidTransaction()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading) return <TableSkeleton rows={4} cols={4} />
  if (!tx) return <p className="text-gray-500">Transacción no encontrada</p>

  const handleVoid = async () => {
    try {
      await voidTx.mutateAsync(tx.id)
      toast.success('Transacción anulada')
      setConfirmOpen(false)
    } catch {
      toast.error('Error al anular la transacción')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link to="/transactions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Transacciones
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1">{tx.description}</h1>
        {tx.is_reversal ? (
          <Badge variant="red">Anulada</Badge>
        ) : (
          <Badge variant="green">Activa</Badge>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Fecha</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatDate(tx.date)}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Categoría</p>
            <p className="font-medium text-gray-900 dark:text-white">{tx.category_name ?? '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Creado</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatDate(tx.created_at)}</p>
          </div>
          {tx.reversed_entry_id && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Reversa de</p>
              <Link
                to={`/transactions/${tx.reversed_entry_id}`}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ver original
              </Link>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Líneas del asiento</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {['Cuenta', 'Importe', 'Tipo', 'Moneda'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {tx.entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <Link
                      to={`/accounts/${entry.account_id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {entry.account_name ?? entry.account_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <MoneyDisplay amount={Math.abs(entry.amount)} currency={entry.currency} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={entry.amount > 0 ? 'blue' : 'amber'}>
                      {entry.amount > 0 ? 'Débito' : 'Crédito'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {entry.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!tx.is_reversal && (
        <div className="flex justify-end">
          <button
            onClick={() => setConfirmOpen(true)}
            className="px-4 py-2 border border-red-300 text-red-600 dark:border-red-700 dark:text-red-400 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Anular transacción
          </button>
        </div>
      )}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirmar anulación">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Se creará una entrada inversa que cancela el efecto de esta transacción. Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmOpen(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleVoid}
            disabled={voidTx.isPending}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm rounded-md"
          >
            {voidTx.isPending ? 'Anulando...' : 'Anular'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
