import { useState } from 'react'

export default function AddRecord({ categories, onAdd, onUpdate, onNavigate, editRecord }) {
  const [type, setType] = useState(editRecord?.type || 'expense')
  const [amount, setAmount] = useState(editRecord?.amount?.toString() || '')
  const [category, setCategory] = useState(editRecord?.category || '')
  const [date, setDate] = useState(editRecord?.date || new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState(editRecord?.note || '')

  const currentCategories = categories[type]
  const isEdit = !!editRecord

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || !category) return
    if (isEdit) {
      onUpdate(editRecord.id, { type, amount: Number(amount), category, date, note })
    } else {
      onAdd({ type, amount: Number(amount), category, date, note })
    }
    onNavigate('/')
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        {isEdit ? '編輯記帳' : '新增記帳'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex rounded-xl overflow-hidden border border-gray-200">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory('') }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-white text-gray-500'}`}
          >
            支出
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategory('') }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${type === 'income' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'}`}
          >
            收入
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">金額（TWD）</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-2xl font-bold text-gray-800 focus:outline-none focus:border-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">分類</label>
          <div className="flex flex-wrap gap-2">
            {currentCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  category === cat
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">日期</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">備註（選填）</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="輸入備註..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-semibold active:bg-blue-600"
        >
          儲存
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl text-base font-semibold"
          >
            取消
          </button>
        )}
      </form>
    </div>
  )
}
