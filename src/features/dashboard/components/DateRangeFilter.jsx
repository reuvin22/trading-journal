import { useEffect, useRef, useState } from 'react'
import { addDays, formatShort, getCalendarDays, isSameDay, startOfDay } from '../../../lib/date'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const PRESETS = [
  { label: 'Today', getRange: (today) => [today, today] },
  { label: 'Last 7 days', getRange: (today) => [addDays(today, -6), today] },
  { label: 'Last 30 days', getRange: (today) => [addDays(today, -29), today] },
  {
    label: 'This month',
    getRange: (today) => [new Date(today.getFullYear(), today.getMonth(), 1), today],
  },
]

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDownIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
      className={open ? 'rotate-180' : ''}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function DateRangeFilter() {
  const today = startOfDay(new Date())
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [range, setRange] = useState([addDays(today, -6), today])
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const [start, end] = range
  const days = getCalendarDays(viewDate.getFullYear(), viewDate.getMonth())

  function handleDayClick(day) {
    if (!start || (start && end)) {
      setRange([day, null])
    } else if (day < start) {
      setRange([day, start])
    } else {
      setRange([start, day])
    }
  }

  function applyPreset(preset) {
    setRange(preset.getRange(today))
    setOpen(false)
  }

  function inRange(day) {
    if (!start || !end) return false
    return day > start && day < end
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text hover:border-accent-border"
      >
        <CalendarIcon />
        <span>
          {start ? formatShort(start) : 'Select date'}
          {end && !isSameDay(start, end) ? ` – ${formatShort(end)}` : ''}
        </span>
        <ChevronDownIcon open={open} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 z-20 w-72 rounded-xl border border-border bg-surface p-4 shadow-card">
          <div className="mb-3 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className="cursor-pointer rounded-full bg-surface-2 px-2.5 py-1 text-xs text-text-muted hover:bg-accent-bg hover:text-accent"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-2 hover:text-text-h"
              aria-label="Previous month"
            >
              <ChevronLeftIcon />
            </button>
            <span className="text-sm font-semibold text-text-h">
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-2 hover:text-text-h"
              aria-label="Next month"
            >
              <ChevronRightIcon />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] text-text-muted">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
            {days.map((day) => {
              const outsideMonth = day.getMonth() !== viewDate.getMonth()
              const selected = isSameDay(day, start) || isSameDay(day, end)
              const within = inRange(day)
              const isToday = isSameDay(day, today)

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={[
                    'mx-auto flex size-8 cursor-pointer items-center justify-center rounded-full',
                    outsideMonth ? 'text-text-muted/40' : 'text-text',
                    selected
                      ? 'bg-accent font-semibold text-[#06110b]'
                      : within
                        ? 'bg-accent-bg text-accent'
                        : 'hover:bg-surface-2',
                    isToday && !selected ? 'ring-1 ring-accent-border' : '',
                  ].join(' ')}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
