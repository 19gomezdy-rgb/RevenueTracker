import { useState, useEffect } from 'react'
import { fetchPitches, savePitches } from '../modules/db.js'

export default function PitchesTracker() {
  const [pitches, setPitches] = useState(0)

  useEffect(() => {
    fetchPitches().then(setPitches).catch(() => {})
  }, [])

  async function handleChange(e) {
    const v = parseInt(e.target.value) || 0
    setPitches(v)
    try {
      await savePitches(v)
    } catch {}
  }

  let statusEl = null
  if (pitches >= 10) {
    statusEl = <strong style={{color:'var(--teal)'}}>Goal hit! Keep going.</strong>
  } else if (pitches > 0) {
    statusEl = <span style={{color:'var(--amber)'}}>{10 - pitches} more to hit goal</span>
  }

  return (
    <div className="pitches-card">
      <div className="pitches-row">
        <label>Pitches sent this week:</label>
        <input
          type="number"
          min="0"
          placeholder="0"
          value={pitches || ''}
          onChange={handleChange}
        />
        <span className="pitch-stat">Goal: <strong>10+</strong></span>
        {statusEl && <span className="pitch-stat">{statusEl}</span>}
      </div>
    </div>
  )
}
