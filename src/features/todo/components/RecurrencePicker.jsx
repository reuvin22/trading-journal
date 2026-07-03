import { useState } from 'react'
import { getCalendarDays, isSameDay, startOfDay } from '../../../lib/date'
import {
  MONTH_DAYS,
  WEEKDAY_OPTIONS,
  describeRecurrence,
  toggleDate,
  toggleInList,
} from '../recurrence'

const RECURRENCE_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

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

export default function RecurrencePicker({ value, onChange }) {
  const today = startOfDay(new Date())
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const days = getCalendarDays(viewDate.getFullYear(), viewDate.getMonth())
  const isCurrentMonth =
    viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth()

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex w-fit rounded-full bg-surface-2 p-1 text-sm">
        {RECURRENCE_TYPES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange({ ...value, type: option.value })}
            className={`cursor-pointer rounded-full px-3 py-1.5 font-medium transition-colors ${
              value.type === option.value ? 'bg-surface text-text-h shadow-card' : 'text-text-muted'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {value.type === 'weekly' && (
        <div className="flex flex-wrap gap-2">
          {WEEKDAY_OPTIONS.map((option) => {
            const selected = value.weekdays.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...value, weekdays: toggleInList(value.weekdays, option.value) })}
                className={`size-9 cursor-pointer rounded-full text-sm font-medium transition-colors ${
                  selected ? 'bg-accent text-[#06110b]' : 'bg-surface-2 text-text-muted hover:bg-surface'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}

      {value.type === 'monthly' && (
        <div className="grid grid-cols-7 gap-2">
          {MONTH_DAYS.map((day) => {
            const selected = value.monthDays.includes(day)
            return (
              <button
                key={day}
                type="button"
                onClick={() => onChange({ ...value, monthDays: toggleInList(value.monthDays, day) })}
                className={`size-8 cursor-pointer rounded-full text-xs font-medium transition-colors ${
                  selected ? 'bg-accent text-[#06110b]' : 'bg-surface-2 text-text-muted hover:bg-surface'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      )}

      {value.type === 'manual' && (
        <div className="rounded-lg border border-border p-3">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              disabled={isCurrentMonth}
              className={`inline-flex size-6 items-center justify-center rounded-md text-text-muted ${
                isCurrentMonth ? 'cursor-not-allowed opacity-30' : 'cursor-pointer hover:bg-surface-2 hover:text-text-h'
              }`}
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
            {WEEKDAY_OPTIONS.map((option) => (
              <span key={option.value}>{option.label}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
            {days.map((day) => {
              const outsideMonth = day.getMonth() !== viewDate.getMonth()
              const selected = value.dates.some((d) => isSameDay(d, day))
              const isPast = day < today

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={isPast}
                  onClick={() => onChange({ ...value, dates: toggleDate(value.dates, day) })}
                  className={[
                    'mx-auto flex size-8 items-center justify-center rounded-full',
                    isPast
                      ? 'cursor-not-allowed text-text-muted/30'
                      : [
                          'cursor-pointer',
                          selected
                            ? 'bg-accent font-semibold text-[#06110b]'
                            : outsideMonth
                              ? 'text-text-muted/40 hover:bg-surface-2'
                              : 'text-text hover:bg-surface-2',
                        ].join(' '),
                  ].join(' ')}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-text-muted">{describeRecurrence(value)}</p>
    </div>
  )
}
