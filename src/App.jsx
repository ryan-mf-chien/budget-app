import { useState } from 'react'
import { useRecords } from './hooks/useRecords'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import AddRecord from './pages/AddRecord'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

export default function App() {
  const [path, setPath] = useState('/')
  const { records, categories, addRecord, deleteRecord, addCategory, deleteCategory } = useRecords()

  const renderPage = () => {
    switch (path) {
      case '/':
        return <Home records={records} onDelete={deleteRecord} />
      case '/add':
        return <AddRecord categories={categories} onAdd={addRecord} onNavigate={setPath} />
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
      {renderPage()}
      <BottomNav currentPath={path} onNavigate={setPath} />
    </div>
  )
}
