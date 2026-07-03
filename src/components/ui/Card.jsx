export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-5 shadow-card ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children }) {
  return (
    <h3 className="mb-4 text-xs font-semibold tracking-wide text-text-h uppercase">{children}</h3>
  )
}
