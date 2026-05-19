import { getEntries } from '../modules/entries.js'

export default function MonthTabs({ data, year, currentMonth, months, onSelect }) {
  return (
    <div className="month-tabs">
      {months.map((name, i) => {
        const total = getEntries(data, i, year)
          .filter(e => e.status === 'confirmed' || e.status === 'deposit')
          .reduce((s, e) => s + e.amount, 0)
        const label = total > 0 ? `${name} $${Math.round(total).toLocaleString()}` : name
        return (
          <button
            key={i}
            className={`mtab${i === currentMonth ? ' active' : ''}`}
            onClick={() => onSelect(i)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
