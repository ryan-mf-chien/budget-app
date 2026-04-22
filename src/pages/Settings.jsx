import { useState } from 'react'

export default function Settings({ categories, onAddCategory, onDeleteCategory }) {
  const [newExpCat, setNewExpCat] = useState('')
  const [newIncCat, setNewIncCat] = useState('')

  const handleAdd = (type, value, setter) => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAddCategory(type, trimmed)
    setter('')
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">設定</h1>

      {[
        { type: 'expense', label: '支出分類', value: newExpCat, setter: setNewExpCat },
        { type: 'income', label: '收入分類', value: newIncCat, setter: setNewIncCat },
      ].map(({ type, label, value, setter }) => (
        <div key={type} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-700 mb-3">{label}</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {categories[type].map((cat) => (
              <span key={cat} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                {cat}
                <button
                  onClick={() => onDeleteCategory(type, cat)}
                  className="text-gray-400 hover:text-red-500 ml-1 leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={`新增${label}...`}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd(type, value, setter)}
            />
            <button
              onClick={() => handleAdd(type, value, setter)}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium"
            >
              新增
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
