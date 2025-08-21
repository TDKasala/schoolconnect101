import { HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FAQ() {
  const faqs = [
    {
      q: "Qu'est-ce que SchoolConnect ?",
      a: "SchoolConnect est une plateforme SaaS complète pour la gestion des écoles en RDC : pédagogie, finances, communication et plus.",
    },
    {
      q: 'Comment sont gérées les données ?',
      a: "Vos données sont hébergées de façon sécurisée (Supabase/PostgreSQL). Sauvegardes régulières et chiffrement en transit.",
    },
    {
      q: 'Proposez-vous une démo ?',
      a: "Oui. Vous pouvez demander une démo personnalisée en nous écrivant. Nous présentons les modules adaptés à vos besoins.",
    },
    {
      q: 'Quels sont les tarifs ?',
      a: "Nous proposons plusieurs formules adaptées aux réalités locales. Consultez la page Tarifs pour les détails.",
    },
    {
      q: "Puis-je commencer avec un seul établissement ?",
      a: "Oui. Vous pouvez démarrer avec une école puis évoluer vers plusieurs établissements sans changer d'outil.",
    },
    {
      q: 'Avez-vous un support ?',
      a: "Nous offrons un support par email et, selon le plan, un accompagnement prioritaire avec formation.",
    },
  ] as const

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full mb-3">Aide</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Questions fréquentes</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Tout ce qu'il faut savoir pour bien démarrer avec SchoolConnect.</p>
        </div>
      </section>

      {/* FAQ list */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{f.q}</h3>
                    <p className="mt-1 text-gray-700 text-sm">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Extra help */}
          <div className="mt-10 text-center">
            <p className="text-gray-700">Vous n'avez pas trouvé votre réponse ?</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Link to="/tarifs" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Voir les tarifs</Link>
              <a href="mailto:contact@schoolconnect.cd?subject=Question%20-%20SchoolConnect" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Nous contacter</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
