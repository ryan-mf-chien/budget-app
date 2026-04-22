export default function Home({ records, onEdit }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const monthRecords = records.filter((r) => {
    const [y, m] = r.date.split('-').map(Number)
    return y === year && m === month
  })

  const income = monthRecords
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0)

  const expense = monthRecords
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0)

  const balance = income - expense

  const fmt = (n) => n.toLocaleString('zh-TW')

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">
        {year} 年 {month} 月
      </h1>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">收入</p>
          <p className="text-lg font-bold text-blue-600">+{fmt(income)}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">支出</p>
          <p className="text-lg font-bold text-red-500">-{fmt(expense)}</p>
        </div>
        <div className={`rounded-2xl p-4 text-center ${balance >= 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
          <p className="text-xs text-gray-500 mb-1">結餘</p>
          <p className={`text-lg font-bold ${balance >= 0 ? 'text-green-600' : 'text-orange-500'}`}>
            {balance >= 0 ? '+' : ''}{fmt(balance)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-base font-semibold text-gray-700">本月明細</h2>
        {monthRecords.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">尚無記錄</p>
        ) : (
          monthRecords.map((r) => (
            <div key={r.id} className="bg-white rounded-xl px-4 py-3 flex justify-between items-center shadow-sm border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">{r.category}</p>
                <p className="text-xs text-gray-400">{r.date}{r.note ? ` · ${r.note}` : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className={`font-semibold ${r.type === 'income' ? 'text-blue-600' : 'text-red-500'}`}>
                  {r.type === 'income' ? '+' : '-'}{fmt(r.amount)}
                </p>
                <button onClick={() => onEdit(r)} className="text-gray-400 text-lg">✏️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
