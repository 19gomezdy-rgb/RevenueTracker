export function getKey(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function getEntries(data, month, year) {
  return data[getKey(year, month)] || [];
}

export function addEntry(data, month, year, entry) {
  const key = getKey(year, month);
  if (!data[key]) data[key] = [];
  data[key].push({ ...entry, date: new Date().toISOString() });
  return data;
}

export function deleteEntry(data, month, year, index) {
  const key = getKey(year, month);
  if (!data[key]) return data;
  data[key].splice(index, 1);
  return data;
}
