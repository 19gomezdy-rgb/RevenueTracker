import { supabase } from '../lib/supabase.js'

// ─── Entries ────────────────────────────────────────────────────────────────

export async function fetchEntries(month, year) {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('month', month)
    .eq('year', year)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function fetchEntriesByYear(year) {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('year', year)
    .order('month', { ascending: true })
  if (error) throw error
  return data
}

export async function insertEntry({ client, amount, type, status, month, year }) {
  const { data, error } = await supabase
    .from('entries')
    .insert([{ client, amount, type, status, month, year }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteEntry(id) {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ─── Settings (goal + pitches stored as key/value rows) ────────────────────

async function fetchSetting(key) {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  if (error) throw error
  return data?.value ?? null
}

async function saveSetting(key, value) {
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value: String(value) }, { onConflict: 'key' })
  if (error) throw error
}

// ─── Goal ───────────────────────────────────────────────────────────────────

export async function fetchGoal() {
  const val = await fetchSetting('goal')
  return val ? parseInt(val) : 4000
}

export async function saveGoal(value) {
  return saveSetting('goal', value)
}

// ─── Pitches ────────────────────────────────────────────────────────────────

export async function fetchPitches() {
  const val = await fetchSetting('pitches')
  return val ? parseInt(val) : 0
}

export async function savePitches(value) {
  return saveSetting('pitches', value)
}
