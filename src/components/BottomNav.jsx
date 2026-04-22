const NAV_ITEMS = [
  { path: '/', label: '首頁', icon: '🏠' },
  { path: '/add', label: '新增', icon: '➕' },
  { path: '/analytics', label: '分析', icon: '📊' },
  { path: '/settings', label: '設定', icon: '⚙️' },
]

export default function BottomNav({ currentPath, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.path}
          onClick={() => onNavigate(item.path)}
          className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition-colors ${
            currentPath === item.path ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
