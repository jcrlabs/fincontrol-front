import {
  format,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from 'date-fns'
import { es } from 'date-fns/locale'
import type { DateRange } from '@/types/common'

export function formatDate(date: string | Date, pattern = 'dd/MM/yyyy'): string {
  return format(new Date(date), pattern, { locale: es })
}

export function formatMonth(date: string | Date): string {
  return format(new Date(date), 'MMMM yyyy', { locale: es })
}

export function getMonthRange(date: Date): DateRange {
  return {
    from: format(startOfMonth(date), 'yyyy-MM-dd'),
    to: format(endOfMonth(date), 'yyyy-MM-dd'),
  }
}

export function getQuarterRange(date: Date): DateRange {
  return {
    from: format(startOfQuarter(date), 'yyyy-MM-dd'),
    to: format(endOfQuarter(date), 'yyyy-MM-dd'),
  }
}

export function getYearRange(date: Date): DateRange {
  return {
    from: format(startOfYear(date), 'yyyy-MM-dd'),
    to: format(endOfYear(date), 'yyyy-MM-dd'),
  }
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}
