import { BookOpen, Banknote, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Modules() {
  const modules = [
    {
      icon: <BookOpen className="h-6 w-6 text-brand-green"/>,
      title: 'POSP',
      text: 'Gestion pédagogique: élèves, classes, présences, notes, bulletins.',
      to: '/modules/posp'
    },
    {
      icon: <Banknote className="h-6 w-6 text-brand-green"/>,
      title: 'UBank',
      text: 'Gestion financière: frais scolaires, échéances, paiements, reçus.',
      to: '/modules/ubank'
    },
    {
      icon: <Users className="h-6 w-6 text-brand-green"/>,
      title: 'Portails',
      text: 'Accès parents et élèves: suivi en temps réel et communication.',
      to: '/modules/portails'
    }
  ] as const

  return (
    <section id="modules" className="py-20 sm:py-28 bg-brand-blue-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 text-sm font-semibold bg-brand-blue/10 text-brand-blue px-4 py-1 rounded-full mb-4">
            Modules Principaux
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Tout ce qu'il faut pour gérer votre école
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {modules.map((m, idx) => (
            <div key={idx} className="group bg-white rounded-2xl p-8 transition duration-300 ease-in-out hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-gray-200/50">
              <div className="h-12 w-12 rounded-full bg-brand-green-light flex items-center justify-center mb-6">
                {m.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{m.title}</h3>
              <p className="text-gray-600 mb-6">{m.text}</p>
              <Link to={m.to} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-blue/80">
                En savoir plus
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
