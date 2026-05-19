import { useState } from 'react'

export default function EntryForm({ onAdd }) {
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('retainer')
  const [status, setStatus] = useState('confirmed')

  function handleSubmit() {
    const parsed = parseFloat(amount)
    if (!client.trim() || !parsed || parsed <= 0) {
      alert('Please enter a client name and a valid amount.')
      return
    }
    onAdd({ client: client.trim(), amount: parsed, type, status })
    setClient('')
    setAmount('')
  }

  return (
    <div className="form-card">
      <div className="form-grid">
        <div className="form-group">
          <label>Client or description</label>
          <input
            type="text"
            placeholder="e.g. The Alexander Hotel"
            value={client}
            onChange={e => setClient(e.target.value)}
          />
          <label style={{marginTop:'8px'}}>Amount ($)</label>
          <input
            type="number"
            placeholder="1500"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Income type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="retainer">Retainer</option>
            <option value="project">Photography / project</option>
            <option value="product">Digital product</option>
            <option value="coaching">Coaching / strategy call</option>
            <option value="other">Other</option>
          </select>
          <label style={{marginTop:'8px'}}>Payment status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="confirmed">Confirmed — paid in full</option>
            <option value="deposit">Deposit received (50%)</option>
            <option value="invoiced">Invoiced — not yet paid</option>
            <option value="pipeline">Pipeline — proposal out</option>
          </select>
        </div>
      </div>
      <button className="add-btn" onClick={handleSubmit}>+ Add entry</button>
    </div>
  )
}
