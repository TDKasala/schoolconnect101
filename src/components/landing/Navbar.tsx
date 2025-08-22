import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [modulesOpen, setModulesOpen] = useState(false)

  const featureLinks = [
    { name: 'Pédagogie', href: '/fonctionnalites/pedagogie' },
    { name: 'Finances', href: '/fonctionnalites/finances' },
    { name: 'Portails', href: '/fonctionnalites/portails' },
  ]

  const moduleLinks = [
    { name: 'POSP', href: '/modules/posp' },
    { name: 'UBank', href: '/modules/ubank' },
    { name: 'Portails', href: '/modules/portails' },
  ]
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
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-gray-900">
                  Fonctionnalités <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <div className="py-1">
                    {featureLinks.map((link) => (
                      <Link key={link.name} to={link.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link to="/avantages" className="hover:text-gray-900">Avantages</Link>
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-gray-900">
                  Modules <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <div className="py-1">
                    {moduleLinks.map((link) => (
                      <Link key={link.name} to={link.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link to="/tarifs" className="hover:text-gray-900">Tarifs</Link>
              <Link to="/contact" className="hover:text-gray-900">Contact</Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-gray-900">Demander une démo</Link>
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
              <button onClick={() => setFeaturesOpen(!featuresOpen)} className="w-full flex justify-between items-center">
                Fonctionnalités
                <ChevronDown className={`h-4 w-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
              </button>
              {featuresOpen && (
                <div className="pl-4 space-y-2 py-2">
                  {featureLinks.map((link) => (
                    <Link key={link.name} to={link.href} className="block text-gray-600 hover:text-gray-900">
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link to="/avantages" className="block">Avantages</Link>
              <button onClick={() => setModulesOpen(!modulesOpen)} className="w-full flex justify-between items-center">
                Modules
                <ChevronDown className={`h-4 w-4 transition-transform ${modulesOpen ? 'rotate-180' : ''}`} />
              </button>
              {modulesOpen && (
                <div className="pl-4 space-y-2 py-2">
                  {moduleLinks.map((link) => (
                    <Link key={link.name} to={link.href} className="block text-gray-600 hover:text-gray-900">
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link to="/tarifs" className="block">Tarifs</Link>
              <Link to="/contact" className="block">Contact</Link>
              <div className="pt-2 flex gap-3">
                <Link to="/contact" className="text-gray-700">Demander une démo</Link>
                <a href="#cta" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Ouvrir un compte</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
