import { useCallback, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ToastContext } from './toast-context'

const TONE_CLASSES = {
  default: 'border-border',
  success: 'border-accent-border',
  error: 'border-red-500/40',
}

const TONE_DOT = {
  default: 'bg-text-muted',
  success: 'bg-accent',
  error: 'bg-red-500',
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function createId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    (message, { tone = 'default', duration = 4000 } = {}) => {
      const id = createId()
      setToasts((prev) => [...prev, { id, message, tone }])
      if (duration) {
        const timer = setTimeout(() => dismissToast(id), duration)
        timers.current.set(id, timer)
      }
      return id
    },
    [dismissToast],
  )

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-80">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="status"
              className={`flex items-start gap-2.5 rounded-lg border bg-surface px-3.5 py-3 text-sm text-text-h shadow-card ${
                TONE_CLASSES[toast.tone] ?? TONE_CLASSES.default
              }`}
            >
              <span
                className={`mt-1.5 size-1.5 shrink-0 rounded-full ${TONE_DOT[toast.tone] ?? TONE_DOT.default}`}
              />
              <span className="flex-1">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="inline-flex shrink-0 cursor-pointer text-text-muted hover:text-text-h"
                aria-label="Dismiss notification"
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}
