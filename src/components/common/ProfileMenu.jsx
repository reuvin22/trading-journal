import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4.5 20a7.5 7.5 0 0115 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function ProfileMenu() {
  const [open, setOpen] = useState(false)
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

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="inline-flex size-[34px] cursor-pointer items-center justify-center rounded-full border border-border bg-surface-2 text-text-muted transition-colors hover:border-accent-border hover:text-accent"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open profile menu"
        aria-expanded={open}
      >
        <UserIcon />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 z-10 flex min-w-[170px] flex-col gap-0.5 rounded-xl border border-border bg-surface p-1.5 shadow-card">
          <Link
            to="/dashboard/profile"
            className="block rounded-md px-2.5 py-2 text-sm text-text no-underline hover:bg-surface-2 hover:text-text-h"
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <Link
            to="/dashboard/billing"
            className="block rounded-md px-2.5 py-2 text-sm text-text no-underline hover:bg-surface-2 hover:text-text-h"
            onClick={() => setOpen(false)}
          >
            Billing
          </Link>
        </div>
      )}
    </div>
  )
}
