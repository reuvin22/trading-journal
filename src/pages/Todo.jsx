import { useState } from 'react'
import Card, { CardTitle } from '../components/ui/Card'
import { useToast } from '../components/ui/useToast'
import { TodoForm, TodoList } from '../features/todo'

export default function Todo() {
  const { showToast } = useToast()
  const [todos, setTodos] = useState([])

  function handleAdd(todo) {
    setTodos((prev) => [todo, ...prev])
  }

  function handleDelete(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
    showToast('To-do deleted.', { tone: 'default' })
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold text-text-h">To Do</h1>

      <div className="flex flex-col gap-5 lg:flex-row">
        <Card className="w-full lg:max-w-sm">
          <CardTitle>New to-do</CardTitle>
          <TodoForm onAdd={handleAdd} />
        </Card>

        <div className="min-w-0 flex-1">
          <TodoList todos={todos} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  )
}
