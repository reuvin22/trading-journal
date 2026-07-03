import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import ProfileMenu from '../components/common/ProfileMenu'
import ThemeToggle from '../components/common/ThemeToggle'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end gap-3 border-b border-border px-6 py-3.5">
          <ThemeToggle />
          <ProfileMenu />
        </header>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
