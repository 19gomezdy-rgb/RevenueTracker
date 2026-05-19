import { useState } from 'react'

const fmt = n => '$' + Math.round(n).toLocaleString()

const PILL_CLASS = { retainer:'pill-retainer', project:'pill-project', product:'pill-product', coaching:'pill-coaching', other:'pill-other' }
const PILL_LABEL = { retainer:'Retainer', project:'Project', product:'Product', coaching:'Coaching', other:'Other' }
const STATUS_LABEL = { confirmed:'Paid', deposit:'Deposit', invoiced:'Invoiced', pipeline:'Pipeline' }
const STATUS_COLOR = { confirmed:'var(--teal)', deposit:'var(--teal)', invoiced:'var(--amber)', pipeline:'var(--text-muted)' }

const cellInput = {
  fontSize: '13px',
  padding: '3px 6px',
  border: '0.5px solid var(--border-mid)',
  borderRadius: '4px',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontFamily: 'inherit',
  width: '100%',
  outline: 'none',
}

export default function EntriesTable({ entries, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({})
  const [saving, setSaving] = useState(false)

  function startEdit(e) {
    setEditingId(e.id)
    setDraft({ client: e.client, amount: e.amount, type: e.type, status: e.status })
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft({})
  }

  async function commitEdit() {
    if (!draft.client.trim() || !draft.amount || draft.amount <= 0) return
    setSaving(true)
    await onUpdate(editingId, draft)
    setSaving(false)
    setEditingId(null)
    setDraft({})
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

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
            <th style={{width:'28%'}}>Client</th>
            <th style={{width:'14%'}}>Amount</th>
            <th style={{width:'17%'}}>Type</th>
            <th style={{width:'17%'}}>Status</th>
            <th style={{width:'10%'}}>Date</th>
            <th style={{width:'14%'}}></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const d = e.date
              ? new Date(e.date).toLocaleDateString('en-US', { month:'short', day:'numeric' })
              : '—'
            const isEditing = editingId === e.id

            if (isEditing) {
              return (
                <tr key={e.id} style={{background:'#F7F6F0'}}>
                  <td>
                    <input
                      autoFocus
                      style={cellInput}
                      value={draft.client}
                      onChange={ev => setDraft(prev => ({ ...prev, client: ev.target.value }))}
                      onKeyDown={handleKeyDown}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      style={cellInput}
                      value={draft.amount}
                      onChange={ev => setDraft(prev => ({ ...prev, amount: parseFloat(ev.target.value) || 0 }))}
                      onKeyDown={handleKeyDown}
                    />
                  </td>
                  <td>
                    <select style={cellInput} value={draft.type} onChange={ev => setDraft(prev => ({ ...prev, type: ev.target.value }))}>
                      <option value="retainer">Retainer</option>
                      <option value="project">Project</option>
                      <option value="product">Product</option>
                      <option value="coaching">Coaching</option>
                      <option value="other">Other</option>
                    </select>
                  </td>
                  <td>
                    <select style={cellInput} value={draft.status} onChange={ev => setDraft(prev => ({ ...prev, status: ev.target.value }))}>
                      <option value="confirmed">Confirmed</option>
                      <option value="deposit">Deposit</option>
                      <option value="invoiced">Invoiced</option>
                      <option value="pipeline">Pipeline</option>
                    </select>
                  </td>
                  <td style={{color:'var(--text-hint)', fontSize:'12px'}}>{d}</td>
                  <td style={{whiteSpace:'nowrap'}}>
                    <button
                      className="del-btn"
                      style={{color:'var(--teal)', fontSize:'17px', opacity: saving ? 0.5 : 1}}
                      onClick={commitEdit}
                      disabled={saving}
                      title="Save"
                    >✓</button>
                    <button className="del-btn" onClick={cancelEdit} title="Cancel" disabled={saving}>×</button>
                  </td>
                </tr>
              )
            }

            return (
              <tr key={e.id}>
                <td title={e.client}>{e.client}</td>
                <td style={{fontWeight:500}}>{fmt(e.amount)}</td>
                <td><span className={`pill ${PILL_CLASS[e.type] || 'pill-other'}`}>{PILL_LABEL[e.type] || e.type}</span></td>
                <td style={{color: STATUS_COLOR[e.status] || 'var(--text-muted)', fontSize:'12px'}}>{STATUS_LABEL[e.status] || e.status}</td>
                <td style={{color:'var(--text-hint)', fontSize:'12px'}}>{d}</td>
                <td style={{whiteSpace:'nowrap'}}>
                  <button className="del-btn" style={{fontSize:'15px'}} onClick={() => startEdit(e)} title="Edit">✎</button>
                  <button className="del-btn" onClick={() => onDelete(e.id)} title="Delete">×</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
