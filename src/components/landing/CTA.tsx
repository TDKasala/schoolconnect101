import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CTA() {
  const stats = [
    { value: '50+', label: 'Écoles actives' },
    { value: '10k+', label: 'Élèves suivis' },
    { value: '99%', label: 'Satisfaction' },
  ]

  return (
    <section id="cta" className="bg-brand-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Prêt à moderniser votre école ?
          </h2>
          <p className="mt-4 text-lg text-blue-200">
            Rejoignez les écoles qui ont déjà choisi SchoolConnect pour simplifier leur gestion quotidienne.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-brand-green px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-green/90 transform hover:scale-105 transition-transform duration-300"
            >
              Demander une démo
            </Link>
            <Link
              to="/tarifs"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
            >
              Voir les tarifs <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="p-8 bg-brand-blue-dark rounded-2xl">
              <div className="text-4xl font-bold text-brand-yellow">{stat.value}</div>
              <div className="mt-2 text-base text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
