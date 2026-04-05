import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { importApi } from '@/api/import'
import { useAccounts } from '@/hooks/useAccounts'
import { CategorySelect } from '@/components/categories/CategorySelect'
import { formatDate } from '@/utils/dates'
import type { ImportPreview, ImportResult, ImportRow } from '@/types/import'

type Step = 'upload' | 'preview' | 'confirm' | 'result'

export function ImportPage() {
  const [step, setStep] = useState<Step>('upload')
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [debitId, setDebitId] = useState('')
  const [creditId, setCreditId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const fileRef = useRef<HTMLInputElement>(null)
  const { data: accounts = [] } = useAccounts()

  const handleFile = async (file: File) => {
    setLoading(true)
    try {
      const data = await importApi.preview(file)
      setPreview(data)
      setSelectedRows(new Set(data.rows.map((r) => r.hash)))
      setStep('preview')
    } catch {
      toast.error('Error al procesar el archivo')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const toggleRow = (hash: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(hash)) next.delete(hash)
      else next.add(hash)
      return next
    })
  }

  const handleConfirm = async () => {
    if (!debitId || !creditId) { toast.error('Selecciona las cuentas'); return }
    if (debitId === creditId) { toast.error('Las cuentas deben ser distintas'); return }
    const rows: ImportRow[] = (preview?.rows ?? []).filter((r) => selectedRows.has(r.hash))
    setLoading(true)
    try {
      const res = await importApi.confirm({
        rows, debit_account_id: debitId, credit_account_id: creditId,
        category_id: categoryId || undefined,
      })
      setResult(res)
      setStep('result')
    } catch {
      toast.error('Error al importar')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setStep('upload'); setPreview(null); setResult(null)
    setDebitId(''); setCreditId(''); setCategoryId('')
    setSelectedRows(new Set())
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Importar CSV / OFX</h1>

      {/* Stepper */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        {(['upload', 'preview', 'confirm', 'result'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-medium text-xs ${step === s ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>{i + 1}</span>
            <span className={step === s ? 'text-gray-900 dark:text-white font-medium' : ''}>
              {s === 'upload' ? 'Archivo' : s === 'preview' ? 'Preview' : s === 'confirm' ? 'Confirmar' : 'Resultado'}
            </span>
            {i < 3 && <span>›</span>}
          </div>
        ))}
      </div>

      {/* Upload */}
      {step === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
        >
          <div className="text-4xl mb-3 text-gray-300 dark:text-gray-600">📥</div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Arrastra un archivo o haz clic</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">CSV, OFX, QFX</p>
          <input ref={fileRef} type="file" accept=".csv,.ofx,.qfx" className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
          {loading && <p className="mt-4 text-sm text-blue-600 dark:text-blue-400">Procesando...</p>}
        </div>
      )}

      {/* Preview */}
      {step === 'preview' && preview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {preview.total_rows} filas detectadas — {selectedRows.size} seleccionadas
            </p>
            <div className="flex gap-2">
              <button onClick={() => setSelectedRows(new Set(preview.rows.map((r) => r.hash)))} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Seleccionar todo</button>
              <button onClick={() => setSelectedRows(new Set())} className="text-xs text-gray-500 hover:underline">Ninguno</button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  {['', 'Fecha', 'Descripción', 'Importe', 'Moneda'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {preview.rows.map((row) => (
                  <tr key={row.hash} className={selectedRows.has(row.hash) ? '' : 'opacity-40'}>
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={selectedRows.has(row.hash)} onChange={() => toggleRow(row.hash)} className="rounded" />
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{formatDate(row.date)}</td>
                    <td className="px-3 py-2 text-gray-900 dark:text-white max-w-xs truncate">{row.description}</td>
                    <td className="px-3 py-2 tabular-nums text-gray-900 dark:text-white">{row.amount}</td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{row.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between">
            <button onClick={reset} className="text-sm text-gray-500 hover:underline">← Volver</button>
            <button onClick={() => setStep('confirm')} disabled={selectedRows.size === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-md">
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* Confirm */}
      {step === 'confirm' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Se importarán <strong>{selectedRows.size}</strong> transacciones. Asigna las cuentas contables:
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cuenta débito (gasto/activo)</label>
              <select value={debitId} onChange={(e) => setDebitId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">— Selecciona —</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.type})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cuenta crédito (pago)</label>
              <select value={creditId} onChange={(e) => setCreditId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">— Selecciona —</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.type})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría (opcional)</label>
              <CategorySelect value={categoryId} onChange={setCategoryId} className="w-full" />
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep('preview')} className="text-sm text-gray-500 hover:underline">← Volver</button>
            <button onClick={handleConfirm} disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-md">
              {loading ? 'Importando...' : 'Importar'}
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {step === 'result' && result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4 text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{result.imported}</p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">Importadas</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 p-4 text-center">
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{result.duplicates}</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Duplicadas</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-4 text-center">
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{result.errors.length}</p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">Errores</p>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-4">
              <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Errores:</p>
              <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={reset} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              Nueva importación
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
