import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Users, GraduationCap, UserCog, MessageSquare, Bell, Calendar, ShieldCheck } from 'lucide-react';

const portals = [
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: 'Portail Parent',
    description: 'Accès complet aux informations de votre enfant avec suivi en temps réel.',
    benefits: ['Suivi quotidien des progrès', 'Communication facilitée', 'Transparence financière', 'Notifications importantes'],
    features: ['Consultation des notes en temps réel', 'Suivi des paiements et factures', 'Réception d\'annonces importantes', 'Consultation de l\'emploi du temps', 'Historique des présences', 'Communication directe avec les enseignants'],
  },
  {
    icon: <GraduationCap className="h-8 w-8 text-blue-600" />,
    title: 'Portail Enseignant',
    description: 'Outils dédiés pour optimiser l\'enseignement et la communication.',
    benefits: ['Gain de temps considérable', 'Suivi personnalisé des élèves', 'Communication efficace', 'Organisation optimisée'],
    features: ['Gestion du carnet de notes numérique', 'Pointage des présences simplifié', 'Communication avec parents et admin', 'Planification des cours', 'Suivi des devoirs et évaluations', 'Rapports de performance'],
  },
  {
    icon: <UserCog className="h-8 w-8 text-blue-600" />,
    title: 'Portail Administrateur',
    description: 'Centre de commande pour la gestion globale de l\'établissement.',
    benefits: ['Contrôle total de l\'école', 'Vue d\'ensemble complète', 'Gestion simplifiée', 'Décisions éclairées'],
    features: ['Gestion du personnel et des rôles', 'Configuration de l\'école', 'Supervision des activités', 'Rapports et statistiques globales', 'Gestion des classes et matières', 'Contrôle des accès et permissions'],
  },
];

export default function Portails() {
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
            Portails pour Enseignants, Parents et Administrateurs
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
            Trois portails spécialisés pour répondre aux besoins spécifiques de chaque acteur de votre établissement scolaire.
          </p>
          <div className="mt-8">
            <a
              href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20-%20Module%20Portails"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Demander une démo
            </a>
          </div>
        </div>
      </div>

      {/* Portals Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Portails Spécialisés pour chaque Acteur</h2>
            <p className="mt-4 text-lg text-gray-500">
              Enseignants, Parents et Administrateurs disposent chacun d'un portail dédié
            </p>
          </div>
          <div className="mt-16 space-y-16">
            {portals.map((portal) => (
              <div key={portal.title} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="flex items-center gap-4">
                            {portal.icon}
                            <h3 className="text-2xl font-bold text-gray-900">{portal.title}</h3>
                        </div>
                        <p className="mt-4 text-gray-600">{portal.description}</p>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            {portal.benefits.map(benefit => (
                                <div key={benefit} className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    <span className="ml-2 text-sm font-medium text-gray-700">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Fonctionnalités principales</h4>
                        <ul className="mt-3 space-y-2">
                            {portal.features.map(feature => (
                                <li key={feature} className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                                    <span className="ml-2 text-sm text-gray-600">{feature}</span>
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

      {/* Communication Section */}
      <div className="bg-blue-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">Communication Renforcée</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Des outils de communication modernes pour maintenir le lien entre tous les acteurs</p>
            </div>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div className="p-4">
                    <MessageSquare className="h-10 w-10 text-blue-600 mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold">Messagerie intégrée</h3>
                    <p className="mt-1 text-gray-600">Communication directe entre parents, enseignants et administration.</p>
                </div>
                <div className="p-4">
                    <Bell className="h-10 w-10 text-blue-600 mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold">Notifications en temps réel</h3>
                    <p className="mt-1 text-gray-600">Alertes instantanées pour les événements importants.</p>
                </div>
                <div className="p-4">
                    <Calendar className="h-10 w-10 text-blue-600 mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold">Calendrier partagé</h3>
                    <p className="mt-1 text-gray-600">Synchronisation des événements et rendez-vous importants.</p>
                </div>
                <div className="p-4">
                    <ShieldCheck className="h-10 w-10 text-blue-600 mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold">Transparence totale</h3>
                    <p className="mt-1 text-gray-600">Accès aux informations en temps réel pour tous.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Parent Portal Example */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                <div className="">
                    <h2 className="text-3xl font-extrabold text-gray-900">Exemple : Portail Parent</h2>
                    <p className="mt-4 text-lg text-gray-600">Découvrez comment les parents peuvent suivre facilement les progrès de leur enfant et rester connectés avec l'école.</p>
                    <ul className="mt-6 space-y-3">
                        <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mt-0.5"/><span className="ml-3">Accès 24h/24, 7j/7 depuis n'importe quel appareil</span></li>
                        <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mt-0.5"/><span className="ml-3">Notifications automatiques pour les événements importants</span></li>
                        <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-500 mt-0.5"/><span className="ml-3">Suivi des paiements et historique financier</span></li>
                    </ul>
                </div>
                <div className="mt-10 lg:mt-0">
                    <div className="bg-gray-100 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-4">
                            <img className="h-16 w-16 rounded-full" src="/images/student-avatar.png" alt="Avatar élève" />
                            <div>
                                <h4 className="font-bold text-lg text-gray-800">Marie Kabongo</h4>
                                <p className="text-sm text-gray-600">6ème A - Élève</p>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-sm text-gray-500">Moyenne</p>
                                <p className="font-bold text-xl text-blue-700">15.2/20</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Présences</p>
                                <p className="font-bold text-xl text-blue-700">18/20 j</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Frais scolaires</p>
                                <p className="font-bold text-lg text-green-600">À jour</p>
                            </div>
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <h5 className="font-semibold text-gray-700">Dernières annonces</h5>
                            <p className="mt-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">Réunion parents-professeurs le 15 mars à 14h</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Final CTA */}
       <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Connectez Enseignants, Parents et Administrateurs</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-500">Découvrez comment nos trois portails spécialisés peuvent transformer la communication dans votre école.</p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20-%20Module%20Portails" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Demander une démo
            </a>
            <Link to="/tarifs" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
              Voir les tarifs
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
