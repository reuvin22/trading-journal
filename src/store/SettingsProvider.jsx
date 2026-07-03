import { useCallback, useEffect, useMemo, useState } from 'react'
import { SettingsContext } from './settings-context'

const STORAGE_KEY = 'settings'

const DEFAULT_SETTINGS = {
  dashboard: {
    widgets: [
      { id: 'emotions', enabled: true, width: null, height: null },
      { id: 'strategy', enabled: true, width: null, height: null },
      { id: 'winrate', enabled: true, width: null, height: null },
      { id: 'trades', enabled: true, width: null, height: null },
    ],
  },
}

function loadInitialSettings() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_SETTINGS
    const parsed = JSON.parse(stored)
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      dashboard: { ...DEFAULT_SETTINGS.dashboard, ...parsed.dashboard },
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadInitialSettings)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const toggleDashboardWidget = useCallback((id) => {
    setSettings((prev) => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        widgets: prev.dashboard.widgets.map((widget) =>
          widget.id === id ? { ...widget, enabled: !widget.enabled } : widget,
        ),
      },
    }))
  }, [])

  const reorderDashboardWidgets = useCallback((fromIndex, toIndex) => {
    setSettings((prev) => {
      const widgets = prev.dashboard.widgets
      const visible = widgets.filter((widget) => widget.enabled)
      const hidden = widgets.filter((widget) => !widget.enabled)

      if (fromIndex < 0 || fromIndex >= visible.length || toIndex < 0 || toIndex >= visible.length) {
        return prev
      }

      const [moved] = visible.splice(fromIndex, 1)
      visible.splice(toIndex, 0, moved)

      return { ...prev, dashboard: { ...prev.dashboard, widgets: [...visible, ...hidden] } }
    })
  }, [])

  const resizeDashboardWidget = useCallback((id, size) => {
    setSettings((prev) => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        widgets: prev.dashboard.widgets.map((widget) =>
          widget.id === id ? { ...widget, ...size } : widget,
        ),
      },
    }))
  }, [])

  const value = useMemo(
    () => ({ settings, toggleDashboardWidget, reorderDashboardWidgets, resizeDashboardWidget }),
    [settings, toggleDashboardWidget, reorderDashboardWidgets, resizeDashboardWidget],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
