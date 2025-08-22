import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, DollarSign, ClipboardList, Receipt, TrendingDown, LayoutDashboard, FileText, ShieldCheck, TrendingUp, FileSignature } from 'lucide-react';

const features = [
  {
    icon: <ClipboardList className="h-6 w-6 text-green-600" />,
    title: 'Gestion des inscriptions',
    description: 'Processus d\'inscription simplifié avec suivi automatique des frais d\'entrée.',
    details: ['Inscription en ligne', 'Validation automatique', 'Suivi des documents', 'Confirmation par SMS/Email'],
  },
  {
    icon: <DollarSign className="h-6 w-6 text-green-600" />,
    title: 'Suivi des frais scolaires (Minerval)',
    description: 'Gestion complète des paiements mensuels avec échéanciers personnalisables.',
    details: ['Échéanciers flexibles', 'Rappels automatiques', 'Historique des paiements', 'Gestion des retards'],
  },
  {
    icon: <Receipt className="h-6 w-6 text-green-600" />,
    title: 'Génération de reçus automatiques',
    description: 'Création instantanée de reçus officiels avec numérotation automatique.',
    details: ['Reçus instantanés', 'Numérotation automatique', 'Format officiel', 'Envoi par email/SMS'],
  },
  {
    icon: <TrendingDown className="h-6 w-6 text-green-600" />,
    title: 'Suivi des dépenses de l\'école',
    description: 'Gestion budgétaire complète avec catégorisation des dépenses.',
    details: ['Catégories de dépenses', 'Budgets prévisionnels', 'Contrôle des coûts', 'Rapports détaillés'],
  },
  {
    icon: <LayoutDashboard className="h-6 w-6 text-green-600" />,
    title: 'Tableaux de bord financiers',
    description: 'Visualisation en temps réel de la santé financière de l\'établissement.',
    details: ['Graphiques interactifs', 'Indicateurs clés', 'Prévisions financières', 'Analyses comparatives'],
  },
  {
    icon: <FileText className="h-6 w-6 text-green-600" />,
    title: 'Rapports financiers',
    description: 'Génération automatique de rapports comptables et financiers.',
    details: ['Bilans automatiques', 'Rapports personnalisés', 'Export Excel/PDF', 'Conformité comptable'],
  },
];

export default function UBank() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <Link
                to="/"
                className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 mb-8"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l’accueil
            </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Module Finances
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Maîtrisez parfaitement vos finances scolaires avec des outils de gestion comptable adaptés aux réalités des écoles congolaises.
          </p>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Demander une démo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Gestion Financière Complète</h2>
            <p className="mt-4 text-lg text-gray-500">
              De l'inscription au suivi budgétaire, gérez toutes vos finances en toute transparence
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                        <ul className="mt-3 space-y-1">
                            {feature.details.map(detail => (
                                <li key={detail} className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="ml-2 text-sm text-gray-500">{detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">Tableau de bord financier en temps réel</h2>
            </div>
            <div className="mt-12 lg:grid lg:grid-cols-3 lg:gap-8 items-center">
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-semibold text-gray-800">Suivi en temps réel</h3>
                    <p className="mt-2 text-gray-600">Visualisez instantanément l'état de vos finances avec des indicateurs mis à jour automatiquement.</p>
                    <h3 className="mt-6 text-xl font-semibold text-gray-800">Analyses détaillées</h3>
                    <p className="mt-2 text-gray-600">Comprenez vos flux financiers avec des graphiques et analyses approfondies.</p>
                    <h3 className="mt-6 text-xl font-semibold text-gray-800">Rapports automatiques</h3>
                    <p className="mt-2 text-gray-600">Générez des rapports financiers professionnels en un clic.</p>
                </div>
                <div className="mt-10 lg:mt-0 lg:col-span-2 bg-gray-100 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <h4 className="font-bold text-lg text-gray-800">Aperçu financier</h4>
                    <div className="mt-4 bg-white p-6 rounded-lg shadow-inner">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600">Recettes ce mois</p>
                            <p className="font-bold text-2xl text-green-600">2,450,000 USD</p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-gray-600">Taux de paiement</p>
                            <p className="font-bold text-2xl text-green-600">89%</p>
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <div className="flex justify-between text-sm">
                                <p>Frais scolaires</p>
                                <p className="font-medium">$1,800,000 USD</p>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <p>Inscriptions</p>
                                <p className="font-medium">$650,000 USD</p>
                            </div>
                            <div className="flex justify-between text-sm mt-1 text-red-600">
                                <p>Dépenses</p>
                                <p className="font-medium">-$420,000 USD</p>
                            </div>
                        </div>
                        <div className="mt-4 border-t pt-4 flex justify-between font-bold text-lg">
                            <p>Solde net</p>
                            <p>$2,030,000 USD</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">Avantages du Module Finances</h2>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                    <ShieldCheck className="h-10 w-10 text-green-600" />
                    <h3 className="mt-4 text-lg font-semibold">Transparence totale</h3>
                    <p className="mt-1 text-gray-600">Toutes les transactions sont tracées et documentées pour une transparence maximale.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <TrendingUp className="h-10 w-10 text-green-600" />
                    <h3 className="mt-4 text-lg font-semibold">Amélioration des recettes</h3>
                    <p className="mt-1 text-gray-600">Optimisez vos recettes grâce à un suivi rigoureux des paiements.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <FileSignature className="h-10 w-10 text-green-600" />
                    <h3 className="mt-4 text-lg font-semibold">Conformité comptable</h3>
                    <p className="mt-1 text-gray-600">Respectez les normes comptables avec des rapports conformes aux standards.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Final CTA */}
       <div className="bg-white">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Maîtrisez vos finances scolaires</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-500">Découvrez comment le module Finances peut améliorer la gestion financière de votre école.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              Demander une démo
            </Link>
            <Link to="/tarifs" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200">
              Voir les tarifs
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
