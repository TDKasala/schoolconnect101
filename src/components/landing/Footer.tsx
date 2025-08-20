import { Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="SchoolConnect" className="h-7 w-7" />
              <span className="font-semibold text-white">SchoolConnect</span>
            </div>
            <p className="mt-3 text-sm text-gray-400">Plateforme de gestion scolaire moderne, optimisée pour les écoles congolaises.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white">Fonctionnalités</a></li>
              <li><a href="#modules" className="hover:text-white">Modules</a></li>
              <li><a href="#cta" className="hover:text-white">Commencer</a></li>
              <li><a href="mailto:support@schoolconnect.cd?subject=Support%20SchoolConnect" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://github.com/TDKasala/schoolconnect101#readme" target="_blank" rel="noreferrer" className="hover:text-white">Documentation</a></li>
              <li><a href="https://github.com/TDKasala/schoolconnect101/security" target="_blank" rel="noreferrer" className="hover:text-white">Sécurité</a></li>
              <li><a href="https://www.githubstatus.com/" target="_blank" rel="noreferrer" className="hover:text-white">Statut</a></li>
              <li><a href="https://github.com/TDKasala/schoolconnect101/discussions" target="_blank" rel="noreferrer" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4"/> <a href="https://maps.google.com/?q=Kinshasa%2C%20RDC" target="_blank" rel="noreferrer" className="hover:text-white">Kinshasa, RDC</a></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4"/> <a href="tel:+243000000000" className="hover:text-white">+243 000 000 000</a></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4"/> <a href="mailto:contact@schoolconnect.cd" className="hover:text-white">contact@schoolconnect.cd</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-gray-400 flex items-center justify-between">
          <p>© {new Date().getFullYear()} SchoolConnect. Tous droits réservés.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white">Confidentialité</a>
            <a href="/terms" className="hover:text-white">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
