import { useState } from 'react'
import { useRecords } from './hooks/useRecords'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import AddRecord from './pages/AddRecord'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

export default function App() {
  const [path, setPath] = useState('/')
  const [editRecord, setEditRecord] = useState(null)
  const { records, categories, syncing, error, addRecord, deleteRecord, updateRecord, addCategory, deleteCategory } = useRecords()

  const handleEdit = (record) => {
    setEditRecord(record)
    setPath('/add')
  }

  const handleNavigate = (p) => {
    if (p !== '/add') setEditRecord(null)
    setPath(p)
  }

  const renderPage = () => {
    switch (path) {
      case '/':
        return <Home records={records} onDelete={deleteRecord} onEdit={handleEdit} />
      case '/add':
        return <AddRecord categories={categories} onAdd={addRecord} onUpdate={updateRecord} onNavigate={handleNavigate} editRecord={editRecord} />
      case '/analytics':
        return <Analytics records={records} />
      case '/settings':
        return <Settings categories={categories} onAddCategory={addCategory} onDeleteCategory={deleteCategory} />
      default:
        return <Home records={records} />
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20">
      <div className={`text-xs text-center py-1.5 ${syncing ? 'bg-blue-50 text-blue-600' : error ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
        {syncing ? '同步中...' : error ? error : `已連線，共 ${records.length} 筆`}
      </div>
      {renderPage()}
      <BottomNav currentPath={path} onNavigate={handleNavigate} />
    </div>
  )
}
