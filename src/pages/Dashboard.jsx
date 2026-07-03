import { BarListCard, DateRangeFilter, TradesTable, WinrateChart } from '../features/dashboard'

const EMOTIONS = [
  { label: 'Confident', value: 42 },
  { label: 'Anxious', value: 25 },
  { label: 'Greedy', value: 18 },
  { label: 'Fearful', value: 15 },
]

const STRATEGIES = [
  { label: 'Breakout', value: 71 },
  { label: 'Trend Pullback', value: 64 },
  { label: 'Range Reversal', value: 52 },
  { label: 'News Fade', value: 38 },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-h">Dashboard</h1>
        <DateRangeFilter />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <BarListCard title="Emotions" items={EMOTIONS} />
        <BarListCard title="Strategy" items={STRATEGIES} />
        <WinrateChart />
      </div>

      <TradesTable />
    </div>
  )
}
