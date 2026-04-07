import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getMonthRange } from '@/utils/dates'
import type { DateRange } from '@/types/common'

type PeriodPreset = 'month' | 'quarter' | 'year' | 'custom'

interface UIState {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  darkMode: boolean
  currency: string
  periodPreset: PeriodPreset
  dateRange: DateRange

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
  toggleDarkMode: () => void
  setCurrency: (currency: string) => void
  setPeriodPreset: (preset: PeriodPreset) => void
  setDateRange: (range: DateRange) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      darkMode: false,
      currency: 'EUR',
      periodPreset: 'month',
      dateRange: getMonthRange(new Date()),

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setCurrency: (currency) => set({ currency }),
      setPeriodPreset: (periodPreset) => set({ periodPreset }),
      setDateRange: (dateRange) => set({ dateRange }),
    }),
    {
      name: 'fincontrol-ui',
      partialize: (state) => ({
        darkMode: state.darkMode,
        currency: state.currency,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
)
