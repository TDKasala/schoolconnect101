import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Tarifs() {
  const plans = [
    {
      name: 'Starter',
      price: 'Gratuit',
      period: '',
      highlight: 'Pour démarrer',
      features: [
        'Jusqu’à 1 école',
        'Jusqu’à 200 élèves',
        'Module Pédagogie (base)',
        'Support par email',
      ],
      cta: 'Essayer',
      featured: false,
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/mois',
      highlight: 'Le plus populaire',
      features: [
        'Écoles illimitées',
        'Élèves illimités',
        'Pédagogie + Finances',
        'Rapports avancés',
        'Support prioritaire',
      ],
      cta: 'Souscrire',
      featured: true,
    },
    {
      name: 'Entreprise',
      price: 'Custom',
      period: '',
      highlight: 'Grandes structures',
      features: [
        'Déploiement dédié',
        'Intégrations avancées',
        'SLA & accompagnement',
        'Formation & onboarding',
      ],
      cta: 'Nous contacter',
      featured: false,
    },
  ] as const

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full mb-3">Tarification</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Des tarifs adaptés aux écoles congolaises</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Choisissez le plan qui correspond à votre réalité. Pas de frais cachés.</p>
          <div className="mt-6 flex items-center justify-center">
            <Link to="/" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l’accueil
            </Link>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.name} className={`rounded-2xl border ${p.featured ? 'border-blue-300 shadow-lg shadow-blue-100' : 'border-gray-100 shadow-sm'} bg-white p-6`}>
                {p.highlight && (
                  <p className={`text-xs inline-block mb-3 px-2 py-1 rounded-full ${p.featured ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}`}>{p.highlight}</p>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-3xl font-extrabold text-gray-900">{p.price}</span>
                  {p.period && <span className="text-gray-600">{p.period}</span>}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/>{f}</li>
                  ))}
                </ul>
                <div className="mt-6">
                  {p.name === 'Entreprise' ? (
                    <Link to="/contact" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{p.cta}</Link>
                  ) : (
                    <a href="mailto:contact@schoolconnect.cd?subject=Souscription%20-%20SchoolConnect" className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 ${p.featured ? 'bg-blue-600' : 'bg-gray-800'}`}>{p.cta}</a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Note locale */}
          <p className="mt-8 text-xs text-gray-500">Les prix sont indicatifs. Facturation possible en CDF ou USD selon votre préférence.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Besoin d’un devis personnalisé ?</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Contactez-nous pour une offre adaptée à la taille et aux besoins de votre école.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Nous contacter</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
