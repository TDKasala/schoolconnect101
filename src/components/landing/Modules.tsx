import { BookOpen, Banknote, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Modules() {
  const modules = [
    {
      icon: <BookOpen className="h-5 w-5 text-primary-600"/>,
      title: 'POSP',
      text: 'Gestion pédagogique: élèves, classes, présences, notes, bulletins.',
      to: '/fonctionnalites/pedagogie'
    },
    {
      icon: <Banknote className="h-5 w-5 text-primary-600"/>,
      title: 'UBank',
      text: 'Gestion financière: frais scolaires, échéances, paiements, reçus.',
      to: '/fonctionnalites/finances'
    },
    {
      icon: <Users className="h-5 w-5 text-primary-600"/>,
      title: 'Portails',
      text: 'Accès parents et élèves: suivi en temps réel et communication.',
      href: 'mailto:contact@schoolconnect.cd?subject=Infos%20Portails%20-%20SchoolConnect'
    }
  ] as const

  return (
    <section id="modules" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="inline-flex items-center gap-2 text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full mb-3">Modules Principaux</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Tout ce qu'il faut pour gérer votre école</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((m, idx) => (
            <div key={idx} className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-glow">
              <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                {m.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{m.title}</h3>
              <p className="text-gray-600 text-sm">{m.text}</p>
              {'to' in m ? (
                <Link to={(m as any).to} className="mt-3 inline-block text-sm font-medium text-primary-600 group-hover:text-primary-700">En savoir plus →</Link>
              ) : (
                <a href={(m as any).href} className="mt-3 inline-block text-sm font-medium text-primary-600 group-hover:text-primary-700">En savoir plus →</a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
