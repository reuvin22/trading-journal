export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date, amount) {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

export function isSameDay(a, b) {
  return Boolean(a) && Boolean(b) && a.toDateString() === b.toDateString()
}

export function formatShort(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getCalendarDays(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay())
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
}
