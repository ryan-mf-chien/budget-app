import { useState, useEffect } from 'react'

const STORAGE_KEY = 'budget_records'
const CATEGORIES_KEY = 'budget_categories'

const DEFAULT_CATEGORIES = {
  expense: ['餐飲', '交通', '購物', '娛樂', '醫療', '居家', '其他'],
  income: ['薪資', '獎金', '投資', '其他'],
}

export function useRecords() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(CATEGORIES_KEY)
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }, [records])

  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  }, [categories])

  const addRecord = (record) => {
    const newRecord = {
      ...record,
      id: Date.now(),
      date: record.date || new Date().toISOString().slice(0, 10),
    }
    setRecords((prev) => [newRecord, ...prev])
  }

  const deleteRecord = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const updateRecord = (id, updated) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)))
  }

  const addCategory = (type, name) => {
    setCategories((prev) => ({
      ...prev,
      [type]: [...prev[type], name],
    }))
  }

  const deleteCategory = (type, name) => {
    setCategories((prev) => ({
      ...prev,
      [type]: prev[type].filter((c) => c !== name),
    }))
  }

  return { records, categories, addRecord, deleteRecord, updateRecord, addCategory, deleteCategory }
}
