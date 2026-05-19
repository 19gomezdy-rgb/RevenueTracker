const fmt = n => '$' + Math.round(n).toLocaleString()

const STREAMS = [
  { key: 'retainer', label: 'Retainers', color: 'var(--teal)' },
  { key: 'project',  label: 'Projects',  color: 'var(--purple)' },
  { key: 'product',  label: 'Products',  color: 'var(--amber)' },
  { key: 'coaching', label: 'Coaching',  color: 'var(--coral)' },
]

export default function BreakdownGrid({ entries }) {
  return (
    <div className="breakdown-grid">
      {STREAMS.map(({ key, label, color }) => {
        const total = entries.filter(e => e.type === key).reduce((s, e) => s + e.amount, 0)
        return (
          <div className="b-card" key={key}>
            <div className="b-dot" style={{background: color}} />
            <div className="b-info">
              <div className="b-label">{label}</div>
              <div className="b-val">{fmt(total)}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
