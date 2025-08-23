import { CheckCircle2, ArrowLeft, Star, Users, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';
import { useScrollToTop } from '../hooks/useScrollToTop';

const plans = [
  {
    name: 'Essentiel',
    icon: Users,
    price: { monthly: 0, annually: 0 },
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
    icon: Star,
    price: { monthly: 49, annually: 490 },
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
    icon: Building,
    price: 'custom',
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
];

const faqs = [
    {
        question: "Puis-je changer de plan plus tard ?",
        answer: "Absolument ! Vous pouvez passer d'un plan à l'autre à tout moment depuis votre espace administrateur. La facturation sera ajustée au prorata."
    },
    {
        question: "Quels sont les moyens de paiement acceptés ?",
        answer: "Nous acceptons les principales cartes de crédit (Visa, MasterCard), les virements bancaires, ainsi que les paiements mobiles locaux (Airtel Money, M-Pesa)."
    },
    {
        question: "L'abonnement annuel est-il remboursable ?",
        answer: "Nous offrons une garantie de satisfaction de 30 jours. Si vous n'êtes pas satisfait pour une raison quelconque pendant le premier mois, nous vous rembourserons intégralement."
    },
    {
        question: "Proposez-vous une démo du produit ?",
        answer: "Oui ! Nous serions ravis de vous faire une démonstration personnalisée de SchoolConnect. Cliquez sur 'Demander une démo' et nous vous contacterons pour la planifier."
    }
];

const allFeatures = [
    { feature: 'Nombre d\'élèves', essentiel: 'Jusqu\'à 200', pro: 'Illimité', entreprise: 'Illimité' },
    { feature: 'Module Pédagogie', essentiel: true, pro: true, entreprise: true },
    { feature: 'Module Finances (UBank)', essentiel: false, pro: true, entreprise: true },
    { feature: 'Portail Parent', essentiel: true, pro: true, entreprise: true },
    { feature: 'Portail Enseignant', essentiel: true, pro: true, entreprise: true },
    { feature: 'Portail Administrateur', essentiel: false, pro: true, entreprise: true },
    { feature: 'Rapports & Analyses', essentiel: 'Basique', pro: 'Avancé', entreprise: 'Personnalisé' },
    { feature: 'Support Client', essentiel: 'Communautaire', pro: 'Prioritaire', entreprise: 'Dédié (CSM)' },
    { feature: 'Intégrations API', essentiel: false, pro: false, entreprise: true },
    { feature: 'Formation & Accompagnement', essentiel: false, pro: 'Standard', entreprise: 'Dédié' },
];

export default function Tarifs() {
  useScrollToTop();
  
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gray-50 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              Une Tarification <span className="text-brand-blue">Simple et Transparente</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              Choisissez le plan qui correspond à la taille et aux ambitions de votre établissement. Pas de frais cachés, pas de surprises.
            </p>
            <div className="mt-10 flex justify-center items-center gap-4">
                <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-brand-blue' : 'text-gray-500'}`}>Mensuel</span>
                <div onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')} className="w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300">
                    <motion.div 
                        className="w-6 h-6 bg-white rounded-full shadow-md"
                        layout 
                        transition={{ type: "spring", stiffness: 700, damping: 30 }}
                        style={{ marginLeft: billingCycle === 'annually' ? 'auto' : '0' }}
                    />
                </div>
                <span className={`font-semibold ${billingCycle === 'annually' ? 'text-brand-blue' : 'text-gray-500'}`}>
                    Annuel <span className="text-sm font-medium text-brand-green">(Économisez 2 mois)</span>
                </span>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-8 flex flex-col transition-all duration-300 border ${plan.featured ? 'bg-gray-900 text-white border-brand-blue shadow-2xl transform lg:scale-105' : 'bg-gray-50 border-gray-200 hover:shadow-xl'}`}>
                  <div className="flex items-center gap-3">
                    <plan.icon className={`h-7 w-7 ${plan.featured ? 'text-brand-yellow' : 'text-brand-blue'}`} />
                    <h3 className={`text-2xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                  </div>
                  <p className={`mt-4 h-16 ${plan.featured ? 'text-gray-300' : 'text-gray-600'}`}>{plan.description}</p>
                  <div className={`mt-6 flex items-baseline gap-x-2 ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price === 'custom' ? (
                        <span className="text-4xl font-extrabold tracking-tight">Sur Devis</span>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={billingCycle}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-baseline gap-x-2"
                            >
                                <span className="text-4xl font-extrabold tracking-tight">${plan.price[billingCycle]}</span>
                                <span className={`text-sm font-semibold ${plan.featured ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {plan.price.monthly > 0 ? (billingCycle === 'monthly' ? '/ mois' : '/ an') : 'à vie'}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    )}
                  </div>
                  <ul className={`mt-8 space-y-4 text-sm flex-grow ${plan.featured ? 'text-gray-300' : 'text-gray-700'}`}>
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${plan.featured ? 'text-brand-green' : 'text-brand-blue'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <Link
                      to="/contact"
                      className={`w-full block text-center rounded-lg px-6 py-3 text-base font-semibold transition-colors duration-300 ${plan.featured ? 'bg-brand-yellow text-gray-900 hover:bg-brand-yellow/90' : 'bg-brand-blue text-white hover:bg-brand-blue/90'}`}>
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-gray-500">Tous les prix sont en USD. Facturation en CDF possible au taux du jour.</p>
          </div>
        </section>

        {/* Feature Comparison Section */}
        <section className="py-20 md:py-28 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Comparez les Fonctionnalités</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Trouvez le plan qui contient tout ce dont vous avez besoin pour réussir.</p>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="text-left">
                            <tr>
                                <th className="whitespace-nowrap px-6 py-4 font-bold text-gray-900">Fonctionnalité</th>
                                <th className="whitespace-nowrap px-6 py-4 font-bold text-gray-900 text-center">Essentiel</th>
                                <th className="whitespace-nowrap px-6 py-4 font-bold text-gray-900 text-center">Professionnel</th>
                                <th className="whitespace-nowrap px-6 py-4 font-bold text-gray-900 text-center">Entreprise</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {allFeatures.map(({ feature, essentiel, pro, entreprise }) => (
                                <tr key={feature}>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{feature}</td>
                                    {[essentiel, pro, entreprise].map((value, i) => (
                                        <td key={i} className="whitespace-nowrap px-6 py-4 text-gray-700 text-center">
                                            {typeof value === 'boolean' ? (
                                                value ? <CheckCircle2 className="h-6 w-6 text-brand-green mx-auto" /> : <span className="text-gray-400">-</span>
                                            ) : (
                                                <span className="font-medium">{value}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white py-20 md:py-28">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Questions Fréquemment Posées</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Vous avez des questions ? Nous avons les réponses.</p>
                </div>
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <details key={i} className="group rounded-lg bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h2 className="text-lg font-medium">{faq.question}</h2>
                                <span className="relative h-5 w-5 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-5 w-5 opacity-100 group-open:opacity-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9" /></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-5 w-5 opacity-0 group-open:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9" /></svg>
                                </span>
                            </summary>
                            <p className="mt-4 leading-relaxed text-gray-700">{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand-blue">
          <div className="max-w-4xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Prêt à Transformer Votre École ?
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
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
