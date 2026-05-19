const fmt = n => '$' + Math.round(n).toLocaleString()

const PILL_CLASS = { retainer:'pill-retainer', project:'pill-project', product:'pill-product', coaching:'pill-coaching', other:'pill-other' }
const PILL_LABEL = { retainer:'Retainer', project:'Project', product:'Product', coaching:'Coaching', other:'Other' }
const STATUS_LABEL = { confirmed:'Paid', deposit:'Deposit', invoiced:'Invoiced', pipeline:'Pipeline' }
const STATUS_COLOR = { confirmed:'var(--teal)', deposit:'var(--teal)', invoiced:'var(--amber)', pipeline:'var(--text-muted)' }

export default function EntriesTable({ entries, onDelete }) {
  if (!entries.length) {
    return (
      <div className="entries-card">
        <div className="empty">No entries yet for this month</div>
      </div>
    )
  }

  return (
    <div className="entries-card">
      <table>
        <thead>
          <tr>
            <th style={{width:'32%'}}>Client</th>
            <th style={{width:'16%'}}>Amount</th>
            <th style={{width:'18%'}}>Type</th>
            <th style={{width:'18%'}}>Status</th>
            <th style={{width:'10%'}}>Date</th>
            <th style={{width:'6%'}}></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const d = e.date
              ? new Date(e.date).toLocaleDateString('en-US', { month:'short', day:'numeric' })
              : '—'
            return (
              <tr key={e.id}>
                <td title={e.client}>{e.client}</td>
                <td style={{fontWeight:500}}>{fmt(e.amount)}</td>
                <td><span className={`pill ${PILL_CLASS[e.type] || 'pill-other'}`}>{PILL_LABEL[e.type] || e.type}</span></td>
                <td style={{color: STATUS_COLOR[e.status] || 'var(--text-muted)', fontSize:'12px'}}>{STATUS_LABEL[e.status] || e.status}</td>
                <td style={{color:'var(--text-hint)', fontSize:'12px'}}>{d}</td>
                <td><button className="del-btn" onClick={() => onDelete(e.id)} title="Delete">×</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
