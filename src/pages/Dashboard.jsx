import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../store/useSettings'
import { DateRangeFilter } from '../features/dashboard'
import DraggableWidget from '../features/dashboard/components/DraggableWidget'
import { DASHBOARD_WIDGET_CATALOG } from '../features/dashboard/widgets'

const SPAN_CLASSES = {
  full: 'basis-full',
  third: 'basis-full sm:basis-[calc(50%-10px)] lg:basis-[calc(33.333%-14px)]',
}

export default function Dashboard() {
  const { settings, toggleDashboardWidget, reorderDashboardWidgets, resizeDashboardWidget } = useSettings()
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const visibleWidgets = settings.dashboard.widgets.filter((widget) => widget.enabled)

  function handleDrop(targetIndex) {
    if (dragIndex !== null && dragIndex !== targetIndex) {
      reorderDashboardWidgets(dragIndex, targetIndex)
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-text-h">Dashboard</h1>
        <DateRangeFilter />
      </div>

      {visibleWidgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm font-medium text-text-h">No widgets enabled</p>
          <p className="text-xs text-text-muted">
            Turn some back on from{' '}
            <Link to="/dashboard/settings" className="text-accent hover:underline">
              Settings
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-5">
          {visibleWidgets.map((widget, index) => {
            const definition = DASHBOARD_WIDGET_CATALOG[widget.id]
            if (!definition) return null

            return (
              <DraggableWidget
                key={widget.id}
                label={definition.label}
                width={widget.width}
                height={widget.height}
                onResize={(size) => resizeDashboardWidget(widget.id, size)}
                isDragging={dragIndex === index}
                isDragOver={dragOverIndex === index && dragIndex !== index}
                onDragStart={() => setDragIndex(index)}
                onDragEnter={() => setDragOverIndex(index)}
                onDragLeave={() => setDragOverIndex((prev) => (prev === index ? null : prev))}
                onDrop={() => handleDrop(index)}
                onDragEnd={() => {
                  setDragIndex(null)
                  setDragOverIndex(null)
                }}
                onMoveUp={() => reorderDashboardWidgets(index, index - 1)}
                onMoveDown={() => reorderDashboardWidgets(index, index + 1)}
                canMoveUp={index > 0}
                canMoveDown={index < visibleWidgets.length - 1}
                onRemove={() => toggleDashboardWidget(widget.id)}
                className={`shrink-0 ${SPAN_CLASSES[definition.span] ?? SPAN_CLASSES.third}`}
              >
                {definition.render()}
              </DraggableWidget>
            )
          })}
        </div>
      )}
    </div>
  )
}
