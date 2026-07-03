import { useEffect, useRef, useState } from 'react'
import RichTextEditor from '../../../components/ui/RichTextEditor'
import { useToast } from '../../../components/ui/useToast'
import { createEmptyRecurrence } from '../recurrence'
import RecurrencePicker from './RecurrencePicker'

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function createId() {
  return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function TodoForm({ onAdd }) {
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [recurrence, setRecurrence] = useState(createEmptyRecurrence)
  const [titleError, setTitleError] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  function handleRemoveImage() {
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!title.trim()) {
      setTitleError(true)
      return
    }

    onAdd({
      id: createId(),
      title: title.trim(),
      content: content.trim(),
      imageUrl: imagePreview,
      recurrence,
      createdAt: new Date(),
    })

    setTitle('')
    setContent('')
    setImagePreview(null)
    setRecurrence(createEmptyRecurrence())
    setTitleError(false)
    if (fileInputRef.current) fileInputRef.current.value = ''

    showToast('To-do added.', { tone: 'success' })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="todo-title" className="text-xs font-medium tracking-wide text-text-muted uppercase">
          Title <span className="text-accent">*</span>
        </label>
        <input
          id="todo-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (titleError) setTitleError(false)
          }}
          placeholder="e.g. Review London session trades"
          className={`rounded-md border bg-surface-2 px-3 py-2.5 text-sm text-text-h outline-none transition-colors placeholder:text-text-muted focus:border-accent-border ${
            titleError ? 'border-red-500/60' : 'border-border'
          }`}
        />
        {titleError && <span className="text-xs text-red-400">Title is required.</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-wide text-text-muted uppercase">Content</span>
        <RichTextEditor value={content} onChange={setContent} placeholder="Notes, checklist, context…" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-wide text-text-muted uppercase">Image</span>
        <input
          ref={fileInputRef}
          id="todo-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {imagePreview ? (
          <div className="relative w-fit">
            <img src={imagePreview} alt="" className="h-28 w-auto rounded-md border border-border object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 inline-flex size-6 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-accent"
              aria-label="Remove image"
            >
              <CloseIcon />
            </button>
          </div>
        ) : (
          <label
            htmlFor="todo-image"
            className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-text-muted hover:border-accent-border hover:text-accent"
          >
            <UploadIcon />
            Click to upload an image
          </label>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-wide text-text-muted uppercase">Date</span>
        <RecurrencePicker value={recurrence} onChange={setRecurrence} />
      </div>

      <button
        type="submit"
        className="mt-1 cursor-pointer rounded-md bg-accent px-3 py-2.5 text-sm font-semibold text-[#06110b] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        Add to-do
      </button>
    </form>
  )
}
