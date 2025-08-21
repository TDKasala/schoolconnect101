import './App.css'
import LandingPage from './components/landing/LandingPage'
import PWAPrompt from './components/pwa/PWAPrompt'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Advantages from './pages/Advantages'
import Contact from './pages/Contact'
import Pedagogie from './pages/features/Pedagogie'
import Finances from './pages/features/Finances'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/avantages" element={<Advantages />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/fonctionnalites/pedagogie" element={<Pedagogie />} />
        <Route path="/fonctionnalites/finances" element={<Finances />} />
      </Routes>
      <PWAPrompt />
    </BrowserRouter>
  )
}

export default App
