import { ShieldCheck, Sparkles, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Features() {
  const items = [
    {
      icon: <Sparkles className="h-6 w-6 text-brand-blue"/>,
      title: 'Simple et intuitif',
      text: 'Pensé pour les réalités locales, facile à prendre en main par vos équipes.'
    },
    {
      icon: <MapPin className="h-6 w-6 text-brand-blue"/>,
      title: 'Optimisé pour la RDC',
      text: 'Fonctionne même avec des connexions limitées. Multi-langue et adapté au contexte.'
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-blue"/>,
      title: 'Support Local',
      text: 'Accompagnement humain et réactif pour vous aider à réussir votre transition numérique.'
    }
  ]

  return (
    <section id="avantages" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 text-sm font-semibold bg-brand-green/10 text-brand-green px-4 py-1 rounded-full mb-4">Pourquoi SchoolConnect ?</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Une solution complète pour votre école</h2>
          <p className="mt-4 text-lg text-gray-600">Une solution conçue avec les directeurs, enseignants et parents pour simplifier la gestion quotidienne.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((it, i) => (
            <Link to="/avantages" key={i} className="group bg-white rounded-2xl p-8 transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl border border-gray-200/80 hover:border-transparent">
              <div className="h-12 w-12 rounded-full bg-brand-blue-light flex items-center justify-center mb-6">
                {it.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{it.title}</h3>
              <p className="text-gray-600">{it.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
