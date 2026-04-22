import { useState, useEffect } from 'react'

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL
const TOKEN = import.meta.env.VITE_SHEETS_TOKEN
const CACHE_KEY = 'budget_records_cache'
const CATEGORIES_KEY = 'budget_categories'

const DEFAULT_CATEGORIES = {
  expense: ['餐飲', '交通', '購物', '娛樂', '醫療', '居家', '其他'],
  income: ['薪資', '獎金', '投資', '其他'],
}

async function sheetsGet() {
  const res = await fetch(`${SHEETS_URL}?token=${encodeURIComponent(TOKEN)}`, {
    redirect: 'follow',
  })
  const data = await res.json()
  return data.records || []
}

async function sheetsPost(payload) {
  await fetch(SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({ ...payload, token: TOKEN }),
  })
}

export function useRecords() {
  const [records, setRecords] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : []
  })
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(CATEGORIES_KEY)
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES
  })
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setSyncing(true)
    sheetsGet()
      .then((rows) => {
        const parsed = rows.map((r) => ({ ...r, amount: Number(r.amount) }))
        setRecords(parsed)
        localStorage.setItem(CACHE_KEY, JSON.stringify(parsed))
        setError(null)
      })
      .catch(() => setError('無法連線，顯示本機快取'))
      .finally(() => setSyncing(false))
  }, [])

  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  }, [categories])

  const addRecord = async (record) => {
    const newRecord = {
      ...record,
      id: Date.now(),
      date: record.date || new Date().toISOString().slice(0, 10),
      note: record.note || '',
    }
    setRecords((prev) => {
      const updated = [newRecord, ...prev]
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated))
      return updated
    })
    await sheetsPost({ action: 'add', record: newRecord })
  }

  const updateRecord = async (id, updated) => {
    setRecords((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
      localStorage.setItem(CACHE_KEY, JSON.stringify(next))
      return next
    })
    const record = records.find((r) => r.id === id)
    await sheetsPost({ action: 'update', record: { ...record, ...updated } })
  }

  const deleteRecord = async (id) => {
    setRecords((prev) => {
      const next = prev.filter((r) => r.id !== id)
      localStorage.setItem(CACHE_KEY, JSON.stringify(next))
      return next
    })
    await sheetsPost({ action: 'delete', id })
  }

  const addCategory = (type, name) => {
    setCategories((prev) => ({ ...prev, [type]: [...prev[type], name] }))
  }

  const deleteCategory = (type, name) => {
    setCategories((prev) => ({ ...prev, [type]: prev[type].filter((c) => c !== name) }))
  }

  return { records, categories, syncing, error, addRecord, updateRecord, deleteRecord, addCategory, deleteCategory }
}
