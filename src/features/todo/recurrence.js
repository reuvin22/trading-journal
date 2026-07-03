import { isSameDay } from '../../lib/date'

export const WEEKDAY_OPTIONS = [
  { value: 0, label: 'Su' },
  { value: 1, label: 'Mo' },
  { value: 2, label: 'Tu' },
  { value: 3, label: 'We' },
  { value: 4, label: 'Th' },
  { value: 5, label: 'Fr' },
  { value: 6, label: 'Sa' },
]

export const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

export function createEmptyRecurrence() {
  return { type: 'manual', dates: [], weekdays: [], monthDays: [] }
}

export function toggleInList(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value].sort((a, b) => a - b)
}

export function toggleDate(dates, day) {
  const exists = dates.some((d) => isSameDay(d, day))
  return exists ? dates.filter((d) => !isSameDay(d, day)) : [...dates, day].sort((a, b) => a - b)
}

function ordinal(n) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}`
}

export function describeRecurrence(recurrence) {
  if (recurrence.type === 'weekly') {
    if (!recurrence.weekdays.length) return 'Pick at least one weekday.'
    const labels = recurrence.weekdays.map(
      (value) => WEEKDAY_OPTIONS.find((option) => option.value === value)?.label,
    )
    return `Repeats weekly on ${labels.join(', ')}.`
  }

  if (recurrence.type === 'monthly') {
    if (!recurrence.monthDays.length) return 'Pick at least one day of the month.'
    return `Repeats monthly on the ${recurrence.monthDays.map(ordinal).join(', ')}.`
  }

  if (!recurrence.dates.length) return 'Pick one or more dates.'
  return `${recurrence.dates.length} date${recurrence.dates.length > 1 ? 's' : ''} selected.`
}
