import { ShieldCheck, Sparkles, MapPin } from 'lucide-react'

export default function Features() {
  const items = [
    {
      icon: <Sparkles className="h-5 w-5 text-blue-600"/>,
      title: 'Simple et intuitif',
      text: 'Pensé pour les réalités locales, facile à prendre en main par vos équipes.'
    },
    {
      icon: <MapPin className="h-5 w-5 text-blue-600"/>,
      title: 'Optimisé pour la RDC',
      text: 'Fonctionne même avec des connexions limitées. Multi-langue et adapté au contexte.'
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-blue-600"/>,
      title: 'Support Local',
      text: 'Accompagnement humain et réactif pour vous aider à réussir votre transition numérique.'
    }
  ]

  return (
    <section id="avantages" className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="inline-flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full mb-3">Pourquoi SchoolConnect ?</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Une solution complète pour votre école</h2>
          <p className="mt-3 text-gray-600">Une solution conçue avec les directeurs, enseignants et parents pour simplifier la gestion quotidienne.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                {it.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{it.title}</h3>
              <p className="text-gray-600 text-sm">{it.text}</p>
              <a href="#" className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">En savoir plus →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
