import './App.css'
import LandingPage from './components/landing/LandingPage'
import PWAPrompt from './components/pwa/PWAPrompt'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import Advantages from './pages/Advantages'
import Contact from './pages/Contact'
import Pedagogie from './pages/features/Pedagogie'
import Finances from './pages/features/Finances'
import Tarifs from './pages/Tarifs'
import FAQ from './pages/FAQ'
import Portails from './pages/Portails'
import PortailsFeature from './pages/features/Portails'
import POSP from './pages/modules/POSP'
import UBank from './pages/modules/UBank'
import PortailsModule from './pages/modules/PortailsModule'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Profile'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute'
import { AdminOverview } from './pages/admin/AdminOverview'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminSchools } from './pages/admin/AdminSchools'
import { AdminSettings } from './pages/admin/AdminSettings'
import { AdminMessages } from './pages/admin/AdminMessages'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/avantages" element={<Advantages />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/fonctionnalites/pedagogie" element={<Pedagogie />} />
          <Route path="/fonctionnalites/finances" element={<Finances />} />
          <Route path="/fonctionnalites/portails" element={<PortailsFeature />} />
          <Route path="/portails" element={<Portails />} />
          <Route path="/modules/posp" element={<POSP />} />
          <Route path="/modules/ubank" element={<UBank />} />
          <Route path="/modules/portails" element={<PortailsModule />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute requireApproval={true}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="schools" element={<AdminSchools />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Routes>
        <PWAPrompt />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
