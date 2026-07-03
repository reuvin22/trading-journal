import Card, { CardTitle } from '../../../components/ui/Card'

const WIN_RATE = 63
const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function WinrateChart() {
  const offset = CIRCUMFERENCE * (1 - WIN_RATE / 100)

  return (
    <Card className="flex h-full flex-col">
      <CardTitle>Winrate</CardTitle>
      <div className="relative mt-1 mb-4 flex justify-center">
        <svg viewBox="0 0 140 140" width="140" height="140">
          <circle
            cx="70"
            cy="70"
            r={RADIUS}
            className="stroke-surface-2"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="70"
            cy="70"
            r={RADIUS}
            className="stroke-accent transition-[stroke-dashoffset] duration-300"
            strokeWidth="10"
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold text-text-h">{WIN_RATE}%</span>
          <span className="mt-0.5 text-[11px] text-text-muted">Win rate</span>
        </div>
      </div>
      <div className="flex justify-center gap-4 text-xs text-text-muted">
        <span className="flex items-center">
          <i className="mr-1.5 inline-block size-2 rounded-full bg-accent" /> Wins
        </span>
        <span className="flex items-center">
          <i className="mr-1.5 inline-block size-2 rounded-full bg-text-muted" /> Losses
        </span>
      </div>
    </Card>
  )
}
