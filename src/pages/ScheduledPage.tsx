import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useScheduled, useCreateScheduled, useUpdateScheduled, useDeleteScheduled } from '@/hooks/useScheduled'
import { Modal } from '@/components/common/Modal'
import { Badge } from '@/components/common/Badge'
import { TableSkeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { formatDate } from '@/utils/dates'
import type { ScheduledTransaction, Frequency } from '@/types/scheduled'

const FREQUENCIES: Frequency[] = ['daily', 'weekly', 'monthly', 'yearly']

const schema = z.object({
  description: z.string().min(1, 'Requerido'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  next_run: z.string().min(1, 'Requerido'),
})
type FormData = z.infer<typeof schema>

function ScheduledForm({ item, onSuccess }: { item?: ScheduledTransaction; onSuccess: () => void }) {
  const { t } = useTranslation()
  const create = useCreateScheduled()
  const update = useUpdateScheduled()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { description: item?.description ?? '', frequency: item?.frequency ?? 'monthly', next_run: item?.next_run?.slice(0, 10) ?? '' },
  })
  const onSubmit = async (data: FormData) => {
    try {
      if (item) {
        await update.mutateAsync({ id: item.id, input: { frequency: data.frequency, next_run: data.next_run } })
        toast.success(t('scheduled.updated'))
      } else {
        await create.mutateAsync({ description: data.description, frequency: data.frequency, next_run: data.next_run, template_entries: [] })
        toast.success(t('scheduled.created'))
      }
      onSuccess()
    } catch { toast.error(t('scheduled.saveError')) }
  }
  const inputClass = 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('scheduled.description')}</label>
        <input {...register('description')} disabled={!!item} className={`${inputClass} disabled:opacity-60`} />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('scheduled.frequency')}</label>
        <select {...register('frequency')} className={inputClass}>
          {FREQUENCIES.map((f) => <option key={f} value={f}>{t(`scheduled.${f}`)}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('scheduled.nextRun')}</label>
        <input type="date" {...register('next_run')} className={inputClass} />
        {errors.next_run && <p className="mt-1 text-xs text-red-600">{errors.next_run.message}</p>}
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-md">
          {isSubmitting ? t('common.saving') : item ? t('common.update') : t('common.create')}
        </button>
      </div>
    </form>
  )
}

export function ScheduledPage() {
  const { t } = useTranslation()
  const { data: items, isLoading } = useScheduled()
  const deleteScheduled = useDeleteScheduled()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<ScheduledTransaction | null>(null)

  const handleDelete = async (id: string) => {
    try { await deleteScheduled.mutateAsync(id); toast.success(t('scheduled.deleted')) }
    catch { toast.error(t('scheduled.deleteError')) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('scheduled.title')}</h1>
        <button onClick={() => setCreating(true)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">{t('scheduled.new')}</button>
      </div>

      {isLoading ? <TableSkeleton rows={4} cols={4} /> : !items?.length ? (
        <EmptyState title={t('scheduled.empty')} description={t('scheduled.emptyDesc')}
          action={<button onClick={() => setCreating(true)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">{t('scheduled.newButton')}</button>} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {[t('scheduled.description'), t('scheduled.frequency'), t('scheduled.nextRun'), t('scheduled.statusHeader'), ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.description}</td>
                  <td className="px-4 py-3"><Badge variant="blue">{t(`scheduled.${item.frequency}`)}</Badge></td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatDate(item.next_run)}</td>
                  <td className="px-4 py-3"><Badge variant={item.active ? 'green' : 'gray'}>{item.active ? t('scheduled.active') : t('scheduled.paused')}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(item)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mr-3">{t('scheduled.edit')}</button>
                    <button onClick={() => handleDelete(item.id)} className="text-sm text-red-600 dark:text-red-400 hover:underline">{t('scheduled.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title={t('scheduled.newModal')}>
        <ScheduledForm onSuccess={() => setCreating(false)} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('scheduled.editModal')}>
        {editing && <ScheduledForm item={editing} onSuccess={() => setEditing(null)} />}
      </Modal>
    </div>
  )
}
