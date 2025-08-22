import { ArrowLeft, Users, MessageCircle, Bell, Calendar, Lock, FileText, Wallet, BookOpen, Shield, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Portails() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full mb-3">Portails</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Portails pour Enseignants, Parents et Administrateurs</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Trois portails spécialisés pour répondre aux besoins spécifiques de chaque acteur de votre établissement scolaire.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20-%20Portails" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Demander une démo</a>
            <Link to="/tarifs" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Voir les tarifs</Link>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <Link to="/" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l’accueil
            </Link>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Portails Spécialisés pour chaque Acteur</h2>
            <p className="mt-2 text-gray-600">Enseignants, Parents et Administrateurs disposent chacun d'un portail dédié</p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Parent */}
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

            {/* Enseignant */}
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

            {/* Admin */}
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
        </div>
      </section>

      {/* Communication */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Communication Renforcée</h2>
            <p className="mt-2 text-gray-600">Des outils de communication modernes pour maintenir le lien entre tous les acteurs</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
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
            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary-600" /><p className="font-medium">Transparence totale</p></div>
              <p className="mt-1 text-gray-600">Accès aux informations en temps réel pour tous.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Exemple Portail Parent */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Exemple : Portail Parent</h2>
            <p className="mt-2 text-gray-600">Découvrez comment les parents peuvent suivre facilement les progrès de leur enfant et rester connectés avec l'école.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>Accès 24h/24, 7j/7 depuis n'importe quel appareil</li>
                <li>Notifications automatiques pour les événements importants</li>
                <li>Suivi des paiements et historique financier</li>
              </ul>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Moyenne générale</p>
                  <p className="text-xl font-bold text-gray-900">15.2/20</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Présences ce mois</p>
                  <p className="text-xl font-bold text-gray-900">18/20 jours</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Frais scolaires</p>
                  <p className="text-xl font-bold text-gray-900">À jour</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Dernières annonces</p>
                  <p className="text-gray-900">Réunion parents-professeurs le 15 mars à 14h</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-tr from-blue-600 to-primary-600 text-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Marie Kabongo</p>
                  <p className="text-white/80 text-sm">6ème A - Élève</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/80">Moyenne générale</p>
                  <p className="text-2xl font-bold">15.2/20</p>
                </div>
                <div>
                  <p className="text-white/80">Présences</p>
                  <p className="text-2xl font-bold">18/20 jours</p>
                </div>
                <div>
                  <p className="text-white/80">Frais scolaires</p>
                  <p className="text-2xl font-bold">À jour</p>
                </div>
                <div>
                  <p className="text-white/80">Annonce</p>
                  <p className="font-semibold">Réunion le 15 mars 14h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Connectez Enseignants, Parents et Administrateurs</h3>
            <p className="mt-2 text-gray-600">Découvrez comment nos trois portails spécialisés peuvent transformer la communication dans votre école.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20-%20Portails" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Demander une démo</a>
              <Link to="/tarifs" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Voir les tarifs</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
