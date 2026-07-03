import BarListCard from './components/BarListCard'
import TradesTable from './components/TradesTable'
import WinrateChart from './components/WinrateChart'

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

export const DASHBOARD_WIDGET_CATALOG = {
  emotions: {
    label: 'Emotions',
    span: 'third',
    render: () => <BarListCard title="Emotions" items={EMOTIONS} />,
  },
  strategy: {
    label: 'Strategy',
    span: 'third',
    render: () => <BarListCard title="Strategy" items={STRATEGIES} />,
  },
  winrate: {
    label: 'Winrate',
    span: 'third',
    render: () => <WinrateChart />,
  },
  trades: {
    label: 'Recent trades',
    span: 'full',
    render: () => <TradesTable />,
  },
}
