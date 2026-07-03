import TodoCard from './TodoCard'

export default function TodoList({ todos, onDelete }) {
  if (!todos.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border px-6 py-12 text-center">
        <p className="text-sm font-medium text-text-h">No to-dos yet</p>
        <p className="text-xs text-text-muted">Add your first one using the form.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} onDelete={onDelete} />
      ))}
    </div>
  )
}
