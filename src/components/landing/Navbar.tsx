import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="SchoolConnect" className="h-7 w-7" />
              <span className="font-semibold">SchoolConnect</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
              <a href="#features" className="hover:text-gray-900">Fonctionnalités</a>
              <Link to="/fonctionnalites/pedagogie" className="hover:text-gray-900">Pédagogie</Link>
              <Link to="/fonctionnalites/finances" className="hover:text-gray-900">Finances</Link>
              <Link to="/avantages" className="hover:text-gray-900">Avantages</Link>
              <a href="#modules" className="hover:text-gray-900">Modules</a>
              <a href="#cta" className="hover:text-gray-900">Tarifs</a>
              <Link to="/contact" className="hover:text-gray-900">Contact</Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo" className="text-sm font-medium text-gray-700 hover:text-gray-900">Demander une démo</a>
              <a href="#cta" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Ouvrir un compte</a>
            </div>

            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-4 py-3 space-y-3 text-sm">
              <a href="#features" className="block">Fonctionnalités</a>
              <Link to="/fonctionnalites/pedagogie" className="block">Pédagogie</Link>
              <Link to="/fonctionnalites/finances" className="block">Finances</Link>
              <Link to="/avantages" className="block">Avantages</Link>
              <a href="#modules" className="block">Modules</a>
              <a href="#cta" className="block">Tarifs</a>
              <Link to="/contact" className="block">Contact</Link>
              <div className="pt-2 flex gap-3">
                <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo" className="text-gray-700">Demander une démo</a>
                <a href="#cta" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Ouvrir un compte</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
