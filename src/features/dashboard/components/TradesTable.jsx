import { useState } from 'react'
import Badge from '../../../components/ui/Badge'
import Card, { CardTitle } from '../../../components/ui/Card'
import DataTable from '../../../components/ui/DataTable'
import Modal from '../../../components/ui/Modal'

const TRADES = [
  { date: 'Jun 28', pair: 'EUR/USD', direction: 'Long', result: 'Win', pnl: '+$320.00' },
  { date: 'Jun 27', pair: 'GBP/JPY', direction: 'Short', result: 'Win', pnl: '+$185.50' },
  { date: 'Jun 26', pair: 'USD/CHF', direction: 'Long', result: 'Loss', pnl: '-$96.00' },
  { date: 'Jun 24', pair: 'AUD/USD', direction: 'Short', result: 'Win', pnl: '+$142.75' },
  { date: 'Jun 23', pair: 'USD/JPY', direction: 'Long', result: 'Loss', pnl: '-$60.20' },
  { date: 'Jun 21', pair: 'NZD/USD', direction: 'Long', result: 'Win', pnl: '+$88.40' },
  { date: 'Jun 20', pair: 'EUR/GBP', direction: 'Short', result: 'Loss', pnl: '-$44.10' },
  { date: 'Jun 19', pair: 'USD/CAD', direction: 'Long', result: 'Win', pnl: '+$210.00' },
]

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DetailField({ label, children }) {
  return (
    <div>
      <p className="mb-1 text-xs tracking-wide text-text-muted uppercase">{label}</p>
      <div className="text-sm font-medium text-text-h">{children}</div>
    </div>
  )
}

const COLUMNS = [
  { key: 'date', header: 'Date' },
  { key: 'pair', header: 'Pair' },
  {
    key: 'direction',
    header: 'Direction',
    render: (row) => <Badge tone={row.direction === 'Long' ? 'positive' : 'neutral'}>{row.direction}</Badge>,
  },
  {
    key: 'result',
    header: 'Result',
    render: (row) => <Badge tone={row.result === 'Win' ? 'positive' : 'neutral'}>{row.result}</Badge>,
  },
  {
    key: 'pnl',
    header: 'P&L',
    align: 'right',
    render: (row) => (
      <span className={`font-mono ${row.pnl.startsWith('+') ? 'text-accent' : 'text-text-muted'}`}>
        {row.pnl}
      </span>
    ),
  },
]

export default function TradesTable() {
  const [selectedTrade, setSelectedTrade] = useState(null)

  return (
    <Card className="h-full">
      <CardTitle>Recent trades</CardTitle>
      <DataTable
        columns={COLUMNS}
        data={TRADES}
        searchable
        searchKeys={['pair', 'direction', 'result']}
        searchPlaceholder="Search trades..."
        pageSize={5}
        onRowClick={(row) => setSelectedTrade(row)}
        actions={(row) => (
          <button
            type="button"
            onClick={() => setSelectedTrade(row)}
            className="inline-flex cursor-pointer text-text-muted hover:text-accent"
            aria-label={`View ${row.pair} trade details`}
          >
            <ChevronRightIcon />
          </button>
        )}
      />

      {selectedTrade && (
        <Modal open={Boolean(selectedTrade)} onClose={() => setSelectedTrade(null)} title="Trade details">
          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Date">{selectedTrade.date}</DetailField>
            <DetailField label="Pair">{selectedTrade.pair}</DetailField>
            <DetailField label="Direction">
              <Badge tone={selectedTrade.direction === 'Long' ? 'positive' : 'neutral'}>
                {selectedTrade.direction}
              </Badge>
            </DetailField>
            <DetailField label="Result">
              <Badge tone={selectedTrade.result === 'Win' ? 'positive' : 'neutral'}>
                {selectedTrade.result}
              </Badge>
            </DetailField>
            <DetailField label="P&L">
              <span className={`font-mono ${selectedTrade.pnl.startsWith('+') ? 'text-accent' : 'text-text-muted'}`}>
                {selectedTrade.pnl}
              </span>
            </DetailField>
          </div>
        </Modal>
      )}
    </Card>
  )
}
