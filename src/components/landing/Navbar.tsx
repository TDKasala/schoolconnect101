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
      <div className="backdrop-blur supports-[backdrop-filter]:bg-brand-blue-light/80 bg-brand-blue-light/95 border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="SchoolConnect" className="h-8 w-8" />
              <span className="font-bold text-lg text-gray-800">SchoolConnect</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-brand-blue">
                  Fonctionnalités <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                  <div className="py-2">
                    {featureLinks.map((link) => (
                      <Link key={link.name} to={link.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link to="/avantages" className="hover:text-brand-blue">Avantages</Link>
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-brand-blue">
                  Modules <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                  <div className="py-2">
                    {moduleLinks.map((link) => (
                      <Link key={link.name} to={link.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link to="/tarifs" className="hover:text-brand-blue">Tarifs</Link>
              <Link to="/contact" className="hover:text-brand-blue">Contact</Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-brand-blue">Demander une démo</Link>
              <Link to="/contact" className="inline-flex items-center rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-green/90 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2">Ouvrir un compte</Link>
            </div>

            <button className="md:hidden p-2 text-gray-700" onClick={() => setOpen(!open)}>
              {open ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-gray-200/80 bg-brand-blue-light">
            <div className="px-4 py-4 space-y-4 text-base font-medium">
              <div>
                <button onClick={() => setFeaturesOpen(!featuresOpen)} className="w-full flex justify-between items-center text-gray-700">
                  Fonctionnalités
                  <ChevronDown className={`h-5 w-5 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
                </button>
                {featuresOpen && (
                  <div className="pl-4 mt-2 space-y-3">
                    {featureLinks.map((link) => (
                      <Link key={link.name} to={link.href} className="block text-gray-600 hover:text-brand-blue">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/avantages" className="block text-gray-700 hover:text-brand-blue">Avantages</Link>
              <div>
                <button onClick={() => setModulesOpen(!modulesOpen)} className="w-full flex justify-between items-center text-gray-700">
                  Modules
                  <ChevronDown className={`h-5 w-5 transition-transform ${modulesOpen ? 'rotate-180' : ''}`} />
                </button>
                {modulesOpen && (
                  <div className="pl-4 mt-2 space-y-3">
                    {moduleLinks.map((link) => (
                      <Link key={link.name} to={link.href} className="block text-gray-600 hover:text-brand-blue">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/tarifs" className="block text-gray-700 hover:text-brand-blue">Tarifs</Link>
              <Link to="/contact" className="block text-gray-700 hover:text-brand-blue">Contact</Link>
              <div className="pt-4 border-t border-gray-200 flex flex-col gap-4">
                <Link to="/contact" className="text-center w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">Demander une démo</Link>
                <Link to="/contact" className="text-center w-full inline-flex items-center justify-center rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-green/90">Ouvrir un compte</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
