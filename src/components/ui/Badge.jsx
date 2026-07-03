export default function Badge({ tone = 'neutral', children }) {
  const toneClasses =
    tone === 'positive' ? 'bg-accent-bg text-accent' : 'bg-red-100 text-red-700'

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${toneClasses}`}>
      {children}
    </span>
  )
}
