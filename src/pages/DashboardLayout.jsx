import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import ProfileMenu from '../components/common/ProfileMenu'
import ThemeToggle from '../components/common/ThemeToggle'

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-svh">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-2 hover:text-text-h lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
