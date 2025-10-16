import { Routes, Route } from 'react-router-dom'
import Upload from './components/Upload/Upload'
import Editor from './components/Editor/Editor'

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </div>
  )
}

export default App