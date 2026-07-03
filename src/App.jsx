import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import DashboardLayout from './pages/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Trades from './pages/Trades'
import Calendar from './pages/Calendar'
import Journal from './pages/Journal'
import Todo from './pages/Todo'
import Profile from './pages/Profile'
import Billing from './pages/Billing'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="trades" element={<Trades />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="journal" element={<Journal />} />
        <Route path="todo" element={<Todo />} />
        <Route path="profile" element={<Profile />} />
        <Route path="billing" element={<Billing />} />
      </Route>
    </Routes>
  )
}

export default App
