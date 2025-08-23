import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="SchoolConnect" className="h-8 w-8" />
              <span className="font-bold text-lg text-gray-800">SchoolConnect</span>
            </div>
            <p className="mt-4 text-sm text-gray-600">Plateforme de gestion scolaire moderne, optimisée pour les écoles congolaises.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Liens rapides</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/avantages" className="hover:text-brand-blue">Avantages</Link></li>
              <li><Link to="/tarifs" className="hover:text-brand-blue">Tarifs</Link></li>
              <li><Link to="/contact" className="hover:text-brand-blue">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-brand-blue">FAQ</Link></li>
              <li><a href="mailto:support@schoolconnect.cd?subject=Support%20SchoolConnect" className="hover:text-brand-blue">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Ressources</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="https://github.com/TDKasala/schoolconnect101#readme" target="_blank" rel="noreferrer" className="hover:text-brand-blue">Documentation</a></li>
              <li><a href="https://github.com/TDKasala/schoolconnect101/security" target="_blank" rel="noreferrer" className="hover:text-brand-blue">Sécurité</a></li>
              <li><a href="https://www.githubstatus.com/" target="_blank" rel="noreferrer" className="hover:text-brand-blue">Statut</a></li>
              <li><a href="https://github.com/TDKasala/schoolconnect101/discussions" target="_blank" rel="noreferrer" className="hover:text-brand-blue">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-gray-500"/> <a href="https://maps.google.com/?q=Kinshasa%2C%20RDC" target="_blank" rel="noreferrer" className="hover:text-brand-blue">Kinshasa, RDC</a></li>
              <li className="flex items-start gap-3"><Phone className="h-4 w-4 mt-0.5 text-gray-500"/> <a href="tel:+243000000000" className="hover:text-brand-blue">+243 000 000 000</a></li>
              <li className="flex items-start gap-3"><Mail className="h-4 w-4 mt-0.5 text-gray-500"/> <a href="mailto:contact@schoolconnect.cd" className="hover:text-brand-blue">contact@schoolconnect.cd</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SchoolConnect. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-brand-blue">Confidentialité</Link>
            <Link to="/terms" className="hover:text-brand-blue">Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
