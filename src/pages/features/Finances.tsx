import { ArrowLeft, CheckCircle2, CreditCard, Receipt, PieChart, TrendingUp, ListChecks, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Finances() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="inline-flex items-center gap-2 text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full mb-3">Fonctionnalités</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Module Finances</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Maîtrisez parfaitement vos finances scolaires avec des outils de gestion comptable adaptés aux réalités des écoles congolaises.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l’accueil
            </Link>
            <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20Finances" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              Demander une démo
            </a>
          </div>
        </div>
      </section>

      {/* Gestion Financière Complète */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">Gestion Financière Complète</h2>
            <p className="mt-2 text-gray-600">De l'inscription au suivi budgétaire, gérez toutes vos finances en toute transparence</p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gestion des inscriptions */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <ListChecks className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Gestion des inscriptions</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Processus d'inscription simplifié avec suivi automatique des frais d'entrée.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Inscription en ligne</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Validation automatique</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Suivi des documents</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Confirmation par SMS/Email</li>
              </ul>
            </div>

            {/* Suivi des frais scolaires */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Suivi des frais scolaires (Minerval)</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Gestion complète des paiements mensuels avec échéanciers personnalisables.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Échéanciers flexibles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Rappels automatiques</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Historique des paiements</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Gestion des retards</li>
              </ul>
            </div>

            {/* Génération de reçus */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <Receipt className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Génération de reçus automatiques</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Création instantanée de reçus officiels avec numérotation automatique.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Reçus instantanés</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Numérotation automatique</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Format officiel</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Envoi par email/SMS</li>
              </ul>
            </div>

            {/* Suivi des dépenses */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Suivi des dépenses de l'école</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Gestion budgétaire complète avec catégorisation des dépenses.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Catégories de dépenses</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Budgets prévisionnels</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Contrôle des coûts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Rapports détaillés</li>
              </ul>
            </div>

            {/* Tableaux de bord financiers */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <PieChart className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Tableaux de bord financiers</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Visualisation en temps réel de la santé financière de l'établissement.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Graphiques interactifs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Indicateurs clés</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Prévisions financières</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Analyses comparatives</li>
              </ul>
            </div>

            {/* Rapports financiers */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Rapports financiers</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Génération automatique de rapports comptables et financiers.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Bilans automatiques</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Rapports personnalisés</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Export Excel/PDF</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Conformité comptable</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tableau de bord financier */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tableau de bord financier en temps réel</h2>
            <div className="mt-6 space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900">Suivi en temps réel</h3>
                <p className="text-sm text-gray-600">Visualisez instantanément l'état de vos finances avec des indicateurs mis à jour automatiquement.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analyses détaillées</h3>
                <p className="text-sm text-gray-600">Comprenez vos flux financiers avec des graphiques et analyses approfondies.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Rapports automatiques</h3>
                <p className="text-sm text-gray-600">Générez des rapports financiers professionnels en un clic.</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20Finances" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Demander une démo</a>
              <a href="#cta" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Voir les tarifs</a>
            </div>
          </div>

          {/* Aperçu financier */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900">Aperçu financier</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-primary-50 p-4">
                <p className="text-gray-600">2,450,000</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">USD <span className="text-sm font-medium text-gray-700">Recettes ce mois</span></p>
              </div>
              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-gray-600">Taux de paiement</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">89%</p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-4">
                <p className="text-gray-600">Frais scolaires</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">$1,800 USD</p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-4">
                <p className="text-gray-600">Inscriptions</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">$650 USD</p>
              </div>
              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-gray-600">Dépenses</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">-$420 USD</p>
              </div>
              <div className="rounded-xl bg-yellow-50 p-4">
                <p className="text-gray-600">Solde net</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">$2,030 USD</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16" id="cta">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Maîtrisez vos finances scolaires</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Découvrez comment le module Finances peut améliorer la gestion financière de votre école.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20Finances" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Demander une démo</a>
            <a href="#cta" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Voir les tarifs</a>
          </div>
        </div>
      </section>
    </main>
  )
}
