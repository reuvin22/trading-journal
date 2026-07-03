import Card, { CardTitle } from '../components/ui/Card'
import ToggleSwitch from '../components/ui/ToggleSwitch'
import { useSettings } from '../store/useSettings'
import { DASHBOARD_WIDGET_CATALOG } from '../features/dashboard/widgets'

export default function Settings() {
  const { settings, toggleDashboardWidget } = useSettings()

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold text-text-h">Settings</h1>

      <Card className="max-w-xl">
        <CardTitle>Dashboard widgets</CardTitle>
        <p className="mb-4 text-sm text-text-muted">
          Choose what shows up on the Dashboard. Reorder or remove widgets directly from the
          Dashboard page — drag the grip handle, or use the arrow/close buttons.
        </p>
        <div className="flex flex-col divide-y divide-border">
          {settings.dashboard.widgets.map((widget) => {
            const definition = DASHBOARD_WIDGET_CATALOG[widget.id]
            if (!definition) return null

            return (
              <div key={widget.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <span className="text-sm text-text-h">{definition.label}</span>
                <ToggleSwitch
                  checked={widget.enabled}
                  onChange={() => toggleDashboardWidget(widget.id)}
                  label={`Toggle ${definition.label} widget`}
                />
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
