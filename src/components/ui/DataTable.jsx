import { useMemo, useState } from 'react'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function alignClass(align) {
  if (align === 'right') return 'text-right'
  if (align === 'center') return 'text-center'
  return 'text-left'
}

export default function DataTable({
  columns,
  data,
  searchable = false,
  searchKeys,
  searchPlaceholder = 'Search...',
  actions,
  actionsHeader = '',
  onRowClick,
  pageSize,
  getRowKey,
  emptyMessage = 'No results found.',
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return data

    const term = searchTerm.trim().toLowerCase()
    const keys = searchKeys ?? columns.map((column) => column.key)

    return data.filter((row) =>
      keys.some((key) => String(row[key] ?? '').toLowerCase().includes(term)),
    )
  }, [data, searchable, searchTerm, searchKeys, columns])

  const totalPages = pageSize ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1
  const currentPage = Math.min(page, totalPages)
  const pageRows = pageSize
    ? filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filtered

  function handleSearchChange(e) {
    setSearchTerm(e.target.value)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      {searchable && (
        <div className="relative w-full max-w-xs">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-border bg-surface-2 py-2 pr-3 pl-9 text-sm text-text-h outline-none transition-colors placeholder:text-text-muted focus:border-accent-border"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`border-b border-border px-3 pb-2.5 text-[11px] font-medium tracking-wide text-text-muted uppercase ${alignClass(column.align)}`}
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="border-b border-border px-3 pb-2.5 text-right text-[11px] font-medium tracking-wide text-text-muted uppercase">
                  {actionsHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-3 py-6 text-center text-sm text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row, index) => (
                <tr
                  key={getRowKey ? getRowKey(row, index) : (row.id ?? index)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`transition-colors hover:bg-surface-2 ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`border-b border-border px-3 py-3 text-text ${alignClass(column.align)}`}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td
                      className="border-b border-border px-3 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageSize && filtered.length > 0 && (
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-2 hover:text-text-h disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Previous page"
            >
              <ChevronLeftIcon />
            </button>
            <span className="px-1 text-text">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-2 hover:text-text-h disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Next page"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
