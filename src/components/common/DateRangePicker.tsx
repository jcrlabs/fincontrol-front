import { useUIStore } from '@/store/uiStore'
import { getMonthRange, getQuarterRange, getYearRange } from '@/utils/dates'

const PRESETS = [
  { label: 'Este mes', value: 'month' },
  { label: 'Trimestre', value: 'quarter' },
  { label: 'Este año', value: 'year' },
] as const

export function DateRangePicker() {
  const { periodPreset, dateRange, setPeriodPreset, setDateRange } = useUIStore()

  const selectPreset = (preset: 'month' | 'quarter' | 'year') => {
    const now = new Date()
    const range =
      preset === 'month' ? getMonthRange(now)
      : preset === 'quarter' ? getQuarterRange(now)
      : getYearRange(now)
    setPeriodPreset(preset)
    setDateRange(range)
  }

  return (
    <div className="flex items-center gap-2">
      {PRESETS.map((p) => (
        <button
          key={p.value}
          onClick={() => selectPreset(p.value)}
          className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
            periodPreset === p.value
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {p.label}
        </button>
      ))}
      <div className="flex items-center gap-1 ml-1">
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => { setPeriodPreset('custom'); setDateRange({ ...dateRange, from: e.target.value }) }}
          className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-400">—</span>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => { setPeriodPreset('custom'); setDateRange({ ...dateRange, to: e.target.value }) }}
          className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}
