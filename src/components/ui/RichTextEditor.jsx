import { useEffect, useRef } from 'react'

function BoldIcon() {
  return <span className="text-sm font-bold">B</span>
}

function ItalicIcon() {
  return <span className="font-serif text-sm italic">I</span>
}

function BulletListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="4" cy="6" r="1.5" fill="currentColor" />
      <path d="M9 6h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" />
      <path d="M9 12h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" />
      <path d="M9 18h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function NumberedListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <text x="1.5" y="8" fontSize="6" fill="currentColor" stroke="none">1</text>
      <path d="M9 6h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <text x="1.5" y="14" fontSize="6" fill="currentColor" stroke="none">2</text>
      <path d="M9 12h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <text x="1.5" y="20" fontSize="6" fill="currentColor" stroke="none">3</text>
      <path d="M9 18h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function AlignLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h10M4 18h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function AlignCenterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M4 6h16M7 12h10M5.5 18h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function AlignRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M4 6h16M10 12h10M7 18h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const TOOLBAR_GROUPS = [
  [
    { command: 'bold', label: 'Bold', Icon: BoldIcon },
    { command: 'italic', label: 'Italic', Icon: ItalicIcon },
  ],
  [
    { command: 'insertUnorderedList', label: 'Bullet list', Icon: BulletListIcon },
    { command: 'insertOrderedList', label: 'Numbered list', Icon: NumberedListIcon },
  ],
  [
    { command: 'justifyLeft', label: 'Align left', Icon: AlignLeftIcon },
    { command: 'justifyCenter', label: 'Align center', Icon: AlignCenterIcon },
    { command: 'justifyRight', label: 'Align right', Icon: AlignRightIcon },
  ],
]

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
}

export default function RichTextEditor({ value = '', onChange, placeholder }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  function handleInput(e) {
    onChange?.(e.currentTarget.innerHTML)
  }

  function runCommand(command) {
    document.execCommand(command, false, undefined)
    if (editorRef.current) onChange?.(editorRef.current.innerHTML)
  }

  const isEmpty = !stripHtml(value).trim()

  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface-2">
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5">
        {TOOLBAR_GROUPS.map((group, groupIndex) => (
          <div key={group.map((item) => item.command).join('-')} className="flex items-center gap-0.5">
            {groupIndex > 0 && <span className="mx-1 h-5 w-px bg-border" />}
            {group.map(({ command, label, Icon }) => (
              <button
                key={command}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => runCommand(command)}
                aria-label={label}
                title={label}
                className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface hover:text-text-h"
              >
                <Icon />
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="relative">
        {isEmpty && placeholder && (
          <span className="pointer-events-none absolute top-2.5 left-3 text-sm text-text-muted">
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          suppressContentEditableWarning
          className="min-h-24 px-3 py-2.5 text-sm text-text-h outline-none [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
        />
      </div>
    </div>
  )
}
