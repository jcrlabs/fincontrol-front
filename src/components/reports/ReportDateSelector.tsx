import { DateRangePicker } from '@/components/common/DateRangePicker'

export function ReportDateSelector() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500 dark:text-gray-400">Período:</span>
      <DateRangePicker />
    </div>
  )
}
