import { useState } from 'react'
import ConfirmModal from '../../../components/ui/ConfirmModal'
import { describeRecurrence } from '../recurrence'

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-8 0v12a2 2 0 002 2h4a2 2 0 002-2V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function TodoCard({ todo, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-surface p-4 shadow-card">
      {todo.imageUrl && (
        <img
          src={todo.imageUrl}
          alt=""
          className="size-20 shrink-0 rounded-md border border-border object-cover"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-h">{todo.title}</h3>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex shrink-0 cursor-pointer text-text-muted hover:text-accent"
            aria-label={`Delete ${todo.title}`}
          >
            <TrashIcon />
          </button>
        </div>
        {todo.content && (
          <div
            className="line-clamp-2 text-sm text-text-muted [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: todo.content }}
          />
        )}
        <span className="text-xs text-text-muted">{describeRecurrence(todo.recurrence)}</span>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => onDelete(todo.id)}
        title="Delete to-do"
        description={`Delete "${todo.title}"? This can't be undone.`}
        confirmLabel="Delete"
        tone="danger"
      />
    </div>
  )
}
