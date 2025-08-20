import './App.css'
import LandingPage from './components/landing/LandingPage'
import PWAPrompt from './components/pwa/PWAPrompt'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Advantages from './pages/Advantages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/avantages" element={<Advantages />} />
      </Routes>
      <PWAPrompt />
    </BrowserRouter>
  )
}

export default App
