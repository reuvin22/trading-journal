import Card, { CardTitle } from '../../../components/ui/Card'

export default function BarListCard({ title, items }) {
  return (
    <Card className="flex h-full flex-col">
      <CardTitle>{title}</CardTitle>
      <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
        {items.map((item) => (
          <li key={item.label} className="grid grid-cols-[84px_1fr_36px] items-center gap-2.5 text-[13px]">
            <span className="truncate text-text-muted">{item.label}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <span className="block h-full rounded-full bg-accent" style={{ width: `${item.value}%` }} />
            </span>
            <span className="text-right font-mono text-xs text-text-h">{item.value}%</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
