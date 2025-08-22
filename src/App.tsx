import './App.css'
import LandingPage from './components/landing/LandingPage'
import PWAPrompt from './components/pwa/PWAPrompt'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
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
      </Routes>
      <PWAPrompt />
    </BrowserRouter>
  )
}

export default App
