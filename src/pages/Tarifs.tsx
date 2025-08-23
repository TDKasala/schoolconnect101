import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';

export default function Tarifs() {
  const plans = [
    {
      name: 'Essentiel',
      price: 'Gratuit',
      period: 'à vie',
      description: 'Idéal pour les petites écoles qui débutent avec le numérique.',
      features: [
        'Gestion jusqu’à 200 élèves',
        'Module Pédagogie de base',
        'Portail Parent et Enseignant',
        'Support communautaire',
      ],
      cta: 'Commencer Gratuitement',
      featured: false,
    },
    {
      name: 'Professionnel',
      price: '49',
      period: '/ mois',
      description: 'La solution complète pour une gestion scolaire intégrée et efficace.',
      features: [
        'Nombre d’élèves illimité',
        'Modules Pédagogie & Finances',
        'Portails Admin, Parent, Enseignant',
        'Rapports et analyses avancés',
        'Support prioritaire par email & téléphone',
      ],
      cta: 'Choisir Pro',
      featured: true,
    },
    {
      name: 'Entreprise',
      price: 'Sur Devis',
      period: '',
      description: 'Pour les grands réseaux scolaires ou besoins spécifiques.',
      features: [
        'Déploiement sur-mesure',
        'Intégrations personnalisées (API)',
        'Accompagnement et formation dédiée',
        'Manager de compte dédié (CSM)',
      ],
      cta: 'Nous Contacter',
      featured: false,
    },
  ] as const;

  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-brand-blue-light py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              Une Tarification <span className="text-brand-blue">Simple et Transparente</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              Choisissez le plan qui correspond à la taille et aux ambitions de votre établissement. Pas de frais cachés, pas de surprises.
            </p>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-8 flex flex-col transition-transform duration-300 transform hover:-translate-y-2 ${plan.featured ? 'bg-brand-blue text-white shadow-2xl scale-105' : 'bg-white shadow-lg'}`}>
                  <h3 className={`text-xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                  <p className={`mt-2 h-12 ${plan.featured ? 'text-blue-100' : 'text-gray-600'}`}>{plan.description}</p>
                  <div className={`mt-6 flex items-baseline gap-x-2 ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    {plan.period && <span className={`text-sm font-semibold ${plan.featured ? 'text-blue-100' : 'text-gray-600'}`}>{plan.period}</span>}
                  </div>
                  <ul className={`mt-8 space-y-4 text-sm flex-grow ${plan.featured ? 'text-blue-100' : 'text-gray-700'}`}>
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${plan.featured ? 'text-brand-green' : 'text-brand-blue'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <Link
                      to={plan.name === 'Entreprise' ? '/contact' : 'mailto:contact@schoolconnect.cd?subject=Souscription%20-%20SchoolConnect'}
                      className={`w-full block text-center rounded-lg px-6 py-3 text-base font-semibold transition-colors duration-300 ${plan.featured ? 'bg-white text-brand-blue hover:bg-gray-100' : 'bg-brand-blue text-white hover:bg-brand-blue/90'}`}>
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-gray-500">Tous les prix sont en USD. Facturation en CDF possible au taux du jour.</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Prêt à Transformer Votre École ?
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-600">
              Rejoignez les écoles qui nous font confiance et faites passer votre gestion au niveau supérieur.
            </p>
            <div className="mt-10">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-brand-green px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-green/90 transform hover:scale-105 transition-transform duration-300">
                Demander une Démo Gratuite
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
