import { useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export default function Analytics({ records }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const monthRecords = records.filter((r) => {
    const [y, m] = r.date.split('-').map(Number)
    return y === year && m === month
  })

  const expenseRecords = monthRecords.filter((r) => r.type === 'expense')

  const pieData = Object.entries(
    expenseRecords.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  const barData = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1
    const monthRecs = records.filter((r) => {
      const [y, mo] = r.date.split('-').map(Number)
      return y === year && mo === m
    })
    return {
      name: `${m}月`,
      收入: monthRecs.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0),
      支出: monthRecs.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0),
    }
  })

  const fmt = (n) => n.toLocaleString('zh-TW')

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">消費分析</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setYear((y) => y - 1)} className="text-gray-500 px-2">◀</button>
          <span className="text-sm font-medium text-gray-700">{year}</span>
          <button onClick={() => setYear((y) => y + 1)} className="text-gray-500 px-2">▶</button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <button
            key={m}
            onClick={() => setMonth(m)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              m === month ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {m} 月
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-700 mb-3">{month} 月支出分類</h2>
        {pieData.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">本月無支出記錄</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.sort((a, b) => b.value - a.value).map((item, i) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }} />
                    {item.name}
                  </span>
                  <span className="font-medium text-gray-700">${fmt(item.value)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-700 mb-3">{year} 年收支趨勢</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="收入" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="支出" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
