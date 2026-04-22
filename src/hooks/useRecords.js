import { useState, useEffect } from 'react'

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL
const TOKEN = import.meta.env.VITE_SHEETS_TOKEN
const CACHE_KEY = 'budget_records_cache'
const CATEGORIES_KEY = 'budget_categories'

const DEFAULT_CATEGORIES = {
  expense: ['餐飲', '交通', '購物', '娛樂', '醫療', '居家', '其他'],
  income: ['薪資', '獎金', '投資', '其他'],
}

function buildUrl(params) {
  const q = new URLSearchParams({ token: TOKEN, ...params })
  return `${SHEETS_URL}?${q.toString()}`
}

async function sheetsCall(params) {
  const res = await fetch(buildUrl(params))
  return res.json()
}

function parseDate(val) {
  if (!val) return ''
  if (typeof val === 'string' && val.length === 10) return val
  return new Date(val).toISOString().slice(0, 10)
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
    sheetsCall({ action: 'read' })
      .then((data) => {
        const parsed = (data.records || []).map((r) => ({
          ...r,
          amount: Number(r.amount),
          date: parseDate(r.date),
        }))
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
    await sheetsCall({ action: 'add', record: JSON.stringify(newRecord) })
  }

  const updateRecord = async (id, updated) => {
    setRecords((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
      localStorage.setItem(CACHE_KEY, JSON.stringify(next))
      return next
    })
    const record = records.find((r) => r.id === id)
    await sheetsCall({ action: 'update', record: JSON.stringify({ ...record, ...updated }) })
  }

  const deleteRecord = async (id) => {
    setRecords((prev) => {
      const next = prev.filter((r) => r.id !== id)
      localStorage.setItem(CACHE_KEY, JSON.stringify(next))
      return next
    })
    await sheetsCall({ action: 'delete', id })
  }

  const addCategory = (type, name) => {
    setCategories((prev) => ({ ...prev, [type]: [...prev[type], name] }))
  }

  const deleteCategory = (type, name) => {
    setCategories((prev) => ({ ...prev, [type]: prev[type].filter((c) => c !== name) }))
  }

  return { records, categories, syncing, error, addRecord, updateRecord, deleteRecord, addCategory, deleteCategory }
}
