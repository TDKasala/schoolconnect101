import { BookOpen, Banknote, Users } from 'lucide-react'

export default function Modules() {
  const modules = [
    {
      icon: <BookOpen className="h-5 w-5 text-blue-600"/>,
      title: 'POSP',
      text: 'Gestion pédagogique: élèves, classes, présences, notes, bulletins.'
    },
    {
      icon: <Banknote className="h-5 w-5 text-blue-600"/>,
      title: 'UBank',
      text: 'Gestion financière: frais scolaires, échéances, paiements, reçus.'
    },
    {
      icon: <Users className="h-5 w-5 text-blue-600"/>,
      title: 'Portails',
      text: 'Accès parents et élèves: suivi en temps réel et communication.'
    }
  ]

  return (
    <section id="modules" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="inline-flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full mb-3">Modules Principaux</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Tout ce qu'il faut pour gérer votre école</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((m, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                {m.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{m.title}</h3>
              <p className="text-gray-600 text-sm">{m.text}</p>
              <a href="#" className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">Découvrir {m.title} →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
