import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SimpleAuthProvider } from './contexts/SimpleAuthContext'

// Auth pages
import { Login } from './pages/Login'

// Protected pages
import { Dashboard } from './pages/Dashboard'

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard'

function App() {
  return (
    <SimpleAuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected user routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </SimpleAuthProvider>
  )
}

export default App
