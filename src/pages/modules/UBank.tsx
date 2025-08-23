import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, DollarSign, ClipboardList, Receipt, TrendingDown, LayoutDashboard, FileText, ShieldCheck, TrendingUp, FileSignature, Banknote, BarChart3, ShieldAlert } from 'lucide-react';
import Footer from '../../components/landing/Footer';
import Navbar from '../../components/landing/Navbar';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const features = [
  {
    icon: ClipboardList,
    title: 'Gestion des inscriptions',
    description: 'Processus d\'inscription simplifié avec suivi automatique des frais d\'entrée.',
    details: ['Inscription en ligne', 'Validation automatique', 'Suivi des documents', 'Confirmation par SMS/Email'],
  },
  {
    icon: DollarSign,
    title: 'Suivi des frais scolaires (Minerval)',
    description: 'Gestion complète des paiements mensuels avec échéanciers personnalisables.',
    details: ['Échéanciers flexibles', 'Rappels automatiques', 'Historique des paiements', 'Gestion des retards'],
  },
  {
    icon: Receipt,
    title: 'Génération de reçus automatiques',
    description: 'Création instantanée de reçus officiels avec numérotation automatique.',
    details: ['Reçus instantanés', 'Numérotation automatique', 'Format officiel', 'Envoi par email/SMS'],
  },
  {
    icon: TrendingDown,
    title: 'Suivi des dépenses de l\'école',
    description: 'Gestion budgétaire complète avec catégorisation des dépenses.',
    details: ['Catégories de dépenses', 'Budgets prévisionnels', 'Contrôle des coûts', 'Rapports détaillés'],
  },
  {
    icon: LayoutDashboard,
    title: 'Tableaux de bord financiers',
    description: 'Visualisation en temps réel de la santé financière de l\'établissement.',
    details: ['Graphiques interactifs', 'Indicateurs clés', 'Prévisions financières', 'Analyses comparatives'],
  },
  {
    icon: FileText,
    title: 'Rapports financiers',
    description: 'Génération automatique de rapports comptables et financiers.',
    details: ['Bilans automatiques', 'Rapports personnalisés', 'Export Excel/PDF', 'Conformité comptable'],
  },
];

export default function UBank() {
  useScrollToTop();
  
  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-brand-green/10 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-brand-green font-semibold mb-4 group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Retour à l'accueil
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              Module <span className="text-brand-green">UBank</span>: La Gestion Financière Simplifiée
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              Optimisez la santé financière de votre école avec des outils puissants pour le suivi des frais, la gestion des dépenses et des rapports détaillés.
            </p>
            <div className="mt-10">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-brand-green px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-green/90 transform hover:scale-105 transition-transform duration-300"
              >
                Demander une Démo Gratuite
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Une Suite Financière Complète</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                De l'inscription des élèves à la clôture comptable, UBank couvre tous vos besoins financiers.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-brand-green/10 text-brand-green">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                  <ul className="mt-4 space-y-2">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-brand-green flex-shrink-0 mt-0.5" />
                        <span className="ml-3 text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-20 md:py-28 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
              <div className="text-left">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Votre Tour de Contrôle Financière</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Prenez des décisions éclairées grâce à un tableau de bord intuitif qui centralise toutes vos données financières en temps réel.
                </p>
                <ul className="mt-8 space-y-6">
                  <li className="flex items-start"><div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0"><Banknote className="h-5 w-5 text-brand-green" /></div><span className="ml-4 text-lg font-medium">Vue d'ensemble des revenus et dépenses</span></li>
                  <li className="flex items-start"><div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0"><BarChart3 className="h-5 w-5 text-brand-green" /></div><span className="ml-4 text-lg font-medium">Suivi du taux de recouvrement</span></li>
                  <li className="flex items-start"><div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0"><ShieldAlert className="h-5 w-5 text-brand-green" /></div><span className="ml-4 text-lg font-medium">Alertes pour paiements en retard</span></li>
                </ul>
              </div>
              <div className="mt-12 lg:mt-0">
                <div className="bg-gray-800 p-2 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="bg-gray-100 p-6 rounded-xl">
                      <h4 className="font-bold text-lg text-gray-800">Aperçu Financier - Trimestre 1</h4>
                      <div className="mt-4 bg-white p-4 rounded-lg shadow-inner space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">Recettes Totales</p>
                          <p className="font-bold text-xl text-brand-green">2,450,000 FC</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-brand-green h-2.5 rounded-full" style={{width: '89%'}}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">Taux de Paiement</p>
                          <p className="font-bold text-xl text-brand-green">89%</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                          <div className="flex justify-between"><p>Frais scolaires</p><p className="font-medium">1,800,000 FC</p></div>
                          <div className="flex justify-between"><p>Inscriptions</p><p className="font-medium">650,000 FC</p></div>
                          <div className="flex justify-between text-red-600"><p>Dépenses</p><p className="font-medium">-420,000 FC</p></div>
                        </div>
                        <div className="mt-4 pt-4 border-t-2 border-gray-800 flex justify-between font-bold text-lg">
                          <p>Solde Net</p>
                          <p className="text-brand-green">2,030,000 FC</p>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Les Avantages Clés de UBank</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-transparent hover:border-brand-green transition-colors duration-300">
                <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="h-8 w-8 text-brand-green" />
                </div>
                <h3 className="mt-6 text-xl font-bold">Transparence et Contrôle</h3>
                <p className="mt-2 text-gray-600">Suivez chaque transaction et gardez un contrôle total sur les finances de votre école.</p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-transparent hover:border-brand-green transition-colors duration-300">
                <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="h-8 w-8 text-brand-green" />
                </div>
                <h3 className="mt-6 text-xl font-bold">Optimisation des Recettes</h3>
                <p className="mt-2 text-gray-600">Maximisez vos revenus grâce à un suivi rigoureux des paiements et des rappels automatiques.</p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-transparent hover:border-brand-green transition-colors duration-300">
                <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto">
                    <FileSignature className="h-8 w-8 text-brand-green" />
                </div>
                <h3 className="mt-6 text-xl font-bold">Conformité Assurée</h3>
                <p className="mt-2 text-gray-600">Générez des rapports financiers conformes aux normes pour une gestion sereine.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-brand-blue">
          <div className="max-w-4xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Prêt à Transformer la Gestion Financière de Votre École ?
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Découvrez par vous-même comment UBank peut simplifier votre comptabilité et sécuriser vos revenus.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-brand-blue shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300"
              >
                Demander une Démo
              </Link>
              <Link
                to="/tarifs"
                className="inline-flex items-center justify-center rounded-lg bg-transparent border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white hover:text-brand-blue transform hover:scale-105 transition-all duration-300"
              >
                Voir les Tarifs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
