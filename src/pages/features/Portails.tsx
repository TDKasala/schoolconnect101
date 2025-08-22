import { ArrowLeft, Users, MessageCircle, Bell, Calendar, BookOpen, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PortailsFeature() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full mb-3">Fonctionnalités</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Portails pour Enseignants, Parents et Administrateurs</h1>
          <p className="mt-3 text-gray-600 max-w-2xl">Trois portails spécialisés pour répondre aux besoins spécifiques de chaque acteur de votre établissement scolaire.</p>
          <div className="mt-6 flex items-center gap-3">
            <Link to="/" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l’accueil
            </Link>
            <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20-%20Portails" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Demander une démo</a>
            <Link to="/tarifs" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Voir les tarifs</Link>
          </div>
        </div>
      </section>

      {/* Three cards */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-blue-700"><Users className="h-5 w-5" /><h3 className="font-semibold">Portail Parent</h3></div>
            <p className="mt-2 text-sm text-gray-600">Accès complet aux informations de votre enfant avec suivi en temps réel.</p>
            <ul className="mt-3 text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Suivi quotidien des progrès</li>
              <li>Communication facilitée</li>
              <li>Transparence financière</li>
              <li>Notifications importantes</li>
            </ul>
            <p className="mt-4 text-xs font-semibold text-gray-900">Fonctionnalités principales</p>
            <ul className="mt-1 text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Consultation des notes en temps réel</li>
              <li>Suivi des paiements et factures</li>
              <li>Réception d'annonces importantes</li>
              <li>Consultation de l'emploi du temps</li>
              <li>Historique des présences</li>
              <li>Communication directe avec les enseignants</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-emerald-700"><BookOpen className="h-5 w-5" /><h3 className="font-semibold">Portail Enseignant</h3></div>
            <p className="mt-2 text-sm text-gray-600">Outils dédiés pour optimiser l'enseignement et la communication.</p>
            <ul className="mt-3 text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Gain de temps considérable</li>
              <li>Suivi personnalisé des élèves</li>
              <li>Communication efficace</li>
              <li>Organisation optimisée</li>
            </ul>
            <p className="mt-4 text-xs font-semibold text-gray-900">Fonctionnalités principales</p>
            <ul className="mt-1 text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Gestion du carnet de notes numérique</li>
              <li>Pointage des présences simplifié</li>
              <li>Communication avec parents et admin</li>
              <li>Planification des cours</li>
              <li>Suivi des devoirs et évaluations</li>
              <li>Rapports de performance</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-purple-700"><Settings className="h-5 w-5" /><h3 className="font-semibold">Portail Administrateur</h3></div>
            <p className="mt-2 text-sm text-gray-600">Centre de commande pour la gestion globale de l'établissement.</p>
            <ul className="mt-3 text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Contrôle total de l'école</li>
              <li>Vue d'ensemble complète</li>
              <li>Gestion simplifiée</li>
              <li>Décisions éclairées</li>
            </ul>
            <p className="mt-4 text-xs font-semibold text-gray-900">Fonctionnalités principales</p>
            <ul className="mt-1 text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Gestion du personnel et des rôles</li>
              <li>Configuration de l'école</li>
              <li>Supervision des activités</li>
              <li>Rapports et statistiques globales</li>
              <li>Gestion des classes et matières</li>
              <li>Contrôle des accès et permissions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Communication */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary-600" /><p className="font-medium">Messagerie intégrée</p></div>
            <p className="mt-1 text-gray-600">Communication directe entre parents, enseignants et administration.</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-primary-600" /><p className="font-medium">Notifications en temps réel</p></div>
            <p className="mt-1 text-gray-600">Alertes instantanées pour les événements importants.</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary-600" /><p className="font-medium">Calendrier partagé</p></div>
            <p className="mt-1 text-gray-600">Synchronisation des événements et rendez-vous importants.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
