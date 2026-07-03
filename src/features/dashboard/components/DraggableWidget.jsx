import { useRef } from 'react'

function GripIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="1.4" fill="currentColor" />
      <circle cx="9" cy="12" r="1.4" fill="currentColor" />
      <circle cx="9" cy="18" r="1.4" fill="currentColor" />
      <circle cx="15" cy="6" r="1.4" fill="currentColor" />
      <circle cx="15" cy="12" r="1.4" fill="currentColor" />
      <circle cx="15" cy="18" r="1.4" fill="currentColor" />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

const controlButtonClass =
  'inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-2 hover:text-text-h disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent'

const RESIZE_HANDLE_HIT_AREA = 20

export default function DraggableWidget({
  label,
  width,
  height,
  isDragging,
  isDragOver,
  onDragStart,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragEnd,
  onResize,
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
  className = '',
  children,
}) {
  const boxRef = useRef(null)
  const resizeArmed = useRef(false)

  function handleMouseDown(e) {
    const el = boxRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const nearRightEdge = rect.right - e.clientX < RESIZE_HANDLE_HIT_AREA
    const nearBottomEdge = rect.bottom - e.clientY < RESIZE_HANDLE_HIT_AREA
    resizeArmed.current = nearRightEdge && nearBottomEdge
  }

  function handleMouseUp() {
    if (!resizeArmed.current) return
    resizeArmed.current = false
    const el = boxRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    onResize?.({ width: Math.round(rect.width), height: Math.round(rect.height) })
  }

  return (
    <div
      ref={boxRef}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ width: width || undefined, height: height || undefined }}
      className={`flex min-h-[160px] min-w-[240px] max-w-full resize flex-col gap-2 overflow-auto rounded-xl transition-opacity ${
        isDragging ? 'opacity-40' : ''
      } ${isDragOver ? 'outline-2 outline-dashed outline-accent-border' : ''} ${className}`}
    >
      <div className="flex shrink-0 items-center justify-between gap-2">
        <span
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className="inline-flex cursor-grab items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium text-text-muted select-none hover:bg-surface-2 hover:text-text-h active:cursor-grabbing"
        >
          <GripIcon />
          {label}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className={controlButtonClass}
            aria-label={`Move ${label} earlier`}
          >
            <ArrowUpIcon />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className={controlButtonClass}
            aria-label={`Move ${label} later`}
          >
            <ArrowDownIcon />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className={controlButtonClass}
            aria-label={`Remove ${label}`}
          >
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}
